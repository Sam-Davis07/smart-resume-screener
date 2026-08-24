from typing import List

from pydantic import BaseModel, Field


class ScreeningResult(BaseModel):
    score: float = Field(
        ge=1,
        le=10
    )

    recommendation: str

    matched_skills: List[str] = Field(
        default_factory=list
    )

    missing_required_skills: List[str] = Field(
        default_factory=list
    )

    matched_preferred_skills: List[str] = Field(
        default_factory=list
    )

    strengths: List[str] = Field(
        default_factory=list
    )

    concerns: List[str] = Field(
        default_factory=list
    )

    justification: str