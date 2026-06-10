let interval: ReturnType<typeof setInterval> | null = null

export function startEventProcessor(): void {
  interval = setInterval(() => {
    // Production: dequeue events from message broker, write to database
    // Demo: events are processed synchronously at ingest; nothing to do here
  }, 60_000)
}

export function stopEventProcessor(): void {
  if (interval) { clearInterval(interval); interval = null }
}
