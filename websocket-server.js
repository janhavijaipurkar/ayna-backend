const WebSocket = require('ws');
const http = require('http');
const { createStrapi } = require('@strapi/strapi'); // Correct import for Strapi v5

// Initialize Strapi
async function initializeStrapi() {
  const strapiInstance = await createStrapi({ dir: process.cwd() });
  await strapiInstance.load();
  await strapiInstance.start();
  return strapiInstance;
}

// Main function to start the server
async function startServer() {
  const strapiInstance = await initializeStrapi();
  
  // Create an HTTP server using Strapi's app
  const server = http.createServer(strapiInstance.server.app);
  
  // Create a WebSocket server attached to the HTTP server
  const wss = new WebSocket.Server({ server });
  
  // WebSocket connection handler
  wss.on('connection', (ws) => {
    console.log('A user connected');
    
    // Handle incoming messages
    ws.on('message', (message) => {
      console.log('Received:', message.toString());
      
      // Echo the message back to the client in JSON format
      const messageData = {
        type: 'echo',
        content: message.toString(),
        timestamp: new Date().toISOString()
      };
      
      ws.send(JSON.stringify(messageData));
    });
    
    // Handle client disconnection
    ws.on('close', () => {
      console.log('A user disconnected');
    });
  });
  
  // Start the server on port 1337
  server.listen(1337, () => {
    console.log('Server is running on http://localhost:1337');
    console.log('WebSocket server is running on ws://localhost:1337');
  });
}

// Start the server
startServer().catch((err) => {
  console.error('Error starting server:', err);
  process.exit(1);
});