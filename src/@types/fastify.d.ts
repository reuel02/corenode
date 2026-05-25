import 'fastify'
import '@fastify/jwt'

declare module '@fastify/jwt' {
    interface FastifyJWT {
        user: {
            id: string
            role: string
            tenant_id: string
        }
    }
}

declare module 'fastify' {
    interface FastifyRequest {
        user: {
            id: string
            role: string
            tenant_id: string
        }
    }
}