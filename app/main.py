from fastapi import FastAPI
from app.routes import analytics, reports

app = FastAPI(title="TeamFlow Data Service", version="1.2.0")
app.include_router(analytics.router, prefix="/analytics", tags=["analytics"])
app.include_router(reports.router, prefix="/reports", tags=["reports"])

@app.get("/health")
def health():
    return {"status": "ok"}
