export interface Experience {
  company: string;
  role: string;
  duration?: string | null;
  description?: string | null;
}

export interface Education {
  institution: string;
  degree: string;
  field?: string | null;
  year?: string | null;
}

export interface Candidate {
  id: string;
  name: string;
  email?: string | null;
  phone?: string | null;

  skills: string[];

  experience: any[];
  education: any[];

  total_experience_years?: number | null;

  resume_filename?: string | null;
  resume_file_path?: string | null;

  created_at?: string;
  updated_at?: string;
}

export interface Job {
  id: string;
  title: string;
  description: string;

  required_skills: string[];
  preferred_skills: string[];
  responsibilities: string[];

  minimum_experience_years?: number | null;

  education_requirements: string[];

  created_at?: string;
  updated_at?: string;
}

export interface Screening {
  id: string;

  candidate_id: string;

  job_id: string;

  score: number;

  recommendation: string;

  matched_skills: string[];

  missing_required_skills: string[];

  matched_preferred_skills: string[];

  strengths: string[];

  concerns: string[];

  justification: string;

  created_at?: string;
}

export interface ScreeningResult {
  score: number;
  recommendation: string;
  matched_skills: string[];
  missing_required_skills: string[];
  matched_preferred_skills: string[];
  strengths: string[];
  concerns: string[];
  justification: string;
}

export interface Ranking {
  rank: number;
  candidate_id: string;
  candidate: Candidate;
  score: number;
  recommendation: string;
  matched_skills: string[];
  missing_required_skills: string[];
  matched_preferred_skills: string[];
  strengths: string[];
  concerns: string[];
  justification: string;
}

export interface CandidateScreeningHistory {
  id: string;

  candidate_id: string;

  job_id: string;

  score: number;

  recommendation: string;

  matched_skills: string[];

  missing_required_skills: string[];

  matched_preferred_skills: string[];

  strengths: string[];

  concerns: string[];

  justification: string;

  created_at?: string;

  jobs?: {
    id: string;
    title: string;
  };
}