# Chat Summary MCP Server

This project implements a Model Context Protocol (MCP) server that can summarize chat history using OpenAI's API.

## Project Structure

- `src/index.ts`: Main MCP server implementation
- `src/openai.ts`: OpenAI client for summarizing chat history
- `src/example-client.ts`: Example client that demonstrates how to use the MCP server
- `test.js`: Simple script to test the MCP server
- `.env.example`: Sample environment variables file

## Features

The MCP server exposes:

1. A **tool** called `summarize-chat` that accepts an array of chat messages and returns a summary
2. A **prompt** called `summarize-chat` that provides a template for summarizing chat history

## How It Works

1. The client sends chat history to the MCP server
2. The server uses OpenAI's API to generate a concise summary
3. The summary is returned to the client

## Usage

1. Set your OpenAI API key in a `.env` file (copy from `.env.example`)
2. Build the project with `npm run build`
3. Run the test script with `node test.js`

## Integration with Clients

This MCP server can be integrated with any MCP-compatible client, including:

- Claude.app
- MCP Inspector
- Custom applications using the MCP SDK

## Example

```typescript
// Example of calling the summarize-chat tool
const result = await client.callTool({
  name: "summarize-chat",
  arguments: {
    messages: [
      { role: "user", content: "Hello, how are you?" },
      { role: "assistant", content: "I'm doing well, thank you!" },
      { role: "user", content: "Can you help me with my project?" }
    ]
  }
});

console.log(result.content[0].text); // Outputs the summary
``` 