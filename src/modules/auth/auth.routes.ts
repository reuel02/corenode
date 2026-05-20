import { FastifyInstance } from "fastify";
import { registerTenantController } from "./controllers/RegisterTenantController";
import { authenticateController } from "./controllers/AuthenticateController";

export async function authRoutes(app: FastifyInstance) {
    app.post('/register', registerTenantController)
    app.post('/login', authenticateController)
}
