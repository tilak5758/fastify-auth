import fastify, {
  FastifyRequest,
  FastifyReply,
  FastifyInstance,
  FastifyPluginCallback,
} from "fastify";
import { FastifyJWTOptions } from "@fastify/jwt";
import fastifyJwt from "@fastify/jwt";
import dotenv from "dotenv";
import mongoose from "mongoose";
import { ConnectOptions } from "mongodb";

dotenv.config();

const server: FastifyInstance = fastify();

server.register(fastifyJwt, {
  secret: "mysecret",
} as FastifyJWTOptions);






// mongodb connection
async function connectMongoDB(): Promise<void> {
  try {
    const mongoURL = "mongodb://127.0.0.1/mydatabase";
    await mongoose.connect(mongoURL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    } as ConnectOptions);

    console.log("Db connection successfully");
  } catch (error) {

    console.error("Error connecting to MongoDB:", error);
  }
}

connectMongoDB()

// routes
server.register(import('./routes/signup'));
server.register(import('./routes/login'))
// server.register(import('./routes/auth'))

// port run 3000
const port =  3000;

server.listen(port, "0.0.0.0", (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Server listening on ${address}`);
});
