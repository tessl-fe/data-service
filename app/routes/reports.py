from fastapi import APIRouter, Depends
from app.auth import get_current_user
from app.db import get_connection

router = APIRouter()

@router.get("/weekly")
def weekly_report(user=Depends(get_current_user)):
    conn = get_connection()
    cur = conn.cursor()
    cur.execute("""
        SELECT t.name as team, COUNT(tk.id) as tasks_completed
        FROM teams t
        JOIN tasks tk ON tk.team_id = t.id
        WHERE tk.status = 'done' AND tk.updated_at >= NOW() - INTERVAL '7 days'
        GROUP BY t.name ORDER BY tasks_completed DESC
    """)
    rows = cur.fetchall()
    conn.close()
    return [{"team": r[0], "completed": r[1]} for r in rows]
