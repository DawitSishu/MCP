import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import { spawn } from "child_process";

async function main() {
  try {
    // Sample chat history
    const chatHistory = [
      { role: "user", content: "Hello, can you help me understand how to use React hooks?" },
      { role: "assistant", content: "Of course! React hooks are functions that let you use state and other React features in functional components. The most common hooks are useState, useEffect, useContext, useReducer, and useRef. What specific aspect would you like to learn about?" },
      { role: "user", content: "I'm confused about the useEffect hook. When does it run?" },
      { role: "assistant", content: "The useEffect hook runs after every render by default. It's React's way of handling side effects in functional components. You can think of it as componentDidMount, componentDidUpdate, and componentWillUnmount combined.\n\nHere's a basic example:\n\n```jsx\nuseEffect(() => {\n  // This code runs after every render\n  console.log('Component rendered');\n  \n  // Optional cleanup function\n  return () => {\n    console.log('Component will unmount or re-render');\n  };\n});\n```\n\nYou can also control when it runs by providing a dependency array as the second argument:\n\n```jsx\nuseEffect(() => {\n  // This only runs when count changes\n  console.log('Count changed to:', count);\n}, [count]);\n\nuseEffect(() => {\n  // This only runs once after the initial render\n  console.log('Component mounted');\n}, []);\n```\n\nDoes that help clarify when useEffect runs?" },
      { role: "user", content: "Yes, that's helpful. So if I want to fetch data when my component loads, I should use an empty dependency array?" },
      { role: "assistant", content: "Exactly! Using an empty dependency array (`[]`) is perfect for data fetching on component mount. Here's how you might implement that:\n\n```jsx\nimport { useState, useEffect } from 'react';\n\nfunction UserProfile({ userId }) {\n  const [userData, setUserData] = useState(null);\n  const [loading, setLoading] = useState(true);\n  const [error, setError] = useState(null);\n\n  useEffect(() => {\n    // This will only run once when the component mounts\n    async function fetchUserData() {\n      try {\n        setLoading(true);\n        const response = await fetch(`https://api.example.com/users/${userId}`);\n        if (!response.ok) throw new Error('Failed to fetch');\n        const data = await response.json();\n        setUserData(data);\n      } catch (err) {\n        setError(err.message);\n      } finally {\n        setLoading(false);\n      }\n    }\n\n    fetchUserData();\n  }, []); // Empty dependency array means it only runs once on mount\n\n  if (loading) return <div>Loading...</div>;\n  if (error) return <div>Error: {error}</div>;\n  if (!userData) return null;\n\n  return (\n    <div>\n      <h1>{userData.name}</h1>\n      <p>{userData.email}</p>\n    </div>\n  );\n}\n```\n\nHowever, there's one important caveat: if your effect uses any values from props or state, you should include them in the dependency array to avoid stale closures. In the example above, `userId` should actually be in the dependency array:\n\n```jsx\nuseEffect(() => {\n  // Fetch logic here\n}, [userId]); // Re-run the effect if userId changes\n```\n\nThis ensures that if the userId prop changes, your component will fetch the new user's data." }
    ];

    console.log("Starting MCP server...");
    
    // Start the MCP server as a child process
    const serverProcess = spawn("node", ["dist/index.js"], {
      env: {
        ...process.env,
        OPENAI_API_KEY: process.env.OPENAI_API_KEY
      }
    });

    // Log server output for debugging
    serverProcess.stderr.on("data", (data: Buffer) => {
      console.log(`Server log: ${data.toString()}`);
    });

    // Create a client transport that communicates with the server
    const transport = new StdioClientTransport({
      command: "node",
      args: ["dist/index.js"],
      env: {
        OPENAI_API_KEY: process.env.OPENAI_API_KEY || ""
      }
    });

    // Create an MCP client
    const client = new Client(
      {
        name: "example-client",
        version: "1.0.0"
      },
      {
        capabilities: {
          tools: {}
        }
      }
    );

    // Connect to the server
    console.log("Connecting to MCP server...");
    await client.connect(transport);
    console.log("Connected to MCP server");

    // Call the summarize-chat tool
    console.log("Calling summarize-chat tool...");
    const result = await client.callTool({
      name: "summarize-chat",
      arguments: {
        messages: chatHistory
      }
    });

    console.log("\nChat Summary:");
    if (result.content && Array.isArray(result.content) && result.content.length > 0) {
      const textContent = result.content.find(item => item.type === "text");
      if (textContent && "text" in textContent) {
        console.log(textContent.text);
      } else {
        console.log("No text content found in the response");
      }
    } else {
      console.log("No content in the response");
    }

    // Clean up
    serverProcess.kill();
    process.exit(0);
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
}

main(); 