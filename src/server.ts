import Fastify from 'fastify'
import eventsRoute from './api/events'
import metricsRoute from './api/metrics'

export function createServer() {
  const app = Fastify({ logger: false })
  app.get('/health', async () => ({ status: 'ok' }))
  app.register(eventsRoute)
  app.register(metricsRoute)
  return app
}
