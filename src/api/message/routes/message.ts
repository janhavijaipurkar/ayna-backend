export default {
    routes: [
      {
        method: 'GET',
        path: '/messages/session/:sessionId',
        handler: 'message.getMessagesBySession',
        config: { auth: false },
      },
      {
        method: 'POST',
        path: '/messages/send',
        handler: 'message.createMessage',
        config: { auth: false },
      },
    ],
  };
  

// import { factories } from '@strapi/strapi';

// export default factories.createCoreRouter('api::message.message');
