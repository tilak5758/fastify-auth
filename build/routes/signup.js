"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_1 = __importDefault(require("../model/user"));
const bcrypt_1 = __importDefault(require("bcrypt"));
async function default_1(server) {
    server.post("/signup", async (req, reply) => {
        const { username, email, password } = req.body;
        try {
            if (!username) {
                reply.code(400).send({ error: "Username is required" });
                return;
            }
            const existingUser = await user_1.default.findOne({ email });
            if (existingUser) {
                reply.code(400).send({ error: "Email already taken" });
                return;
            }
            const hashedPassword = await bcrypt_1.default.hash(password, 10);
            const newUser = new user_1.default({
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
                    password: hashedPassword
                },
                token
            };
            reply.send(responseData);
        }
        catch (error) {
            console.error(error);
            reply.code(500).send({ error: "Internal Server Error" });
        }
    });
}
exports.default = default_1;
