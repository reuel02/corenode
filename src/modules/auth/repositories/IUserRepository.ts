import { Prisma, User } from "@prisma/client";

export interface IUserRepository {
    create(data: Prisma.UserUncheckedCreateInput): Promise<User>

    findByEmail(email: string): Promise<User | null>
}