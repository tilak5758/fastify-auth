"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.auth = void 0;
const auth = async (server, req, reply) => {
    try {
        const token = req.headers.authorization;
        if (!token) {
            reply.code(401).send({ error: 'Unauthorized' });
            return;
        }
    }
    catch (error) {
        console.log(typeof reply);
        console.error('Authentication error:', error);
        reply.code(500).send({ error: 'Internal Server Error' });
    }
};
exports.auth = auth;
