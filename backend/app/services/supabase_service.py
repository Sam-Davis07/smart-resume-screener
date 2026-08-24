import os
from pathlib import Path

from dotenv import load_dotenv
from supabase import create_client, Client


# Load backend/.env
BASE_DIR = Path(__file__).resolve().parents[2]
load_dotenv(BASE_DIR / ".env")


SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")


if not SUPABASE_URL:
    raise ValueError(
        "SUPABASE_URL is not configured in backend/.env"
    )

if not SUPABASE_KEY:
    raise ValueError(
        "SUPABASE_KEY is not configured in backend/.env"
    )


supabase: Client = create_client(
    SUPABASE_URL,
    SUPABASE_KEY
)


# ============================================
# CANDIDATES
# ============================================

def create_candidate(candidate_data: dict):

    response = (
        supabase
        .table("candidates")
        .insert(candidate_data)
        .execute()
    )

    return response.data


def get_candidate(candidate_id: str):

    response = (
        supabase
        .table("candidates")
        .select("*")
        .eq("id", candidate_id)
        .execute()
    )

    return response.data


def get_candidates():

    response = (
        supabase
        .table("candidates")
        .select("*")
        .order("created_at", desc=True)
        .execute()
    )

    return response.data


# ============================================
# JOBS
# ============================================

def create_job(job_data: dict):

    response = (
        supabase
        .table("jobs")
        .insert(job_data)
        .execute()
    )

    return response.data


def get_job(job_id: str):

    response = (
        supabase
        .table("jobs")
        .select("*")
        .eq("id", job_id)
        .execute()
    )

    return response.data


def get_jobs():

    response = (
        supabase
        .table("jobs")
        .select("*")
        .order("created_at", desc=True)
        .execute()
    )

    return response.data


# ============================================
# SCREENINGS
# ============================================

def create_screening(screening_data: dict):

    response = (
        supabase
        .table("screenings")
        .insert(screening_data)
        .execute()
    )

    return response.data


def get_screenings():

    response = (
        supabase
        .table("screenings")
        .select("*")
        .order("score", desc=True)
        .execute()
    )

    return response.data

def get_screenings_for_job(job_id: str):

    response = (
        supabase
        .table("screenings")
        .select(
            """
            *,
            candidates (
                id,
                name,
                email,
                phone,
                skills,
                experience,
                education,
                total_experience_years,
                resume_filename
            )
            """
        )
        .eq("job_id", job_id)
        .order("score", desc=True)
        .execute()
    )

    return response.data


def get_all_candidates():

    response = (
        supabase
        .table("candidates")
        .select("*")
        .order("created_at", desc=True)
        .execute()
    )

    return response.data

def get_job_by_id(job_id: str):

    response = (
        supabase
        .table("jobs")
        .select("*")
        .eq("id", job_id)
        .limit(1)
        .execute()
    )

    return response.data

def get_all_jobs():
    response = (
        supabase
        .table("jobs")
        .select("*")
        .order("created_at", desc=True)
        .execute()
    )

    return response.data

def get_screening_result(
    candidate_id: str,
    job_id: str
):
    response = (
        supabase
        .table("screenings")
        .select("*")
        .eq("candidate_id", candidate_id)
        .eq("job_id", job_id)
        .order("created_at", desc=True)
        .limit(1)
        .execute()
    )

    return response.data

def get_screenings_for_candidate(
    candidate_id: str
):
    response = (
        supabase
        .table("screenings")
        .select(
            """
            *,
            jobs (
                id,
                title
            )
            """
        )
        .eq(
            "candidate_id",
            candidate_id
        )
        .order(
            "created_at",
            desc=True
        )
        .execute()
    )

    return response.data

def delete_job(job_id: str):
    response = (
        supabase
        .table("jobs")
        .delete()
        .eq("id", job_id)
        .execute()
    )

    return response.data

def get_dashboard_stats():

    # --------------------------------
    # Candidates
    # --------------------------------

    candidates_response = (
        supabase
        .table("candidates")
        .select(
            "id, name, email, skills, "
            "total_experience_years, created_at"
        )
        .order(
            "created_at",
            desc=True
        )
        .execute()
    )

    candidates = (
        candidates_response.data or []
    )


    # --------------------------------
    # Jobs
    # --------------------------------

    jobs_response = (
        supabase
        .table("jobs")
        .select(
            "id, title, minimum_experience_years, "
            "created_at"
        )
        .order(
            "created_at",
            desc=True
        )
        .execute()
    )

    jobs = jobs_response.data or []


    # --------------------------------
    # Screenings
    # --------------------------------

    screenings_response = (
        supabase
        .table("screenings")
        .select(
            "id, candidate_id, job_id, score, "
            "recommendation, created_at"
        )
        .order(
            "created_at",
            desc=True
        )
        .execute()
    )

    screenings = (
        screenings_response.data or []
    )


    # --------------------------------
    # Average score
    # --------------------------------

    scores = [
        float(screening["score"])
        for screening in screenings
        if screening.get("score") is not None
    ]

    average_score = (
        round(
            sum(scores) / len(scores),
            2
        )
        if scores
        else 0
    )


    # --------------------------------
    # Recommendation counts
    # --------------------------------

    recommendation_counts = {
        "Strong Match": 0,
        "Good Match": 0,
        "Weak Match": 0,
        "Reject": 0,
    }


    for screening in screenings:

        recommendation = (
            screening.get(
                "recommendation"
            )
        )

        if recommendation in recommendation_counts:

            recommendation_counts[
                recommendation
            ] += 1


    # --------------------------------
    # Recent candidates
    # --------------------------------

    recent_candidates = candidates[:5]


    # --------------------------------
    # Recent jobs
    # --------------------------------

    recent_jobs = jobs[:5]


    # --------------------------------
    # Response
    # --------------------------------

    return {

        "total_candidates":
            len(candidates),

        "total_jobs":
            len(jobs),

        "total_screenings":
            len(screenings),

        "average_score":
            average_score,

        "recommendations":
            recommendation_counts,

        "recent_candidates":
            recent_candidates,

        "recent_jobs":
            recent_jobs,

    }
    
def search_candidates_and_jobs(
    query: str
):

    search_term = f"%{query}%"

    candidates_response = (
        supabase
        .table("candidates")
        .select(
            "id, name, email, skills"
        )
        .or_(
            f"name.ilike.{search_term},"
            f"email.ilike.{search_term}"
        )
        .limit(10)
        .execute()
    )


    jobs_response = (
        supabase
        .table("jobs")
        .select(
            "id, title"
        )
        .ilike(
            "title",
            search_term
        )
        .limit(10)
        .execute()
    )


    return {
        "candidates":
            candidates_response.data or [],

        "jobs":
            jobs_response.data or []
    }
    
def get_candidate_by_email(
    email: str
):

    response = (
        supabase
        .table("candidates")
        .select("*")
        .eq("email", email)
        .limit(1)
        .execute()
    )

    return response.data or []
def delete_candidate(candidate_id: str):

    # --------------------------------
    # Delete related screenings first
    # --------------------------------

    supabase.table(
        "screenings"
    ).delete().eq(
        "candidate_id",
        candidate_id
    ).execute()


    # --------------------------------
    # Delete candidate
    # --------------------------------

    response = (
        supabase
        .table("candidates")
        .delete()
        .eq(
            "id",
            candidate_id
        )
        .execute()
    )

    return response.data or []

def get_candidate_by_id(
    candidate_id: str
):

    response = (
        supabase
        .table("candidates")
        .select("*")
        .eq(
            "id",
            candidate_id
        )
        .limit(1)
        .execute()
    )

    return response.data or []