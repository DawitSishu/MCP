import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { summarizeChat } from "./openai.js";
import * as dotenv from 'dotenv';
// Load environment variables
dotenv.config();
// Create an MCP server
const server = new McpServer({
    name: "ChatSummary",
    version: "1.0.0",
    description: "An MCP server that summarizes chat history using OpenAI"
});
// Define the message schema
const MessageSchema = z.object({
    role: z.string(),
    content: z.string()
});
// Tool to get chat summary
server.tool("get_chat_summary", {
    messages: z.array(MessageSchema),
    includeOriginalMessages: z.boolean().optional()
}, async ({ messages, includeOriginalMessages = false }) => {
    try {
        console.error(`Received ${messages.length} messages to summarize`);
        // Call OpenAI to generate a summary
        const summary = await summarizeChat(messages);
        console.error(`Generated summary: ${summary.substring(0, 100)}...`);
        // Format the response based on whether we should include original messages
        const response = includeOriginalMessages ?
            `Summary:\n${summary}\n\nOriginal Messages:\n${messages.map(m => `${m.role}: ${m.content}`).join('\n')}` :
            summary;
        return {
            content: [{ type: "text", text: response }]
        };
    }
    catch (error) {
        console.error("Error in get_chat_summary tool:", error);
        return {
            content: [{ type: "text", text: `Error generating summary: ${error.message}` }],
            isError: true
        };
    }
});
// Tool to process messages with summary
server.tool("process_with_summary", {
    messages: z.array(MessageSchema),
    query: z.string()
}, async ({ messages, query }) => {
    try {
        console.error(`Processing query with ${messages.length} messages of history`);
        // Generate a summary first
        const summary = await summarizeChat(messages);
        // Create a response that includes both summary and the new query
        const response = `Here's a summary of the conversation so far:\n\n${summary}\n\nNow, to address your question: "${query}"\n\n`;
        return {
            content: [{ type: "text", text: response }]
        };
    }
    catch (error) {
        console.error("Error in process_with_summary tool:", error);
        return {
            content: [{ type: "text", text: `Error processing request: ${error.message}` }],
            isError: true
        };
    }
});
// Add a prompt for summarizing chat
server.prompt("summarize-chat", "Summarize a chat conversation", () => ({
    messages: [{
            role: "user",
            content: {
                type: "text",
                text: "Please analyze the provided chat history and create a concise summary highlighting key points, questions, and decisions."
            }
        }]
}));
// Start the server
async function main() {
    try {
        // Check for OpenAI API key
        if (!process.env.OPENAI_API_KEY) {
            console.error("Error: OPENAI_API_KEY environment variable is not set");
            console.error("The server will start, but summarization will fail without an API key");
        }
        console.error("Starting ChatSummary MCP server...");
        // Start receiving messages on stdin and sending messages on stdout
        const transport = new StdioServerTransport();
        await server.connect(transport);
        console.error("ChatSummary MCP server connected");
    }
    catch (error) {
        console.error("Error starting server:", error);
        process.exit(1);
    }
}
main();
