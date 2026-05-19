import bcrypt from "bcryptjs"
import { IUserRepository } from "../repositories/IUserRepository"
import { ITenantRepository } from "../repositories/ITenantRepository"

export class RegisterTenantService {
    constructor(
        private usersRepository: IUserRepository,
        private tenantsRepository: ITenantRepository
    ) {}

    async execute(data: any) {
        const userAlreadyExists = await this.usersRepository.findByEmail(data.email)

        if (userAlreadyExists) {
            throw new Error("Este email já está em uso.")
        }

        const hashedPassword = await bcrypt.hash(data.password, 10)

        const result = await this.tenantsRepository.createWithOwner(
            { name: data.companyName },
            {
                name: data.userName,
                email: data.email,
                password_hash: hashedPassword
            }
        )

        return result
    }
}