import os
import shutil
from uuid import uuid4

from fastapi import APIRouter, UploadFile, File, HTTPException

from app.services.pdf_parser import extract_text_from_pdf
from app.services.llm_service import extract_resume_data

router = APIRouter(
    prefix="/api/resumes",
    tags=["Resumes"]
)

UPLOAD_DIR = "uploads"

os.makedirs(UPLOAD_DIR, exist_ok=True)


@router.post("/upload")
async def upload_resume(file: UploadFile = File(...)):

    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(
            status_code=400,
            detail="Only PDF resumes are currently supported."
        )

    file_id = str(uuid4())

    file_path = os.path.join(
        UPLOAD_DIR,
        f"{file_id}.pdf"
    )

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    try:
        resume_text = extract_text_from_pdf(file_path)

        if not resume_text:
            raise HTTPException(
                status_code=400,
                detail="Could not extract text from resume."
            )

        candidate = extract_resume_data(resume_text)

        return {
            "success": True,
            "candidate": candidate
        }

    except Exception as error:

        raise HTTPException(
            status_code=500,
            detail=str(error)
        )