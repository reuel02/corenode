import z from "zod";
import { FastifyRequest, FastifyReply } from "fastify";
import { PrismaUsersRepository } from "../../users/repositories/PrismaUsersRepository";
import { PrismaTenantsRepository } from "../repositories/PrismaTenantsRepository";
import { RegisterTenantService } from "../services/RegisterTenantService";

export async function registerTenantController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const registerBodySchema = z.object({
    companyName: z
      .string()
      .min(2, "O nome da empresa precisa ter no minimo 2 caracteres"),
    userName: z
      .string()
      .min(2, "O nome do usuário precisa ter no minimo 2 caracteres."),
    email: z.email("Formado de e-mail inválido."),
    password: z.string().min(8, "A senha precisa ter no minimo 8 caracteres."),
  });

  try {
    const data = registerBodySchema.parse(request.body);

    const usersRepository = new PrismaUsersRepository();
    const tenantsRepository = new PrismaTenantsRepository();
    const registerService = new RegisterTenantService(
      usersRepository,
      tenantsRepository,
    );

    const result = await registerService.execute(data);

    return reply.status(201).send({
      message: "Conta corporativa criada com sucesso!",
      tenantId: result.tenant.id,
      userId: result.user.id,
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
