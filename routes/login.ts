import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import UserModel from '../model/user';
import bcrypt from 'bcrypt';
import { auth } from '../middleware/auth';

export default async function (server: FastifyInstance) {
  
  server.post<{ Body: { email: string; password: string } }>("/login",async (req: FastifyRequest, reply: FastifyReply) => {
    const { email, password }: any = req.body;
    try {
      const user = await UserModel.findOne({ email });
      if (!user) {
        reply.code(400).send({ error: "Invalid email or password" });
        return;
      }

      if (!password) {
        reply.code(400).send({ error: "Password is required" });
        return;
      }

      if (!user.password) {
        reply.code(500).send({ error: "User password is missing" });
        return;
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        reply.code(400).send({ error: "Invalid email or password" });
        return;
      }

      const token = server.jwt.sign({ userId: user._id }, { expiresIn: '1h' });
      
      const responseData = {
        user: {
          message: "User login successfully",
          username: user.username,
          email: user.email,
        },
        token
      };

      reply.header('Authorization', `Bearer ${token}`).send(responseData);
    } catch (error) {
      console.error(error);
      reply.code(500).send({ error: "Internal Server Error" });
    }
  });
  server.get("/protected", { preHandler:(req, reply) => auth(server, req, reply) }, async (req: FastifyRequest, reply: FastifyReply) => {
    reply.code(200).send({ message: "Protected route accessed successfully!" });
  });
}