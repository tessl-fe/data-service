# forge/data-service

Event ingestion and metrics service for the Forge platform. Accepts events from backend-api and exposes usage rollups to frontend-app.

## Stack

- **Runtime:** Node 20+
- **Framework:** Fastify 4
- **Language:** TypeScript 5
- **Storage:** In-memory (dev/demo) — no database required

## Setup

```bash
npm install
npm run dev    # starts on http://localhost:3002
```

## API

| Method | Path | Description |
|--------|------|-------------|
| POST | /events | Ingest an event `{ projectId, type, payload? }` |
| GET | /metrics | Get usage rollup `?projectId=&from=&to=` |
| GET | /health | Health check |

### Example

```bash
# Ingest an event
curl -X POST http://localhost:3002/events \
  -H "Content-Type: application/json" \
  -d '{"projectId":"proj-123","type":"api.call","payload":{"endpoint":"/projects"}}'

# Query metrics (last 30 days by default)
curl "http://localhost:3002/metrics?projectId=proj-123"
```

## Tests

```bash
npm test
```

## Workers

`eventProcessor` and `metricsRollup` start automatically. In production these connect to a message broker and database respectively. In dev they are no-ops — storage is in-memory.
