const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "http://127.0.0.1:8000";

async function handleResponse(
  response: Response
) {
  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.detail || "Something went wrong."
    );
  }

  return data;
}


export async function uploadResume(
  file: File
) {
  const formData = new FormData();

  formData.append("file", file);

  const response = await fetch(
    `${API_URL}/api/resumes/upload`,
    {
      method: "POST",
      body: formData,
    }
  );

  return handleResponse(response);
}


export async function createJob(
  description: string
) {
  const response = await fetch(
    `${API_URL}/api/jobs/parse`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        description,
      }),
    }
  );

  return handleResponse(response);
}


export async function screenCandidate(
  candidateId: string,
  jobId: string
) {
  const response = await fetch(
    `${API_URL}/api/screening/evaluate`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        candidate_id: candidateId,
        job_id: jobId,
      }),
    }
  );

  return handleResponse(response);
}


export async function getJobRankings(
  jobId: string
) {
  const response = await fetch(
    `${API_URL}/api/screening/job/${jobId}/rankings`,
    {
      cache: "no-store",
    }
  );

  return handleResponse(response);
}


export async function getCandidates() {

  const response = await fetch(
    `${API_URL}/api/resumes/candidates`,
    {
      cache: "no-store",
    }
  );

  return handleResponse(response);
}

export async function getJobs() {
  const response = await fetch(
    `${API_URL}/api/jobs/`,
    {
      cache: "no-store",
    }
  );

  return handleResponse(response);
}

export async function getJob(jobId: string) {
  const response = await fetch(
    `${API_URL}/api/jobs/${jobId}`,
    {
      cache: "no-store",
    }
  );

  return handleResponse(response);
}

export async function getScreeningResult(
  candidateId: string,
  jobId: string
) {
  const params = new URLSearchParams({
    candidate_id: candidateId,
    job_id: jobId,
  });

  const response = await fetch(
    `${API_URL}/api/screening/result?${params.toString()}`,
    {
      cache: "no-store",
    }
  );

  return handleResponse(response);
}

export async function getCandidateScreeningHistory(
  candidateId: string
) {
  const response = await fetch(
    `${API_URL}/api/screening/candidate/${candidateId}/history`,
    {
      cache: "no-store",
    }
  );

  return handleResponse(response);
}
export async function deleteJob(jobId: string) {
  const response = await fetch(
    `${API_URL}/api/jobs/${jobId}`,
    {
      method: "DELETE",
    }
  );

  return handleResponse(response);
}

export async function getDashboardStats() {

  const response = await fetch(
    `${API_URL}/api/dashboard/stats`,
    {
      cache: "no-store",
    }
  );

  return handleResponse(response);
}

export async function searchGlobal(
  query: string
) {
  const response = await fetch(
    `${API_URL}/api/search?q=${encodeURIComponent(query)}`,
    {
      cache: "no-store",
    }
  );

  return handleResponse(response);
}

export async function deleteCandidate(
  candidateId: string
) {

  const response = await fetch(
    `${API_URL}/api/resumes/candidates/${candidateId}`,
    {
      method: "DELETE",
    }
  );

  return handleResponse(response);
}

export function getCandidateResumeUrl(
  candidateId: string
) {

  return `${API_URL}/api/resumes/candidates/${candidateId}/resume`;
}