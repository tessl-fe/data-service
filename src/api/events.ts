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
  app.get<{ Params: { projectId: string }; Querystring: { type?: string; since?: string } }>(
    '/events/:projectId',
    async (req) => {
      const { projectId } = req.params
      const { type, since } = req.query
      const sinceDate = since ? new Date(since) : undefined
      return store.searchEvents(projectId, type, sinceDate)
    }
  )
}

export default eventsRoute
