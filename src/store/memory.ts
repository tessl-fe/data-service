export interface Event {
  id: string
  projectId: string
  type: string
  payload: Record<string, unknown>
  timestamp: Date
}

export interface MetricBucket {
  date: string
  count: number
}

export class InMemoryStore {
  private events: Event[] = []
  private readonly maxEventsPerProject = 10_000

  addEvent(input: Omit<Event, 'id' | 'timestamp'>): Event {
    const event: Event = {
      ...input,
      id: Math.random().toString(36).slice(2, 10),
      timestamp: new Date()
    }
    this.events.push(event)
    return event
  }

  getEvents(projectId: string): Event[] {
    return this.events.filter(e => e.projectId === projectId)
  }

  getRollup(projectId: string, from: Date, to: Date): MetricBucket[] {
    const relevant = this.events.filter(
      e => e.projectId === projectId && e.timestamp >= from && e.timestamp <= to
    )
    const buckets: Record<string, number> = {}
    for (const event of relevant) {
      const date = event.timestamp.toISOString().slice(0, 10)
      buckets[date] = (buckets[date] ?? 0) + 1
    }
    return Object.entries(buckets)
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => a.date.localeCompare(b.date))
  }

  pruneOldEvents(projectId: string): number {
    const projectEvents = this.events.filter(e => e.projectId === projectId)
    if (projectEvents.length <= this.maxEventsPerProject) return 0
    const toRemove = projectEvents.length - this.maxEventsPerProject
    const oldest = projectEvents
      .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime())
      .slice(0, toRemove)
      .map(e => e.id)
    const before = this.events.length
    this.events = this.events.filter(e => !oldest.includes(e.id))
    return before - this.events.length
  }

  clear(): void {
    this.events = []
  }
}

export const store = new InMemoryStore()
