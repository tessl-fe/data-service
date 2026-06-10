import { FastifyPluginAsync } from 'fastify'
import { store } from '../store/memory'

const eventsRoute: FastifyPluginAsync = async (app) => {
  app.post<{ Body: { projectId: string; type: string; payload?: Record<string, unknown> } }>(
    '/events',
    {
      schema: {
        body: {
          type: 'object',
          required: ['projectId', 'type'],
          properties: {
            projectId: { type: 'string' },
            type: { type: 'string' },
            payload: { type: 'object' }
          }
        }
      }
    },
    async (req, reply) => {
      const event = store.addEvent({
        projectId: req.body.projectId,
        type: req.body.type,
        payload: req.body.payload ?? {}
      })
      return reply.status(201).send(event)
    }
  )
}

export default eventsRoute
