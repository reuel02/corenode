import { Prisma, Tenant } from "@prisma/client";

export interface ITenantRepository {
    create(data: Prisma.TenantUncheckedCreateInput): Promise<Tenant>
}