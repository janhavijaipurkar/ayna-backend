import { Core } from '@strapi/strapi';
import WebSocket from 'ws';

export default {
  async bootstrap({ strapi }: { strapi: Core.Strapi }) {
    if (!strapi.server?.httpServer) {
      strapi.log.error('HTTP Server not found');
      return;
    }

    const wss = new WebSocket.Server({ port: 1338 });

    wss.on('connection', (ws) => {
      console.log('A user connected');

      ws.on('message', async (message) => {
        console.log('Received:', message.toString());
        const messageToSend = JSON.parse(message.toString());

        // Ensure session exists before storing messages
        const sessionId = messageToSend.sessionId || await generateSessionIdForUser(messageToSend.userId);

        // Store message linked to session
        await strapi.entityService.create('api::message.message', {
          data: {
            content: messageToSend.content,
            DateTime: new Date(),
            chatsession: sessionId,  // Link to session
          },
        });

        const messageData = {
          type: 'echo',
          content: messageToSend.content,
          timestamp: new Date().toISOString(),
        };

        ws.send(JSON.stringify(messageData));
      });

      ws.on('close', () => {
        console.log('A user disconnected');
      });
    });

    console.log("WebSocket server initialized on Strapi's HTTP server");
  },
};

// Ensure a ChatSession exists for the user
async function generateSessionIdForUser(userId) {
  const existingSession = await strapi.entityService.findMany('api::chat-session.chat-session', {
    filters: { uid: userId },
    sort: [{ starttime: 'desc' }], // Get latest session
    limit: 1
  });

  if (existingSession.length > 0) {
    return existingSession[0].id; // Use existing session
  }

  // Create a new session
  const newSession = await strapi.entityService.create('api::chat-session.chat-session', {
    data: {
      uid: userId,
      starttime: new Date(),
    },
  });

  return newSession.id;
}


// //dada cha code
// import { Core } from '@strapi/strapi';
// import WebSocket from 'ws';

// export default {
//   async bootstrap({ strapi }: { strapi: Core.Strapi }) {
//     if (!strapi.server?.httpServer) {
//       strapi.log.error('HTTP Server not found');
//       return;
//     }

//     const wss = new WebSocket.Server({ port: 1338 });

//     wss.on('connection', (ws) => {
//       console.log('A user connected');

//       ws.on('message', async (message) => {
//         console.log('Received:', message.toString());
//         const messageToSend = JSON.parse(message.toString());
//         const messageData = {
//           type: 'echo',
//           content: messageToSend.content,
//           timestamp: new Date().toISOString(),
//         };

//         await strapi.documents('api::message.message').create({
//           data: {
//             content: messageToSend.content,
//             DateTime: new Date(),
//           },
//         });

//         // store into strapi
//         ws.send(JSON.stringify(messageData));
//       });

//       ws.on('close', () => {
//         console.log('A user disconnected');
//       });
//     });

//     console.log("WebSocket server initialized on Strapi's HTTP server");
//   },
// };


