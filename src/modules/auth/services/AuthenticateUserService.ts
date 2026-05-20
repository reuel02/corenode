import bcrypt from "bcryptjs";
import { IUserRepository } from "../repositories/IUserRepository";
import jwt from 'jsonwebtoken';

export class AuthenticateUserService {
    constructor(
        private usersRepository: IUserRepository
    ) {}

    async execute(data: any) {
        const userAlreadyExists = await this.usersRepository.findByEmail(data.email)

        if (!userAlreadyExists) {
            throw new Error("Credenciais inválidas")
        }
        
        const passwordIsEqual = await bcrypt.compare(data.password, userAlreadyExists.password_hash)

        if (!passwordIsEqual) {
            throw new Error("Credenciais inválidas")
        }

        const token = jwt.sign({ 
            sub: userAlreadyExists.id, 
            tenant_id: userAlreadyExists.tenant_id,
            role: userAlreadyExists.role
        }, 
        process.env.JWT_SECRET!, 
        { expiresIn: '1d' }
        )

        return token
    }
}