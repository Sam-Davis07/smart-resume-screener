import os
import shutil
from uuid import uuid4

from fastapi import (
    APIRouter,
    UploadFile,
    File,
    HTTPException
)

from fastapi.responses import FileResponse

from app.services.pdf_parser import (
    extract_text_from_pdf
)

from app.services.llm_service import (
    extract_resume_data
)

from app.services.supabase_service import (
    create_candidate,
    get_candidate_by_email,
    get_candidate_by_id,
    get_all_candidates,
    delete_candidate
)


router = APIRouter(
    prefix="/api/resumes",
    tags=["Resumes"]
)


UPLOAD_DIR = "uploads"

os.makedirs(
    UPLOAD_DIR,
    exist_ok=True
)


@router.post("/upload")
async def upload_resume(
    file: UploadFile = File(...)
):

    # --------------------------------
    # Validate file
    # --------------------------------

    if not file.filename:

        raise HTTPException(
            status_code=400,
            detail="No file was provided."
        )


    if not file.filename.lower().endswith(
        ".pdf"
    ):

        raise HTTPException(
            status_code=400,
            detail=(
                "Only PDF files are "
                "currently supported."
            )
        )


    # --------------------------------
    # Save uploaded file
    # --------------------------------

    file_id = str(
        uuid4()
    )


    file_path = os.path.join(
        UPLOAD_DIR,
        f"{file_id}.pdf"
    )


    with open(
        file_path,
        "wb"
    ) as buffer:

        shutil.copyfileobj(
            file.file,
            buffer
        )


    try:

        # --------------------------------
        # Extract resume text
        # --------------------------------

        resume_text = (
            extract_text_from_pdf(
                file_path
            )
        )


        if not resume_text:

            raise HTTPException(
                status_code=400,
                detail=(
                    "Could not extract "
                    "text from this PDF."
                )
            )


        # --------------------------------
        # Extract candidate information
        # --------------------------------

        candidate = (
            extract_resume_data(
                resume_text
            )
        )


        candidate_data = (
            candidate.model_dump()
        )


        # --------------------------------
        # Normalize email
        # --------------------------------

        email = candidate_data.get(
            "email"
        )


        if email:

            email = email.strip().lower()

            candidate_data["email"] = email


        # --------------------------------
        # Check existing candidate
        # --------------------------------

        if email:

            existing_candidate = (
                get_candidate_by_email(
                    email
                )
            )


            if existing_candidate:

                existing = (
                    existing_candidate[0]
                )


                return {

                    "success": True,

                    "already_exists": True,

                    "message": (
                        "Candidate already "
                        "exists."
                    ),

                    "filename":
                        file.filename,

                    "file_id":
                        file_id,

                    "candidate_id":
                        existing["id"],

                    "candidate":
                        existing

                }


        # --------------------------------
        # Prepare candidate data
        # --------------------------------

        candidate_data[
            "resume_filename"
        ] = file.filename


        candidate_data[
            "resume_file_path"
        ] = file_path


        # --------------------------------
        # Create candidate
        # --------------------------------

        saved_candidate = (
            create_candidate(
                candidate_data
            )
        )


        if not saved_candidate:

            raise HTTPException(
                status_code=500,
                detail=(
                    "Candidate could "
                    "not be saved."
                )
            )


        candidate_id = (
            saved_candidate[0]["id"]
        )


        # --------------------------------
        # Response
        # --------------------------------

        return {

            "success": True,

            "already_exists": False,

            "filename":
                file.filename,

            "file_id":
                file_id,

            "candidate_id":
                candidate_id,

            "candidate":
                candidate.model_dump()

        }


    except HTTPException:

        raise


    except Exception as error:

        raise HTTPException(
            status_code=500,
            detail=(
                "Failed to process "
                f"resume: {str(error)}"
            )
        )


# ========================================
# GET ALL CANDIDATES
# ========================================

@router.get("/candidates")
async def get_candidates():

    try:

        candidates = (
            get_all_candidates()
        )


        return {

            "success": True,

            "total":
                len(candidates),

            "candidates":
                candidates

        }


    except Exception as error:

        raise HTTPException(
            status_code=500,
            detail=(
                "Failed to fetch "
                f"candidates: {str(error)}"
            )
        )
        
# ========================================
# DELETE CANDIDATE
# ========================================

@router.delete("/candidates/{candidate_id}")
async def delete_candidate_api(
    candidate_id: str
):

    try:

        # --------------------------------
        # Find candidate
        # --------------------------------

        candidate_data = (
            get_candidate_by_id(
                candidate_id
            )
        )


        if not candidate_data:

            raise HTTPException(
                status_code=404,
                detail="Candidate not found."
            )


        candidate = candidate_data[0]


        # --------------------------------
        # Get resume path
        # --------------------------------

        resume_file_path = (
            candidate.get(
                "resume_file_path"
            )
        )


        # --------------------------------
        # Delete database record
        # --------------------------------

        deleted_candidate = (
            delete_candidate(
                candidate_id
            )
        )


        if not deleted_candidate:

            raise HTTPException(
                status_code=500,
                detail=(
                    "Candidate could not "
                    "be deleted."
                )
            )


        # --------------------------------
        # Delete local resume file
        # --------------------------------

        if (
            resume_file_path
            and os.path.exists(
                resume_file_path
            )
        ):

            os.remove(
                resume_file_path
            )


        return {

            "success": True,

            "message":
                "Candidate deleted successfully.",

            "candidate_id":
                candidate_id

        }


    except HTTPException:

        raise


    except Exception as error:

        raise HTTPException(
            status_code=500,
            detail=(
                "Failed to delete candidate: "
                f"{str(error)}"
            )
        )
        
# ========================================
# DOWNLOAD RESUME
# ========================================

@router.get(
    "/candidates/{candidate_id}/resume"
)
async def download_candidate_resume(
    candidate_id: str
):

    try:

        # --------------------------------
        # Find candidate
        # --------------------------------

        candidate_data = (
            get_candidate_by_id(
                candidate_id
            )
        )

        if not candidate_data:

            raise HTTPException(
                status_code=404,
                detail="Candidate not found."
            )

        candidate = candidate_data[0]


        # --------------------------------
        # Get resume path
        # --------------------------------

        resume_file_path = (
            candidate.get(
                "resume_file_path"
            )
        )

        if not resume_file_path:

            raise HTTPException(
                status_code=404,
                detail=(
                    "Resume file is not "
                    "available for this candidate."
                )
            )


        # --------------------------------
        # Check file exists
        # --------------------------------

        if not os.path.isfile(
            resume_file_path
        ):

            raise HTTPException(
                status_code=404,
                detail=(
                    "Resume file could "
                    "not be found."
                )
            )


        # --------------------------------
        # Filename
        # --------------------------------

        filename = (
            candidate.get(
                "resume_filename"
            )
            or "resume.pdf"
        )


        # --------------------------------
        # Return PDF
        # --------------------------------

        return FileResponse(
            path=resume_file_path,
            media_type="application/pdf",
            filename=filename
        )


    except HTTPException:

        raise


    except Exception as error:

        raise HTTPException(
            status_code=500,
            detail=(
                "Failed to download resume: "
                f"{str(error)}"
            )
        )