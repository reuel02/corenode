import Fastify from 'fastify';
import { registerTenantController } from './modules/auth/controllers/RegisterTenantController';

const fastify = Fastify({
    logger: true
})

fastify.post('api/auth/register', registerTenantController)

async function start() {
  try {
    await fastify.listen({ port: 3000 })
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}

start()