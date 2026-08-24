from fastapi import APIRouter, HTTPException

from app.services.supabase_service import (
    search_candidates_and_jobs,
)


router = APIRouter(
    prefix="/api/search",
    tags=["Search"]
)


@router.get("")
async def search(
    q: str
):

    try:

        if not q.strip():

            return {
                "success": True,
                "candidates": [],
                "jobs": []
            }


        results = search_candidates_and_jobs(
            q.strip()
        )


        return {
            "success": True,
            **results
        }


    except Exception as error:

        raise HTTPException(
            status_code=500,
            detail=f"Search failed: {str(error)}"
        )