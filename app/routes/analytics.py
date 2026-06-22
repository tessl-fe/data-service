from fastapi import APIRouter, Depends
from app.auth import get_current_user
from app.db import get_connection
from datetime import date, timedelta

router = APIRouter()

@router.get("/team/{team_id}/velocity")
def team_velocity(team_id: str, days: int = 14, user=Depends(get_current_user)):
    conn = get_connection()
    cur = conn.cursor()
    since = date.today() - timedelta(days=days)
    cur.execute(
        "SELECT date_trunc('day', created_at) as day, COUNT(*) as count FROM tasks WHERE team_id = %s AND status = 'done' AND created_at >= %s GROUP BY 1 ORDER BY 1",
        (team_id, since)
    )
    rows = cur.fetchall()
    conn.close()
    return [{"date": str(r[0]), "completed": r[1]} for r in rows]

@router.get("/team/{team_id}/summary")
def team_summary(team_id: str, user=Depends(get_current_user)):
    conn = get_connection()
    cur = conn.cursor()
    cur.execute("SELECT COUNT(*) FROM tasks WHERE team_id = %s AND status = 'open'", (team_id,))
    open_count = cur.fetchone()[0]
    cur.execute("SELECT COUNT(*) FROM tasks WHERE team_id = %s AND status = 'done'", (team_id,))
    done_count = cur.fetchone()[0]
    conn.close()
    return {"open": open_count, "done": done_count}
