// Simple script to test the MCP server
// Run with: node test.js

import('dotenv/config')
  .then(() => {
    if (!process.env.OPENAI_API_KEY) {
      console.error('Error: OPENAI_API_KEY environment variable is not set');
      console.error('Please set it before running this script:');
      console.error('  set OPENAI_API_KEY=your_api_key_here  (Windows)');
      console.error('  export OPENAI_API_KEY=your_api_key_here  (macOS/Linux)');
      process.exit(1);
    }
    
    console.log('Running example client...');
    return import('./dist/example-client.js');
  })
  .catch(error => {
    console.error('Error:', error);
    process.exit(1);
  }); 