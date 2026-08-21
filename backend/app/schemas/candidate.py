from pydantic import BaseModel
from typing import List, Optional


class Experience(BaseModel):
    company: str
    role: str
    duration: Optional[str] = None
    description: Optional[str] = None


class Education(BaseModel):
    institution: str
    degree: str
    field: Optional[str] = None
    year: Optional[str] = None


class Candidate(BaseModel):
    name: str
    email: Optional[str] = None
    phone: Optional[str] = None

    skills: List[str] = []

    experience: List[Experience] = []

    education: List[Education] = []

    total_experience_years: Optional[float] = None