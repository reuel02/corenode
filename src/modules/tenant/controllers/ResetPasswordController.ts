import { FastifyReply, FastifyRequest } from "fastify";
import z from "zod";
import { ResetPasswordService } from "../services/ResetPasswordService";
import { PrismaUsersRepository } from "../../users/repositories/PrismaUsersRepository";


export async function resetPasswordController(request: FastifyRequest, reply: FastifyReply) {
    const resetPasswordSchema = z.object({
        token: z.string(),
        newPassword: z.string().min(8, "A nova senha precisa ter no minimo 8 caracteres")
    })

    try {
        const data = resetPasswordSchema.parse(request.body);

        const usersRepository = new PrismaUsersRepository();
        const resetPassword = new ResetPasswordService(usersRepository);

        const user = await resetPassword.execute(data.token, data.newPassword)

        return reply.status(201).send({
            message: "Senha atualizada com sucesso!",
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