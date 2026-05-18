import { Prisma, PrismaClient, Tenant,  } from "@prisma/client";


const prisma = new PrismaClient()

export class PrismaTenantsRepository {

    async create(data: Prisma.TenantUncheckedCreateInput): Promise<Tenant> {
        const tenant = await prisma.tenant.create({
            data
        })

        return tenant
    }
}
