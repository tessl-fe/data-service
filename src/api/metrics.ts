import { FastifyPluginAsync } from 'fastify'
import { store } from '../store/memory'

const metricsRoute: FastifyPluginAsync = async (app) => {
  app.get<{ Querystring: { projectId: string; from?: string; to?: string } }>(
    '/metrics',
    {
      schema: {
        querystring: {
          type: 'object',
          required: ['projectId'],
          properties: {
            projectId: { type: 'string' },
            from: { type: 'string' },
            to: { type: 'string' }
          }
        }
      }
    },
    async (req) => {
      const { projectId, from, to } = req.query
      const fromDate = from ? new Date(from) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
      const toDate = to ? new Date(to) : new Date()
      return { projectId, buckets: store.getRollup(projectId, fromDate, toDate) }
    }
  )
}

export default metricsRoute
