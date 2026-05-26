import { FastifyReply, FastifyRequest } from "fastify";
import z from "zod";
import { PrismaUsersRepository } from "../../users/repositories/PrismaUsersRepository";
import { ForgotPasswordService } from "../services/ForgotPasswordService";


export async function forgotPasswordController(request: FastifyRequest, reply: FastifyReply) {
    const forgotPasswordSchema = z.object({
        email: z.email()
    })

    try {
        const data = forgotPasswordSchema.parse(request.body);
        
        const usersRepository = new PrismaUsersRepository();
        const forgotPassword = new ForgotPasswordService(usersRepository);
        
        const user = await forgotPassword.execute(data.email)

        return reply.status(200).send({
            message: "Email enviado!",
        });
        
    } catch (error) {
         if (error instanceof z.ZodError) {
        // Erro 400: O front-end mandou dados no formato errado
        return reply
            .status(400)
            .send({ message: "Erro de validação.", issues: error.format() });
        }
    
        if (error instanceof Error) {
        // Erro 400: Regra de negócio falhou (Ex: E-mail já existe)
        return reply.status(400).send({ message: error.message });
        }
    
        // Erro 500: O servidor explodiu (banco caiu, etc)
        console.error(error);
        return reply.status(500).send({ message: "Erro interno do servidor." });
    }
}