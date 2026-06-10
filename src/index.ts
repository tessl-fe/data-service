import { createServer } from './server'
import { startEventProcessor } from './workers/eventProcessor'
import { startMetricsRollup } from './workers/metricsRollup'

const port = parseInt(process.env.PORT ?? '3002', 10)
const app = createServer()

startEventProcessor()
startMetricsRollup()

app.listen({ port, host: '0.0.0.0' }, (err) => {
  if (err) { app.log.error(err); process.exit(1) }
})
