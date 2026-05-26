import { FastifyInstance } from "fastify";
import { createMemberController } from "./controllers/CreateMemberController";
import { authMiddleware } from "../../shared/middlewares/authMiddleware";
import { resetPasswordController } from "./controllers/ResetPasswordController";
import { forgotPasswordController } from "./controllers/ForgotPasswordController";


export async function tenantRoutes(app: FastifyInstance) {
    app.post('/members', {preHandler: [authMiddleware] }, createMemberController)
    app.post('/password/forgot', forgotPasswordController)
    app.post('/password/reset', resetPasswordController)
}
