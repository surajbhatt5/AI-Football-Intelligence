import random
from fastapi import APIRouter, HTTPException
from app.api.v1.endpoints.matches import MATCHES_DB

router = APIRouter()

@router.post("/{match_id}/process")
async def process_analysis(match_id: str):
    # Find and update match details in database to simulate analysis completion
    match_found = None
    for match in MATCHES_DB:
        if match["id"] == match_id:
            # Set to analyzed and attach score
            match["status"] = "analyzed"
            match["score"] = f"{random.randint(75, 95)}%"
            match_found = match
            break
            
    if not match_found:
        raise HTTPException(
            status_code=404,
            detail="Match session not found in ingestion records."
        )
        
    return {
        "status": "ready_for_analysis"
    }
