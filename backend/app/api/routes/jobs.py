from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from app.services.llm_service import extract_job_data
from app.services.supabase_service import (
    create_job,
    get_job_by_id,
    get_all_jobs,
    delete_job,
    get_job,
)
from fastapi import HTTPException

router = APIRouter(
    prefix="/api/jobs",
    tags=["Jobs"]
)


class JobDescriptionRequest(BaseModel):
    description: str


@router.post("/parse")
async def parse_job_description(
    request: JobDescriptionRequest
):

    if not request.description.strip():
        raise HTTPException(
            status_code=400,
            detail="Job description cannot be empty."
        )

    try:

        # --------------------------------
        # Parse JD using Gemini
        # --------------------------------

        job = extract_job_data(
            request.description
        )

        # --------------------------------
        # Prepare database data
        # --------------------------------

        job_data = job.model_dump()

        job_data["description"] = request.description

        # --------------------------------
        # Save job to Supabase
        # --------------------------------

        saved_job = create_job(
            job_data
        )

        if not saved_job:
            raise HTTPException(
                status_code=500,
                detail="Job could not be saved."
            )

        job_id = saved_job[0]["id"]

        # --------------------------------
        # Response
        # --------------------------------

        return {
            "success": True,
            "job_id": job_id,
            "job": job.model_dump()
        }

    except HTTPException:
        raise

    except Exception as error:

        raise HTTPException(
            status_code=500,
            detail=f"Failed to process job description: {str(error)}"
        )
        
             
@router.get("/")
async def get_jobs():

    try:
        jobs = get_all_jobs()

        return {
            "success": True,
            "total": len(jobs),
            "jobs": jobs
        }

    except Exception as error:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to fetch jobs: {str(error)}"
        )
        
@router.get("/{job_id}")
async def get_job_details(job_id: str):

    try:

        job_data = get_job_by_id(job_id)

        if not job_data:
            raise HTTPException(
                status_code=404,
                detail="Job not found"
            )

        return {
            "success": True,
            "job": job_data[0]
        }

    except HTTPException:
        raise

    except Exception as error:

        raise HTTPException(
            status_code=500,
            detail=f"Failed to fetch job: {str(error)}"
        )
   

@router.delete("/{job_id}")
async def delete_job_api(
    job_id: str
):

    try:

        # --------------------------------
        # Check whether job exists
        # --------------------------------

        job_data = get_job(job_id)

        if not job_data:

            raise HTTPException(
                status_code=404,
                detail="Job not found."
            )


        # --------------------------------
        # Delete the job
        # --------------------------------

        deleted_job = delete_job(
            job_id
        )


        if not deleted_job:

            raise HTTPException(
                status_code=500,
                detail="Job could not be deleted."
            )


        # --------------------------------
        # Response
        # --------------------------------

        return {
            "success": True,
            "message": "Job deleted successfully.",
            "job_id": job_id
        }


    except HTTPException:

        raise


    except Exception as error:

        raise HTTPException(
            status_code=500,
            detail=(
                "Failed to delete job: "
                f"{str(error)}"
            )
        )