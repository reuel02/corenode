import bcrypt from "bcryptjs";
import { IUserRepository } from "../../users/repositories/IUserRepository";

interface AuthData {
  role: string;
  tenant_id: string;
}

interface CreateMemberData {
  name: string;
  email: string;
  password: string;
}

export class CreateMemberService {
  constructor(private usersRepository: IUserRepository) {}

  async execute(data: CreateMemberData, authData: AuthData) {
    if (authData.role !== "OWNER") {
      throw new Error("Acesso negado");
    }

    const emailExists = await this.usersRepository.findByEmail(data.email);

    if (emailExists) {
      throw new Error("Email já cadastrado");
    }

    if (!data.password) {
      throw new Error("Senha é obrigatória");
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const userData = {
      tenant_id: authData.tenant_id,
      name: data.name,
      email: data.email,
      password_hash: hashedPassword,
      role: "MEMBER",
    };

    const user = await this.usersRepository.create(userData);

    return user;
  }
}
