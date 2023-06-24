"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_1 = __importDefault(require("../model/user"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const auth_1 = require("../middleware/auth");
async function default_1(server) {
    server.post("/login", async (req, reply) => {
        const { email, password } = req.body;
        try {
            const user = await user_1.default.findOne({ email });
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
            const isPasswordValid = await bcrypt_1.default.compare(password, user.password);
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
        }
        catch (error) {
            console.error(error);
            reply.code(500).send({ error: "Internal Server Error" });
        }
    });
    server.get("/protected", { preHandler: (req, reply) => (0, auth_1.auth)(server, req, reply) }, async (req, reply) => {
        reply.code(200).send({ message: "Protected route accessed successfully!" });
    });
}
exports.default = default_1;
