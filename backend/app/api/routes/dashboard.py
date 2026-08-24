from fastapi import APIRouter, HTTPException

from app.services.supabase_service import (
    get_dashboard_stats,
)


router = APIRouter(
    prefix="/api/dashboard",
    tags=["Dashboard"]
)


@router.get("/stats")
async def get_dashboard_statistics():

    try:

        stats = get_dashboard_stats()

        return {
            "success": True,
            "stats": stats
        }

    except Exception as error:

        raise HTTPException(
            status_code=500,
            detail=(
                "Failed to fetch dashboard statistics: "
                f"{str(error)}"
            )
        )