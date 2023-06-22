import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import UserModel from "../model/user";
import bcrypt from "bcrypt";


export default async function (server: FastifyInstance) {
  server.post("/signup", async (req: FastifyRequest, reply: FastifyReply) => {
    const { username, email, password }: any = req.body;
    try {
      if (!username) {
        reply.code(400).send({ error: "Username is required" });
        return;
      }

      const existingUser = await UserModel.findOne({ email });
      if (existingUser) {
        reply.code(400).send({ error: "Email already taken" });
        return;
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = new UserModel({
        username,
        email,
        password: hashedPassword,
      });

      await newUser.save();

      const token = server.jwt.sign({ userId: newUser._id }, { expiresIn: '1h' });
      const responseData = {
        user: {
          username: newUser.username,
          email: newUser.email,
          password:hashedPassword
        },
        token
      };

      reply.send(responseData);
    } catch (error) {
      console.error(error);
      reply.code(500).send({ error: "Internal Server Error" });
    }
  });
}
