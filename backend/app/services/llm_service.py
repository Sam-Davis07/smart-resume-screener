import json
import os
from pathlib import Path
import time

from dotenv import load_dotenv
from google import genai

from app.prompts.resume_prompt import RESUME_EXTRACTION_PROMPT
from app.schemas.candidate import Candidate
from app.prompts.jd_prompt import JD_EXTRACTION_PROMPT
from app.schemas.job import JobDescription
from app.prompts.matching_prompt import MATCHING_PROMPT
from app.schemas.screening import ScreeningResult

# Load backend/.env
BASE_DIR = Path(__file__).resolve().parents[2]
load_dotenv(BASE_DIR / ".env")


# Get Gemini API key
api_key = os.getenv("GEMINI_API_KEY")

if not api_key:
    raise ValueError(
        "GEMINI_API_KEY is not configured in backend/.env"
    )


# Initialize Gemini client
client = genai.Client(api_key=api_key)


def extract_resume_data(resume_text: str) -> Candidate:

    prompt = (
        RESUME_EXTRACTION_PROMPT
        + "\n\n"
        + resume_text
    )

    response = client.models.generate_content(
        model="gemini-3.6-flash",
        contents=prompt,
    )

    content = response.text

    if not content:
        raise ValueError(
            "Gemini returned an empty response."
        )

    # Remove markdown code fences if Gemini adds them
    content = content.strip()

    if content.startswith("```json"):
        content = content[7:]

    if content.startswith("```"):
        content = content[3:]

    if content.endswith("```"):
        content = content[:-3]

    content = content.strip()

    data = json.loads(content)

    return Candidate.model_validate(data)


def extract_job_data(job_description_text: str) -> JobDescription:

    prompt = (
        JD_EXTRACTION_PROMPT
        + "\n\n"
        + job_description_text
    )

    response = client.models.generate_content(
        model="gemini-3.6-flash",
        contents=prompt,
    )

    content = response.text

    if not content:
        raise ValueError(
            "Gemini returned an empty response."
        )

    content = content.strip()

    # Remove Markdown code fences if Gemini adds them
    if content.startswith("```json"):
        content = content[7:]

    if content.startswith("```"):
        content = content[3:]

    if content.endswith("```"):
        content = content[:-3]

    content = content.strip()

    data = json.loads(content)

    return JobDescription.model_validate(data)

def generate_with_fallback(prompt: str):
    models = [
        "gemini-3.6-flash",
        "gemini-3.7-flash",
    ]

    last_error = None

    for model in models:
        try:
            response = client.models.generate_content(
                model=model,
                contents=prompt,
            )

            return response

        except Exception as error:
            last_error = error

            print(
                f"Model {model} failed: {error}"
            )

            time.sleep(1)

    raise last_error

def screen_candidate(
    candidate: Candidate,
    job: JobDescription
) -> ScreeningResult:

    prompt = MATCHING_PROMPT.replace(
        "{candidate}",
        candidate.model_dump_json(indent=2)
    ).replace(
        "{job}",
        job.model_dump_json(indent=2)
    )

    response = generate_with_fallback(prompt)

    content = response.text

    if not content:
        raise ValueError(
            "Gemini returned an empty screening response."
        )

    content = content.strip()

    # Remove Markdown code fences if Gemini adds them
    if content.startswith("```json"):
        content = content[7:]

    elif content.startswith("```"):
        content = content[3:]

    if content.endswith("```"):
        content = content[:-3]

    content = content.strip()

    data = json.loads(content)

    return ScreeningResult.model_validate(data)