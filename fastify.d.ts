import { FastifyInstance } from 'fastify';
import { FastifyJwtInstance } from '@fastify/jwt';

declare module 'fastify' {
  interface FastifyInstance {
    jwt: FastifyJwtInstance;
  }
}

// declare module 'fastify' {
//     interface FastifyInstance {
//       authenticate: (req: FastifyRequest, reply: FastifyReply) => Promise<void>;
//     }
//   }

declare module 'mongodb' {
  interface ConnectOptions {
    useNewUrlParser?: boolean;
    useUnifiedTopology?: boolean;
  }
}

declare module 'fastify' {
  interface RouteShorthandOptions {
    preHandler?: (
      request: FastifyRequest,
      reply: FastifyReply,
      done: (err?: Error) => void
    ) => void;
  }
}

import { FastifyReply } from 'fastify';

declare module 'fastify' {
  interface FastifyReply {
    next: () => Promise<void>;
  }
}


