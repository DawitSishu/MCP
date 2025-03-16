import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { summarizeChat, type Message } from "./openai.js";

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

// Tool to summarize chat history
server.tool(
  "summarize-chat",
  {
    messages: z.array(MessageSchema)
  },
  async ({ messages }) => {
    try {
      console.error(`Received ${messages.length} messages to summarize`);
      
      // Call OpenAI to generate a summary
      const summary = await summarizeChat(messages as Message[]);
      
      console.error(`Generated summary: ${summary.substring(0, 100)}...`);
      
      return {
        content: [{ type: "text", text: summary }]
      };
    } catch (error) {
      console.error("Error in summarize-chat tool:", error);
      return {
        content: [{ type: "text", text: `Error generating summary: ${(error as Error).message}` }],
        isError: true
      };
    }
  }
);

// Add a prompt for summarizing chat
server.prompt(
  "summarize-chat",
  "Summarize a chat conversation",
  () => ({
    messages: [{
      role: "user",
      content: {
        type: "text",
        text: "Please analyze the provided chat history and create a concise summary highlighting key points, questions, and decisions."
      }
    }]
  })
);

// Start the server
async function main() {
  try {
    // Check for OpenAI API key
    const apiKey = process.env.OPENAI_API_KEY;
    
    if (!apiKey) {
      console.error("Error: OPENAI_API_KEY environment variable is not set");
      // Instead of exiting, let's continue but log the error
      console.error("The server will start, but summarization will fail without an API key");
    } else {
      console.error("API key found, length: " + apiKey.length);
    }

    console.error("Starting ChatSummary MCP server...");
    
    // Start receiving messages on stdin and sending messages on stdout
    const transport = new StdioServerTransport();
    await server.connect(transport);
    
    console.error("ChatSummary MCP server connected");
  } catch (error) {
    console.error("Error starting server:", error);
    process.exit(1);
  }
}

main(); 