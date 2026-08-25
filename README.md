# Smart Resume Screener

An AI-powered recruitment platform that helps recruiters upload resumes, extract structured candidate information, create and manage job descriptions, screen candidates using AI, generate match scores and recommendations, and rank candidates based on job fit.

## 🔗 Links

- **Live Demo:** https://smart-resume-screener-five.vercel.app/
- **GitHub Repository:** https://github.com/Sam-Davis07/smart-resume-screener

---

## Overview

Smart Resume Screener is a full-stack AI-powered recruitment application designed to simplify and automate the initial candidate screening process.

Recruiters can upload PDF resumes, automatically extract candidate information, create job descriptions, and use AI-powered semantic matching to evaluate how well each candidate fits a particular role.

The platform provides structured candidate profiles, screening scores, strengths, concerns, recommendations, rankings, and screening history through a recruiter-focused dashboard.

---

## Features

### Resume Management
- Upload PDF resumes
- Extract candidate information automatically
- Parse skills, education, experience, contact details, and other relevant information
- View candidate profiles
- Search candidates
- Download/view uploaded resumes
- Delete candidates
- Prevent duplicate candidates

### Job Management
- Create job descriptions
- Store job requirements
- Manage available jobs
- View job details
- Associate candidates with specific jobs

### AI-Powered Screening
- Compare resumes against job descriptions
- Perform semantic candidate-job matching
- Generate match scores
- Generate AI recommendations
- Identify candidate strengths
- Identify potential concerns or skill gaps
- Provide screening justification
- Rank candidates for a particular job

### Screening Management
- Store screening results
- View screening history
- Prevent duplicate screenings
- Compare candidate suitability
- Track screening results for different jobs

### Recruiter Dashboard
- Recruitment overview
- Candidate statistics
- Job statistics
- Screening statistics
- Candidate and job management
- Screening result visualization

---

## System Architecture

```text
┌───────────────────────────────┐
│        Recruiter Frontend     │
│                               │
│ Dashboard • Jobs • Candidates │
│ Screening • Search • Results  │
└───────────────┬───────────────┘
                │
                │ REST API
                ▼
┌───────────────────────────────┐
│        FastAPI Backend        │
│                               │
│ Resume APIs                   │
│ Candidate APIs                │
│ Job APIs                      │
│ Screening APIs                │
│ Dashboard APIs                │
└───────┬───────────┬───────────┘
        │           │
        │           │
        ▼           ▼
┌─────────────┐  ┌────────────────┐
│  Supabase   │  │   AI / LLM     │
│             │  │                │
│ Database    │  │ Resume Parsing │
│ Storage     │  │ Screening      │
│             │  │ Matching       │
└─────────────┘  └────────────────┘
        ▲
        │
        │
┌───────────────────────────────┐
│         PDF Parser            │
│                               │
│ Extract text from uploaded    │
│ PDF resumes                   │
└───────────────────────────────┘
```

---

## Application Flow

```text
Recruiter
   │
   ▼
Upload Resume
   │
   ▼
PDF Text Extraction
   │
   ▼
AI Resume Parsing
   │
   ▼
Structured Candidate Profile
   │
   ▼
Select / Create Job
   │
   ▼
AI Candidate Screening
   │
   ▼
Match Score + Recommendation
   │
   ├── Strengths
   ├── Concerns
   └── Justification
   │
   ▼
Candidate Ranking
   │
   ▼
Recruiter Dashboard
```

---

## AI / LLM Workflow

The application uses an LLM in two major stages.

### 1. Resume Extraction

The uploaded PDF is first converted into text.

The extracted resume text is then passed to the AI service to generate structured candidate information such as:

- Candidate name
- Email
- Phone
- Skills
- Education
- Work experience
- Experience details
- Other relevant candidate information

This structured information is then stored for later recruiter access and screening.

### 2. Candidate Screening

When a recruiter screens a candidate for a job, the system provides the AI model with:

- Candidate information
- Candidate experience
- Candidate skills
- Job description
- Job requirements

The model evaluates the semantic fit between the candidate and the role.

The screening produces:

- Match score
- Recommendation
- Strengths
- Concerns
- Screening justification

The resulting screening data is stored and can be used to rank candidates for the selected job.

---

## Example Screening Prompt

The screening process follows the concept:

```text
Compare the following candidate resume/profile with this job description.

Evaluate how well the candidate fits the role based on:
- Required skills
- Relevant experience
- Education
- Technical qualifications
- Job responsibilities

Provide:
1. Match score
2. Recommendation
3. Candidate strengths
4. Concerns or skill gaps
5. Clear justification for the decision
```

The goal is to use semantic understanding rather than relying only on exact keyword matching.

---

## Tech Stack

### Frontend
- Next.js
- React
- TypeScript
- Tailwind CSS

### Backend
- Python
- FastAPI
- REST APIs

### Database & Storage
- Supabase
- PostgreSQL
- Supabase Storage

### AI
- Large Language Model (LLM)
- AI-powered resume extraction
- Semantic candidate-job matching
- AI-generated screening recommendations

### Document Processing
- PDF resume parsing
- Text extraction

### Deployment
- Vercel for the frontend
- Backend/API deployment according to the project configuration

---

## Project Structure

A simplified view of the project architecture:

```text
smart-resume-screener/
│
├── frontend/
│   ├── app/
│   ├── components/
│   ├── public/
│   └── ...
│
├── backend/
│   ├── routes/
│   ├── services/
│   ├── models/
│   ├── utils/
│   └── ...
│
├── README.md
└── ...
```

> The exact directory structure may vary depending on the current implementation in the repository.

---

## Data Management

The application uses Supabase/PostgreSQL to persist recruitment data.

Core data includes:

### Candidates
- Candidate information
- Skills
- Education
- Experience
- Resume information
- Resume storage reference

### Jobs
- Job title
- Job description
- Job requirements

### Screenings
- Candidate
- Job
- Match score
- Recommendation
- Strengths
- Concerns
- AI-generated justification
- Screening history

The system also includes duplicate protection for candidates and screenings.

---

## Duplicate Protection

The application prevents unnecessary duplicate records by checking:

### Duplicate Candidates
Candidate email information can be used to prevent the same candidate from being inserted multiple times.

### Duplicate Screenings
The system prevents the same candidate from being unnecessarily screened multiple times for the same job.

This helps maintain clean recruitment data and avoids redundant AI processing.

---

## Recruiter Dashboard

The recruiter dashboard provides a centralized interface for managing the recruitment workflow.

Recruiters can:

- View recruitment statistics
- Manage candidates
- Search candidates
- Manage jobs
- Upload resumes
- Screen candidates
- View screening results
- Review candidate rankings
- Access screening history

---

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/Sam-Davis07/smart-resume-screener.git
cd smart-resume-screener
```

### 2. Install Dependencies

Install the dependencies for the frontend and backend according to their respective package/configuration files.

For the frontend:

```bash
npm install
```

For the backend, create a Python virtual environment and install the project's Python dependencies.

```bash
python -m venv venv
```

Activate the environment:

**Windows**

```bash
venv\Scripts\activate
```

**macOS/Linux**

```bash
source venv/bin/activate
```

Then install the backend requirements:

```bash
pip install -r requirements.txt
```

### 3. Configure Environment Variables

Create the appropriate `.env` files for the frontend and backend.

Typical configuration includes:

```env
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_key
LLM_API_KEY=your_llm_api_key
```

Use the exact variable names required by the current application code.

### 4. Start the Backend

Run the FastAPI application using the project's configured entry point.

For example:

```bash
uvicorn main:app --reload
```

### 5. Start the Frontend

```bash
npm run dev
```

The frontend should then be available through the local development URL shown by Next.js.

---

## Live Application

The latest deployed version of the application is available here:

**https://smart-resume-screener-five.vercel.app/**

---

## Source Code

The complete source code is available on GitHub:

**https://github.com/Sam-Davis07/smart-resume-screener**

---

## Project Goals

The project was built to demonstrate how AI can be integrated into a practical recruitment workflow.

The main goals are:

- Automate repetitive resume screening tasks
- Convert unstructured resumes into structured candidate data
- Improve candidate-job matching
- Provide transparent AI-generated screening reasoning
- Help recruiters prioritize candidates
- Maintain centralized candidate and job data
- Build a production-style full-stack AI application

---

## Future Improvements

Potential future improvements include:

- Authentication and role-based access control
- Recruiter accounts and organization management
- Advanced candidate filtering
- Side-by-side candidate comparison
- More detailed analytics
- Email notifications
- Interview scheduling
- Resume scoring customization
- Screening feedback from recruiters
- AI-generated interview questions
- Bias-aware screening controls
- Bulk resume uploads
- Background processing for large resume batches

---

## License

This project is intended as a portfolio and demonstration project.

---

## Author

**Sam Davis**

- GitHub: https://github.com/Sam-Davis07
- Project: https://github.com/Sam-Davis07/smart-resume-screener
- Live Demo: https://smart-resume-screener-five.vercel.app/
