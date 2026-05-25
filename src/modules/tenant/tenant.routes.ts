import { FastifyInstance } from "fastify";
import { createMemberController } from "./controllers/CreateMemberController";
import { authMiddleware } from "../../shared/middlewares/authMiddleware";


export async function tenantRoutes(app: FastifyInstance) {
    app.post('/members', {preHandler: [authMiddleware] }, createMemberController)
}
