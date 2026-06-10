import { describe, it, expect, beforeEach } from 'vitest'
import { createServer } from '../../src/server'
import { store } from '../../src/store/memory'

describe('POST /events', () => {
  const app = createServer()
  beforeEach(() => store.clear())

  it('returns 201 with the created event', async () => {
    const res = await app.inject({
      method: 'POST', url: '/events',
      payload: { projectId: 'proj-1', type: 'api.call', payload: { endpoint: '/foo' } }
    })
    expect(res.statusCode).toBe(201)
    const body = res.json()
    expect(body.id).toBeDefined()
    expect(body.projectId).toBe('proj-1')
    expect(body.type).toBe('api.call')
  })

  it('returns 400 when projectId is missing', async () => {
    const res = await app.inject({
      method: 'POST', url: '/events',
      payload: { type: 'api.call' }
    })
    expect(res.statusCode).toBe(400)
  })

  it('returns 400 when type is missing', async () => {
    const res = await app.inject({
      method: 'POST', url: '/events',
      payload: { projectId: 'p1' }
    })
    expect(res.statusCode).toBe(400)
  })
})

describe('GET /metrics', () => {
  const app = createServer()
  beforeEach(() => store.clear())

  it('returns empty buckets for a project with no events', async () => {
    const res = await app.inject({ method: 'GET', url: '/metrics?projectId=no-events' })
    expect(res.statusCode).toBe(200)
    const body = res.json()
    expect(body.projectId).toBe('no-events')
    expect(body.buckets).toHaveLength(0)
  })

  it('returns buckets after posting events', async () => {
    await app.inject({
      method: 'POST', url: '/events',
      payload: { projectId: 'p1', type: 'api.call' }
    })
    await app.inject({
      method: 'POST', url: '/events',
      payload: { projectId: 'p1', type: 'deploy' }
    })
    const res = await app.inject({ method: 'GET', url: '/metrics?projectId=p1' })
    expect(res.statusCode).toBe(200)
    expect(res.json().buckets).toHaveLength(1)
    expect(res.json().buckets[0].count).toBe(2)
  })

  it('returns 400 when projectId is missing', async () => {
    const res = await app.inject({ method: 'GET', url: '/metrics' })
    expect(res.statusCode).toBe(400)
  })
})
