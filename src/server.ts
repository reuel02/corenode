import Fastify from 'fastify';
import { registerTenantController } from './modules/auth/controllers/RegisterTenantController';
import { authRoutes } from './modules/auth/auth.routes';
import fastifyJwt from '@fastify/jwt'

const app = Fastify({
    logger: true
})

app.get('/health', async () => {
  return { status: 'CoreNode está online e operante!' };
});

app.register(authRoutes, { prefix: '/api/auth' })

app.listen({ port: 3000 }, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`🚀 Servidor rodando em ${address}`);
});