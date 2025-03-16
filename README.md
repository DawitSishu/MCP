# Chat Summary MCP Server

An MCP (Model Context Protocol) server that summarizes chat history using OpenAI.

## Features

- Accepts chat history as input
- Uses OpenAI API to generate a concise summary
- Returns the summary through MCP protocol
- Can be integrated with any MCP-compatible client

## Prerequisites

- Node.js 18 or higher
- OpenAI API key

## Installation

1. Clone this repository
2. Install dependencies:

```bash
npm install
```

3. Build the TypeScript code:

```bash
npm run build
```

## Usage

1. Set your OpenAI API key as an environment variable:

```bash
# On Windows
set OPENAI_API_KEY=your_api_key_here

# On macOS/Linux
export OPENAI_API_KEY=your_api_key_here
```

2. Start the MCP server:

```bash
npm start
```

3. Connect to the server using an MCP client (like Claude.app or the MCP Inspector).

## API

The server exposes the following MCP tools and prompts:

### Tool: summarize-chat

Summarizes a chat history using OpenAI.

Parameters:
- `messages`: An array of message objects, each with `role` and `content` properties.

Example:
```json
{
  "messages": [
    {"role": "user", "content": "Hello, how are you?"},
    {"role": "assistant", "content": "I'm doing well, thank you! How can I help you today?"},
    {"role": "user", "content": "I need help with my project."}
  ]
}
```

### Prompt: summarize-chat

A prompt template for summarizing chat history.

Parameters:
- `messages`: An array of message objects, each with `role` and `content` properties.

## Development

For development with auto-reloading:

```bash
npm run dev
```

## Testing

You can test the server using the [MCP Inspector](https://github.com/modelcontextprotocol/inspector) tool.

## License

MIT 