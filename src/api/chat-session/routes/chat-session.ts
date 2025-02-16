export default {
    routes: [
      {
        method: 'GET',
        path: '/chat-sessions/user/:userId',
        handler: 'chat-session.getUserSessions',
        config: { auth: false },
      },
      {
        method: 'POST',
        path: '/chat-sessions/create',
        handler: 'chat-session.createSession',
        config: { auth: false },
      },
    ],
  };
  
  
// import { factories } from '@strapi/strapi';

// export default factories.createCoreRouter('api::chat-session.chat-session');
