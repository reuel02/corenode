import { FastifyInstance } from "fastify";
import { createMemberController } from "./controllers/CreateMemberController";
import { authMiddleware } from "../../shared/middlewares/authMiddleware";
import { resetPasswordController } from "./controllers/ResetPasswordController";


export async function tenantRoutes(app: FastifyInstance) {
    app.post('/members', {preHandler: [authMiddleware] }, createMemberController)
    app.post('/password/reset', resetPasswordController)
}
