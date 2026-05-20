import { FastifyReply, FastifyRequest } from "fastify";
import z from "zod";
import { PrismaUsersRepository } from "../repositories/PrismaUsersRepository";
import { AuthenticateUserService } from "../services/AuthenticateUserService";

export async function authenticateController(request: FastifyRequest, reply: FastifyReply) {
    const loginBodySchema = z.object({
        email: z.email('Formato de email invalido'),
        password: z.string().min(8, "A senha precisa ter no minimo 8 caracteres.")
    })

    try {
        const data = loginBodySchema.parse(request.body)

        const usersRepository = new PrismaUsersRepository()
        const loginService = new AuthenticateUserService(usersRepository)

        const result = await loginService.execute(data)

        return reply.status(200).send({
            message: "Usuário logado com sucesso!",
            token: result
        });
        
    } catch (error) {
        if (error instanceof z.ZodError) {
                    // Erro 400: O front-end mandou dados no formato errado
                    return reply.status(400).send({ message: "Erro de validação.", issues: error.format() });
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