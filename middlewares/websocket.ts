import WebSocket from 'ws';

export default ({ strapi }: { strapi: any }) => {
  return {
    initialize() {
      const wss = new WebSocket.Server({ server: strapi.server.httpServer });

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

      console.log('WebSocket server initialized on Strapi\'s HTTP server');
    },
  };
};