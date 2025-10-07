from fastapi import APIRouter, Query, HTTPException
import os

LOG_FILE_PATH = "logs/server.log"
router = APIRouter(prefix="/logs", tags=["Logs"])


@router.get("/")
async def get_logs(offset: int = Query(0, ge=0), limit: int = Query(50, ge=1)):

    if not os.path.exists(LOG_FILE_PATH):
        raise HTTPException(status_code=404, detail="Log file not found")

    try:
        with open(LOG_FILE_PATH, "r", encoding="utf-8") as f:
            lines = f.readlines()
            sliced = lines[offset:offset + limit]
        return {"total": len(lines), "offset": offset, "limit": limit, "logs": sliced}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
