# Smart Resume Screener

AI-powered resume screening system that helps recruiters
parse resumes, match candidates with job descriptions,
and rank candidates based on AI-generated screening results.

## Features

- PDF resume upload
- AI resume parsing
- Candidate information extraction
- Job description processing
- AI-powered candidate screening
- Match score generation
- Candidate ranking
- Screening history
- Candidate search
- Job management
- Resume viewing/downloading
- Duplicate candidate prevention
- Duplicate screening prevention
- Recruiter dashboard

## Tech Stack

### Frontend

- Next.js
- TypeScript
- Tailwind CSS
- Lucide React

### Backend

- FastAPI
- Python
- Pydantic

### Database

- Supabase
- PostgreSQL

### AI

- Google Gemini API

### Resume Processing

- PDF text extraction

## Architecture

```text
User
  ↓
Next.js Frontend
  ↓
FastAPI Backend
  ↓
  ├── PDF Parser
  │      ↓
  │   Resume Text
  │
  ├── Gemini AI
  │      ↓
  │   Resume Analysis
  │
  └── Supabase
         ↓
      Database
```
## Workflow

1. Recruiter uploads resume
2. Backend extracts PDF text
3. Gemini extracts candidate information
4. Recruiter creates a job description
5. Candidate is screened against the job
6. Gemini calculates match score
7. Result is stored in Supabase
8. Candidates are ranked
9. Recruiter reviews results

## Screening Output

Each screening provides:

- Score
- Recommendation
- Matched skills
- Missing required skills
- Matched preferred skills
- Strengths
- Concerns
- Justification

## LLM Prompt

The system uses an LLM for:

### Resume Extraction

Convert the resume text into structured candidate information
including name, email, skills, experience and education.

### Candidate Screening

Compare the candidate profile against the job description
and return a structured evaluation including score,
recommendation, matched skills, missing skills,
strengths, concerns and justification.

## Database

Main tables:

- candidates
- jobs
- screenings

## Running Locally

### Backend

```bash
cd backend

python -m venv venv

# Windows
venv\Scripts\activate

pip install -r requirements.txt

uvicorn app.main:app --reload