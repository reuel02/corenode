import { FastifyInstance } from "fastify";
import { registerTenantController } from "./controllers/RegisterTenantController";

export async function authRoutes(app: FastifyInstance) {
    app.post('/register', registerTenantController)
}