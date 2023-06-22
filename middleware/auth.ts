import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';

export const auth = async (server: FastifyInstance,req: FastifyRequest,reply: FastifyReply) => {
  try {
    const token = req.headers.authorization;
    if (!token) {
      reply.code(401).send({ error: 'Unauthorized' });
      return;
    }
  } catch (error) {
    console.log(typeof reply); 
    console.error('Authentication error:', error);
    reply.code(500).send({ error: 'Internal Server Error' });
  }
};
