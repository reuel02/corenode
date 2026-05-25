import { PrismaClient, Prisma, User } from "@prisma/client";
import { IUserRepository } from "./IUserRepository";
import { prisma } from "../../../shared/infra/database/prisma";

export class PrismaUsersRepository implements IUserRepository {
  async create(data: Prisma.UserUncheckedCreateInput): Promise<User> {
    const user = await prisma.user.create({
      data,
    });

    return user;
  }

  async update(
    email: string,
    data: Prisma.UserUncheckedUpdateInput,
  ): Promise<User> {
    const user = await prisma.user.update({
      where: { email },
      data,
    });

    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    return user;
  }
}
