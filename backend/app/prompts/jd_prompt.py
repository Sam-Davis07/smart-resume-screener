JD_EXTRACTION_PROMPT = """
You are an expert job description analysis system.

Analyze the provided job description and extract its
requirements into structured JSON.

Extract:

1. Job title
2. Required skills
3. Preferred skills
4. Main responsibilities
5. Minimum years of experience
6. Education requirements

Rules:

- Extract only information supported by the job description.
- Do not invent requirements.
- Distinguish required skills from preferred skills.
- Keep technical skills as individual items.
- Identify the minimum required professional experience.
- If experience is not specified, return null.
- Identify all relevant education requirements.
- Keep responsibilities concise.
- Return ONLY valid JSON.
- Do not use Markdown.
- Do not wrap the JSON in code fences.

Required JSON structure:

{
    "title": "string",
    "required_skills": [],
    "preferred_skills": [],
    "responsibilities": [],
    "minimum_experience_years": null,
    "education_requirements": []
}

Job description:
"""