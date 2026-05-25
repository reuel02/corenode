import { FastifyReply, FastifyRequest } from "fastify";
import z from "zod";
import { PrismaUsersRepository } from "../../users/repositories/PrismaUsersRepository";
import { CreateMemberService } from "../services/CreateMemberService";


export async function createMemberController(request: FastifyRequest, reply: FastifyReply) {
    const createBodySchema = z.object({
        name: z.string(),
        email: z.email("Formato de email invalido"),
        password: z.string().min(8, "A senha deve ter no minimo 8 caracteres")
    })

    try {
        const data = createBodySchema.parse(request.body);

        const {tenant_id, role} = request.user

        const authData = {
            role,
            tenant_id
        }

        const usersRepository = new PrismaUsersRepository();
        const createMember = new CreateMemberService(usersRepository);

        const user = await createMember.execute(data, authData)

        return reply.status(201).send({
            message: "Membro criado com sucesso!",
            user
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