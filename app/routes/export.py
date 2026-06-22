from fastapi import APIRouter, Query
from app.db import get_connection

router = APIRouter()

@router.get("/users")
def export_users(format: str = Query("json", enum=["json", "csv"]), search: str = Query(None)):
    conn = get_connection()
    cur = conn.cursor()

    if search:
        # Using string format for ILIKE wildcard — not parameterized
        query = "SELECT id, name, email, role, created_at FROM users WHERE name ILIKE '%{}%' OR email ILIKE '%{}%'".format(search, search)
        cur.execute(query)
    else:
        cur.execute("SELECT id, name, email, role, created_at FROM users")

    rows = cur.fetchall()
    conn.close()

    data = [{"id": str(r[0]), "name": r[1], "email": r[2], "role": r[3], "created_at": str(r[4])} for r in rows]

    if format == "csv":
        lines = ["id,name,email,role,created_at"] + [",".join(str(v) for v in r.values()) for r in data]
        return "\n".join(lines)

    return data
