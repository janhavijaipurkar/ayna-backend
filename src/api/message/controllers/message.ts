import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::message.message', ({ strapi }) => ({
  async getMessagesBySession(ctx) {
    try {
      const { sessionId } = ctx.params;

      // ✅ Ensure correct field name `chatsession.id`
      const messages = await strapi.entityService.findMany('api::message.message', {
        filters: { chatsessions: { id: sessionId } }, // ✅ Uses correct relation field
        populate: ['chatsessions'],  // ✅ Auto-fetch session details
      });

      if (!messages || messages.length === 0) {
        return ctx.notFound('No messages found for this session.');
      }

      return ctx.send({ data: messages });
    } catch (error) {
      ctx.throw(400, 'Error fetching messages');
    }
  },

  async createMessage(ctx) {
    try {
      const { content, sessionId } = ctx.request.body;

      const newMessage = await strapi.entityService.create('api::message.message', {
        data: {
          content,
          DateTime: new Date().toISOString(),
          chatsession: sessionId,  // ✅ Correct relation field
        },
      });

      return ctx.send({ data: newMessage });
    } catch (error) {
      ctx.throw(400, 'Error sending message');
    }
  },
}));

// import { factories } from '@strapi/strapi'

// export default factories.createCoreController('api::message.message');
