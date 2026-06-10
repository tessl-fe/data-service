import { describe, it, expect, beforeEach } from 'vitest'
import { InMemoryStore } from '../../src/store/memory'

describe('InMemoryStore', () => {
  let store: InMemoryStore

  beforeEach(() => { store = new InMemoryStore() })

  it('addEvent returns event with id and timestamp', () => {
    const e = store.addEvent({ projectId: 'p1', type: 'api.call', payload: {} })
    expect(e.id).toBeDefined()
    expect(e.projectId).toBe('p1')
    expect(e.type).toBe('api.call')
    expect(e.timestamp).toBeInstanceOf(Date)
  })

  it('getEvents returns only events for the given projectId', () => {
    store.addEvent({ projectId: 'p1', type: 'api.call', payload: {} })
    store.addEvent({ projectId: 'p2', type: 'api.call', payload: {} })
    store.addEvent({ projectId: 'p1', type: 'deploy', payload: {} })
    expect(store.getEvents('p1')).toHaveLength(2)
    expect(store.getEvents('p2')).toHaveLength(1)
    expect(store.getEvents('p3')).toHaveLength(0)
  })

  it('getRollup groups events by date and counts them', () => {
    store.addEvent({ projectId: 'p1', type: 'api.call', payload: {} })
    store.addEvent({ projectId: 'p1', type: 'api.call', payload: {} })
    const today = new Date().toISOString().slice(0, 10)
    const from = new Date(Date.now() - 86_400_000)
    const to = new Date()
    const buckets = store.getRollup('p1', from, to)
    expect(buckets).toHaveLength(1)
    expect(buckets[0].date).toBe(today)
    expect(buckets[0].count).toBe(2)
  })

  it('getRollup excludes events outside the date range', () => {
    store.addEvent({ projectId: 'p1', type: 'api.call', payload: {} })
    const twoDaysAgo = new Date(Date.now() - 2 * 86_400_000)
    const yesterday = new Date(Date.now() - 86_400_000)
    const buckets = store.getRollup('p1', twoDaysAgo, yesterday)
    expect(buckets).toHaveLength(0)
  })

  it('clear removes all events', () => {
    store.addEvent({ projectId: 'p1', type: 'api.call', payload: {} })
    store.clear()
    expect(store.getEvents('p1')).toHaveLength(0)
  })
})
