from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from app.schemas.candidate import Candidate
from app.schemas.job import JobDescription

from app.services.llm_service import screen_candidate

from app.services.supabase_service import (
    get_candidate,
    get_job,
    create_screening,
    get_screenings_for_job,
    get_screening_result,
    get_screenings_for_candidate
)


router = APIRouter(
    prefix="/api/screening",
    tags=["Screening"]
)


class ScreeningRequest(BaseModel):
    candidate_id: str
    job_id: str

@router.post("/evaluate")
async def evaluate_candidate(
    request: ScreeningRequest
):

    try:

        # --------------------------------
        # Check if already screened
        # --------------------------------

        existing_screening = get_screening_result(
            request.candidate_id,
            request.job_id
        )

        if existing_screening:

            screening = existing_screening[0]

            return {
                "success": True,
                "already_screened": True,
                "screening_id": screening["id"],
                "candidate_id": request.candidate_id,
                "job_id": request.job_id,

                "result": {
                    "score": screening["score"],
                    "recommendation": screening["recommendation"],
                    "matched_skills": screening["matched_skills"],
                    "missing_required_skills": (
                        screening["missing_required_skills"]
                    ),
                    "matched_preferred_skills": (
                        screening["matched_preferred_skills"]
                    ),
                    "strengths": screening["strengths"],
                    "concerns": screening["concerns"],
                    "justification": screening["justification"]
                }
            }


        # --------------------------------
        # Fetch candidate
        # --------------------------------

        candidate_data = get_candidate(
            request.candidate_id
        )

        if not candidate_data:

            raise HTTPException(
                status_code=404,
                detail="Candidate not found."
            )


        # --------------------------------
        # Fetch job
        # --------------------------------

        job_data = get_job(
            request.job_id
        )

        if not job_data:

            raise HTTPException(
                status_code=404,
                detail="Job not found."
            )


        candidate_record = candidate_data[0]
        job_record = job_data[0]


        # --------------------------------
        # Convert candidate
        # --------------------------------

        candidate = Candidate(

            name=candidate_record["name"],

            email=candidate_record.get(
                "email"
            ),

            phone=candidate_record.get(
                "phone"
            ),

            skills=candidate_record.get(
                "skills",
                []
            ),

            experience=candidate_record.get(
                "experience",
                []
            ),

            education=candidate_record.get(
                "education",
                []
            ),

            total_experience_years=(
                candidate_record.get(
                    "total_experience_years"
                )
            )
        )


        # --------------------------------
        # Convert job
        # --------------------------------

        job = JobDescription(

            title=job_record.get(
                "title"
            ),

            required_skills=(
                job_record.get(
                    "required_skills",
                    []
                )
            ),

            preferred_skills=(
                job_record.get(
                    "preferred_skills",
                    []
                )
            ),

            responsibilities=(
                job_record.get(
                    "responsibilities",
                    []
                )
            ),

            minimum_experience_years=(
                job_record.get(
                    "minimum_experience_years"
                )
            ),

            education_requirements=(
                job_record.get(
                    "education_requirements",
                    []
                )
            )
        )


        # --------------------------------
        # Run AI screening
        # --------------------------------

        result = screen_candidate(
            candidate,
            job
        )


        # --------------------------------
        # Save screening result
        # --------------------------------

        screening_data = {

            "candidate_id":
                request.candidate_id,

            "job_id":
                request.job_id,

            "score":
                result.score,

            "recommendation":
                result.recommendation,

            "matched_skills":
                result.matched_skills,

            "missing_required_skills":
                result.missing_required_skills,

            "matched_preferred_skills":
                result.matched_preferred_skills,

            "strengths":
                result.strengths,

            "concerns":
                result.concerns,

            "justification":
                result.justification
        }


        saved_screening = create_screening(
            screening_data
        )


        if not saved_screening:

            raise HTTPException(
                status_code=500,
                detail=(
                    "Screening result "
                    "could not be saved."
                )
            )


        screening_id = (
            saved_screening[0]["id"]
        )


        # --------------------------------
        # Response
        # --------------------------------

        return {

            "success": True,

            "already_screened": False,

            "screening_id":
                screening_id,

            "candidate_id":
                request.candidate_id,

            "job_id":
                request.job_id,

            "result":
                result.model_dump()
        }


    except HTTPException:

        raise


    except Exception as error:

        raise HTTPException(
            status_code=500,
            detail=(
                "Failed to screen candidate: "
                f"{str(error)}"
            )
        )
       
@router.get("/job/{job_id}/rankings")
async def get_job_rankings(
    job_id: str
):

    try:

        # Verify that the job exists
        job_data = get_job(job_id)

        if not job_data:
            raise HTTPException(
                status_code=404,
                detail="Job not found."
            )

        # Get screenings ordered by score
        screenings = get_screenings_for_job(
            job_id
        )

        rankings = []

        for index, screening in enumerate(
            screenings,
            start=1
        ):

            candidate = screening.get(
                "candidates"
            )

            rankings.append({
                "rank": index,
                "candidate_id": screening[
                    "candidate_id"
                ],
                "candidate": candidate,
                "score": screening["score"],
                "recommendation": screening[
                    "recommendation"
                ],
                "matched_skills": screening[
                    "matched_skills"
                ],
                "missing_required_skills": screening[
                    "missing_required_skills"
                ],
                "matched_preferred_skills": screening[
                    "matched_preferred_skills"
                ],
                "strengths": screening[
                    "strengths"
                ],
                "concerns": screening[
                    "concerns"
                ],
                "justification": screening[
                    "justification"
                ]
            })

        return {
            "success": True,
            "job_id": job_id,
            "total_candidates": len(rankings),
            "rankings": rankings
        }

    except HTTPException:
        raise

    except Exception as error:

        raise HTTPException(
            status_code=500,
            detail=f"Failed to fetch rankings: {str(error)}"
        )
        
@router.get("/result")
async def get_screening_result_api(
    candidate_id: str,
    job_id: str
):

    try:

        # --------------------------------
        # Get screening result
        # --------------------------------

        result = get_screening_result(
            candidate_id,
            job_id
        )

        if not result:
            raise HTTPException(
                status_code=404,
                detail="Screening result not found."
            )

        # --------------------------------
        # Get candidate
        # --------------------------------

        candidate_data = get_candidate(
            candidate_id
        )

        if not candidate_data:
            raise HTTPException(
                status_code=404,
                detail="Candidate not found."
            )

        return {
            "success": True,
            "screening": result[0],
            "candidate": candidate_data[0]
        }

    except HTTPException:
        raise

    except Exception as error:

        raise HTTPException(
            status_code=500,
            detail=(
                "Failed to fetch screening result: "
                f"{str(error)}"
            )
        )
        
@router.get("/candidate/{candidate_id}/history")
async def get_candidate_screening_history(
    candidate_id: str
):

    try:

        # --------------------------------
        # Verify candidate
        # --------------------------------

        candidate_data = get_candidate(
            candidate_id
        )

        if not candidate_data:

            raise HTTPException(
                status_code=404,
                detail="Candidate not found."
            )


        # --------------------------------
        # Get screening history
        # --------------------------------

        screenings = (
            get_screenings_for_candidate(
                candidate_id
            )
        )


        return {

            "success": True,

            "candidate_id":
                candidate_id,

            "total":
                len(screenings),

            "screenings":
                screenings
        }


    except HTTPException:

        raise


    except Exception as error:

        raise HTTPException(
            status_code=500,
            detail=(
                "Failed to fetch candidate "
                f"screening history: {str(error)}"
            )
        )