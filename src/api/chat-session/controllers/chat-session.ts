import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::chat-session.chat-session', ({ strapi }) => ({
  async getUserSessions(ctx) {
    try {
      const { userId } = ctx.params;

      // ✅ Fetch sessions for user & include messages
      const sessions = await strapi.entityService.findMany('api::chat-session.chat-session', {
        filters: { uid: userId },
        populate: ['message'],  // ✅ Auto-fetch related messages
      });

      if (!sessions || sessions.length === 0) {
        return ctx.notFound('No chat sessions found for this user.');
      }

      return ctx.send({ data: sessions });
    } catch (error) {
      ctx.throw(400, 'Error fetching chat sessions');
    }
  },

  async createSession(ctx) {
    try {
      const { userId } = ctx.request.body;

      const newSession = await strapi.entityService.create('api::chat-session.chat-session', {
        data: {
          uid: userId,
          sessionid: `session-${Date.now()}`,
          starttime: new Date().toISOString(),
        },
      });

      return ctx.send({ data: newSession });
    } catch (error) {
      ctx.throw(400, 'Error creating new session');
    }
  },
}));


// import { factories } from '@strapi/strapi'

// export default factories.createCoreController('api::chat-session.chat-session');
