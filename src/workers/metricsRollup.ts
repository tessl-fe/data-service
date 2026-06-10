let interval: ReturnType<typeof setInterval> | null = null

export function startMetricsRollup(): void {
  interval = setInterval(() => {
    // Production: read events from DB, write aggregated daily buckets to metrics table
    // Demo: rollups are computed on-demand in InMemoryStore.getRollup()
  }, 5 * 60_000)
}

export function stopMetricsRollup(): void {
  if (interval) { clearInterval(interval); interval = null }
}
