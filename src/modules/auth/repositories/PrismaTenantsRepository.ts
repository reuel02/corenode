import { Prisma, PrismaClient, Tenant, User,  } from "@prisma/client";
import { prisma } from "../../../lib/prisma";

export class PrismaTenantsRepository {

    async createWithOwner(tenantData: Prisma.TenantUncheckedCreateInput, 
            userData: Omit<Prisma.UserUncheckedCreateInput, 'tenant_id' | 'role'>
        ): Promise<{ tenant: Tenant; user: User }> {

        const result = await prisma.$transaction(async (tx) => {

            const tenant = await tx.tenant.create({
                data: tenantData
            })

            const user = await tx.user.create({
                data: {
                    ...userData,
                    tenant_id: tenant.id,
                    role: 'OWNER'
                }
            })

            return { tenant, user }
        })

        return result
    }
}
