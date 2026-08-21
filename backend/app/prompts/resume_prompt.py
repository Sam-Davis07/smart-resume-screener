RESUME_EXTRACTION_PROMPT = """
You are an expert resume parser.

Analyze the resume text provided below.

Extract the following information:

1. Candidate name
2. Email
3. Phone number
4. Technical and professional skills
5. Work experience
6. Education
7. Estimated total years of professional experience

Return ONLY valid JSON.

The JSON must follow this structure:

{
    "name": "string",
    "email": "string or null",
    "phone": "string or null",
    "skills": [],
    "experience": [
        {
            "company": "string",
            "role": "string",
            "duration": "string or null",
            "description": "string or null"
        }
    ],
    "education": [
        {
            "institution": "string",
            "degree": "string",
            "field": "string or null",
            "year": "string or null"
        }
    ],
    "total_experience_years": 0
}

Do not invent information that is not present in the resume.

Resume:
"""