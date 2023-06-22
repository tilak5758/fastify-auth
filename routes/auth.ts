import { FastifyInstance, RouteShorthandOptions } from 'fastify';
import { auth } from '../middleware/auth';

export default async function registerRoutes(server: FastifyInstance, options: any, done: () => void) {
  server.get('/protected', { preHandler: auth } as unknown as RouteShorthandOptions, async (req, reply) => {
    reply.send({ message: 'Protected route accessed successfully' });
  });
  done(); // Call the 'done' function to indicate that the plugin initialization is complete
}
