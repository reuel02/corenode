import { sendEmail } from "../../../shared/providers/MailProvider/NodemailerMailProvider";
import { IUserRepository } from "../../users/repositories/IUserRepository";


export class ForgotPasswordService {
    constructor (private userRepository: IUserRepository) {}

    async execute(email: string) {
        const user = await this.userRepository.findByEmail(email)

        if (!user) {
            return user
        }

        const reset_token = crypto.randomUUID()

        const reset_expires = new Date(Date.now() + 2 * 60 * 60 * 1000);

        const newUser = {
            ...user
        }

        newUser.reset_expires = reset_expires
        newUser.reset_token = reset_token

        await this.userRepository.update(user.email, newUser)

        sendEmail(email)
    }
} 