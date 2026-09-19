import type { FastifyInstance } from 'fastify'
import { gmailRoutes } from './gmail.routes.js'

export async function gmailModule(app: FastifyInstance): Promise<void> {
  await app.register(gmailRoutes, { prefix: '/api/v1/gmail' })
}
