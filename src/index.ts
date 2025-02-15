import WebSocket from 'ws';

export default {
  async bootstrap({ strapi }) {
    if (!strapi.server?.httpServer) {
      strapi.log.error('HTTP Server not found');
      return;
    }

    const wss = new WebSocket.Server({ server: strapi.server.httpServer });

    wss.on('connection', (ws) => {
      console.log('A user connected');

      ws.on('message', (message) => {
        console.log('Received:', message.toString());
        const messageData = {
          type: 'echo',
          content: message.toString(),
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

// // // import type { Core } from '@strapi/strapi';

// // export default {
// //   /**
// //    * An asynchronous register function that runs before
// //    * your application is initialized.
// //    *
// //    * This gives you an opportunity to extend code.
// //    */
// //   register(/* { strapi }: { strapi: Core.Strapi } */) {},

// //   /**
// //    * An asynchronous bootstrap function that runs before
// //    * your application gets started.
// //    *
// //    * This gives you an opportunity to set up your data model,
// //    * run jobs, or perform some special logic.
// //    */
// //   bootstrap(/* { strapi }: { strapi: Core.Strapi } */) {},
// // };
// // import type { Core } from '@strapi/strapi';

// export default {
//   /**
//    * An asynchronous register function that runs before
//    * your application is initialized.
//    *
//    * This gives you an opportunity to extend code.
//    */
//   register(/* { strapi }: { strapi: Core.Strapi } */) {},

//   /**
//    * An asynchronous bootstrap function that runs before
//    * your application gets started.
//    *
//    * This gives you an opportunity to set up your data model,
//    * run jobs, or perform some special logic.
//    */
//   bootstrap(/* { strapi }: { strapi: Core.Strapi } */) {},
// };
