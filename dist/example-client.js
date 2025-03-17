import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import * as dotenv from 'dotenv';
// Load environment variables from .env file
dotenv.config();
async function main() {
    try {
        // Check for OpenAI API key
        if (!process.env.OPENAI_API_KEY) {
            console.error("Error: OPENAI_API_KEY environment variable is not set");
            console.error("Please create a .env file with your OpenAI API key");
            process.exit(1);
        }
        // Sample chat history
        const chatHistory = [
            { role: "user", content: "I want to build an MCP server that can summarize chat history" },
            { role: "assistant", content: "I'll help you build an MCP server that uses OpenAI to summarize chat history. We'll need to set up a TypeScript project with the necessary dependencies." },
            { role: "user", content: "Let's do it" },
            { role: "assistant", content: "We created a new TypeScript project with MCP SDK and OpenAI dependencies. We implemented a server that exposes tools for chat summarization." },
            { role: "user", content: "The MCP isn't working in Cursor" },
            { role: "assistant", content: "We identified issues with the OpenAI API key handling and updated the server to be more resilient. We also added new tools: 'get_chat_summary' and 'process_with_summary' to better integrate with Cursor's workflow." }
        ];
        // Create a client transport that communicates with the server
        const transport = new StdioClientTransport({
            command: "node",
            args: ["dist/index.js"],
            env: {
                OPENAI_API_KEY: process.env.OPENAI_API_KEY || ""
            }
        });
        // Create an MCP client
        const client = new Client({
            name: "example-client",
            version: "1.0.0"
        }, {
            capabilities: {
                tools: {}
            }
        });
        // Connect to the server
        console.log("Connecting to MCP server...");
        await client.connect(transport);
        console.log("Connected to MCP server");
        // Call the get_chat_summary tool
        console.log("Calling get_chat_summary tool...");
        const result = await client.callTool({
            name: "get_chat_summary",
            arguments: {
                messages: chatHistory,
                includeOriginalMessages: true
            }
        });
        console.log("\nProcessed Summary:");
        if (result.content && Array.isArray(result.content) && result.content.length > 0) {
            const textContent = result.content.find(item => item.type === "text");
            if (textContent && "text" in textContent) {
                console.log(textContent.text);
            }
            else {
                console.log("No text content found in the response");
            }
        }
        else {
            console.log("No content in the response");
        }
        process.exit(0);
    }
    catch (error) {
        console.error("Error:", error);
        process.exit(1);
    }
}
main();
