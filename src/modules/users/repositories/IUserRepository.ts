import { Prisma, User } from "@prisma/client";

export interface IUserRepository {
    create(data: Prisma.UserUncheckedCreateInput): Promise<User>

    update(email: string, data: Prisma.UserUncheckedUpdateInput): Promise<User>

    findByEmail(email: string): Promise<User | null>
}