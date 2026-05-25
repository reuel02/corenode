import { FastifyReply, FastifyRequest } from "fastify"
import jwt from 'jsonwebtoken'

interface DecodedToken {
    sub: string
    tenant_id: string 
    role: string
    iat: number
    exp: number
}

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

    const decodedToken = jwt.verify(token!, process.env.JWT_SECRET!) as DecodedToken

    if (!decodedToken) {
        return reply.status(401).send({ message: "Token inválido ou expirou"})
    }

    const userData = {
        id: decodedToken.sub,
        role: decodedToken.role,
        tenant_id: decodedToken.tenant_id
    }

    request.user = userData
}