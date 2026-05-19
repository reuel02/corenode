import { Prisma, Tenant, User } from "@prisma/client";

export interface ITenantRepository {
    createWithOwner(
        tenantData: Prisma.TenantUncheckedCreateInput, 
        userData: Omit<Prisma.UserUncheckedCreateInput, 'tenant_id' | 'role'>
    ): Promise<{ tenant: Tenant; user: User }>
}