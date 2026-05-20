import { FastifyReply, FastifyRequest } from "fastify"
import jwt from 'jsonwebtoken'

export async function authMiddleware(request: FastifyRequest, reply: FastifyReply) {
    const authHeader = request.headers.authorization
    
    if (!authHeader) {
        return reply.status(401).send({
            message: "Token não fornecido."
        })
    }

    const parts = authHeader.split(" ")

    if (parts.length !== 2 || parts[0] !== "Bearer") {
        return reply.status(401).send({ message: "Formato do token inválido (deve ser Bearer <token>)." });
    }

    const token = parts[1]

    const tokenIsValid = jwt.verify(token!, process.env.JWT_SECRET!)

    if (!tokenIsValid) {
        return reply.status(401).send({ message: "Token inválido ou expirou"})
    }
}