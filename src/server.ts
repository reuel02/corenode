import Fastify from 'fastify';
import { registerTenantController } from './modules/auth/controllers/RegisterTenantController';
import fastifyJwt from '@fastify/jwt'
import { authRoutes } from './modules/auth/auth.routes';
import { tenantRoutes } from './modules/tenant/tenant.routes';

const app = Fastify({
    logger: true
})

app.decorateRequest('user', null as any)

app.get('/health', async () => {
  return { status: 'CoreNode está online e operante!' };
});

app.register(authRoutes, { prefix: '/api/auth' })
app.register(tenantRoutes, { prefix: '/api/tenant' })

app.listen({ port: 3000 }, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`🚀 Servidor rodando em ${address}`);
});
