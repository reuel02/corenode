import bcrypt from "bcryptjs";
import { IUserRepository } from "../../users/repositories/IUserRepository";

export class ResetPasswordService {
    constructor(private userRepository: IUserRepository) {}

    async execute(token: string, newPassword: string) {
        const userFound = await this.userRepository.findByResetToken(token)

        if (!userFound) {
            throw new Error('Token invalido')
        }

        const dataHoraAtual = new Date()

        if (dataHoraAtual > userFound.reset_expires!) {
            throw new Error("Token expirado")
        }

        const hashedPassword = await bcrypt.hash(newPassword, 8)

        const data = {
            ...userFound
        }

        data.password_hash = hashedPassword
        data.reset_expires = null
        data.reset_token = null

        const user = this.userRepository.update(userFound.email, data)

        return user
    }
}