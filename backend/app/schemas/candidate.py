from typing import List, Optional

from pydantic import BaseModel, Field


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

    skills: List[str] = Field(default_factory=list)

    experience: List[Experience] = Field(
        default_factory=list
    )

    education: List[Education] = Field(
        default_factory=list
    )

    total_experience_years: Optional[float] = None