import bcrypt from "bcryptjs"
import { IUserRepository } from "../repositories/IUserRepository"
import { ITenantRepository } from "../repositories/ITenantRepository"

export class RegisterTenantService {
    constructor(
        private usersRepository: IUserRepository,
        private tenantsRepository: ITenantRepository
    ) {}

    async execute(data: any) {
        /* Receber: Nome da Empresa, Nome do Usuário, Email e Senha.

        Validar formato (Email válido, Senha forte, campos não vazios).

        --VALIDACOES ACIMA FEITAS NO CONTROLLER

        Checar no banco (via Repository): O e-mail já está em uso? (Se sim, travar).

        Criptografar a senha.

        Salvar de uma vez só (Transação): Criar o Tenant e, com o ID gerado, criar o User cravando a role como OWNER. */

        const userAlreadyExists = await this.usersRepository.findByEmail(data.email)

        if (userAlreadyExists) {
            throw new Error("Este email já está em uso.")
        }

        const hashedPassword = await bcrypt.hash(data.password, 10)

        const tenant = await this.tenantsRepository.create({
            name: data.companyName
        });

        const user = await this.usersRepository.create({
            tenant_id: tenant.id,
            name: data.userName,
            email: data.email,
            password_hash: hashedPassword,
            role: 'OWNER' // Cravado no back-end, imune a manipulação do front-end
        });

        return { tenant, user }
    }
}