"use client";

import {
  BriefcaseBusiness,
  Sparkles,
  Loader2,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  FileText,
  Users,
  ArrowUpRight,
  Trash2
} from "lucide-react";

import { useState, useEffect } from "react";

import {
  createJob,
  getJobs,
  deleteJob,
} from "@/lib/api";

import type { Job } from "@/lib/types";

import Link from "next/link";

export default function JobsPage() {

    const [jobs, setJobs] = useState<Job[]>([]);

const [loadingJobs, setLoadingJobs] =
  useState(true);

  const [deletingJobId, setDeletingJobId] =
    useState<string | null>(null);

  const [description, setDescription] =
    useState("");

  const [job, setJob] =
    useState<Job | null>(null);

  const [jobId, setJobId] =
    useState<string | null>(null);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

    useEffect(() => {

  const loadJobs = async () => {

    try {

      setLoadingJobs(true);

      const response = await getJobs();

      setJobs(response.jobs || []);

    } catch (error) {

      console.error(
        "Failed to load jobs:",
        error
      );

    } finally {

      setLoadingJobs(false);

    }

  };

  loadJobs();

}, []);


  const handleDeleteJob = async (
    event: React.MouseEvent<HTMLButtonElement>,
    id: string
  ) => {

    event.preventDefault();
    event.stopPropagation();

    const confirmed = window.confirm(
      "Are you sure you want to delete this job? This action cannot be undone."
    );

    if (!confirmed) {
      return;
    }

    try {

      setDeletingJobId(id);

      await deleteJob(id);

      setJobs((previousJobs) =>
        previousJobs.filter(
          (existingJob) =>
            existingJob.id !== id
        )
      );

      if (jobId === id) {
        setJob(null);
        setJobId(null);
      }

    } catch (error) {

      console.error(
        "Failed to delete job:",
        error
      );

      setError(
        error instanceof Error
          ? error.message
          : "Failed to delete job."
      );

    } finally {

      setDeletingJobId(null);

    }
  };


  const handleCreateJob = async () => {

    if (!description.trim()) {
      setError("Please enter a job description.");
      return;
    }

    try {

      setLoading(true);
      setError("");
      setJob(null);
      setJobId(null);

      const response = await createJob(description);

setJob(response.job);
setJobId(response.job_id);

setJobs((previousJobs) => [
  response.job,
  ...previousJobs,
]);

    } catch (err) {

      setError(
        err instanceof Error
          ? err.message
          : "Failed to create job."
      );

    } finally {

      setLoading(false);

    }
  };


  return (
    <div className="p-8">

      {/* Header */}

      <div className="mb-8">

        <p className="mb-2 flex items-center gap-2 text-sm text-zinc-500">

          <BriefcaseBusiness size={15} />

          Job Management

        </p>

        <h1 className="text-3xl font-semibold tracking-tight">
          Jobs
        </h1>

        <p className="mt-2 max-w-2xl text-sm text-zinc-500">
          Create a job description and let AI extract the
          requirements automatically.
        </p>

      </div>

      {/* Existing Jobs */}

<div className="mb-8">

  <div className="mb-4 flex items-center justify-between">

    <div>

      <p className="text-xs uppercase tracking-wider text-zinc-500">
        Recruitment
      </p>

      <h2 className="mt-1 text-xl font-semibold">
        Your Jobs
      </h2>

    </div>

    <span className="rounded-md border border-zinc-800 bg-zinc-950 px-3 py-1.5 text-xs text-zinc-500">
      {jobs.length} {jobs.length === 1 ? "job" : "jobs"}
    </span>

  </div>


  {loadingJobs ? (

    <div className="flex min-h-32 items-center justify-center rounded-xl border border-zinc-800 bg-zinc-900/50">

      <div className="flex items-center gap-3 text-sm text-zinc-500">

        <Loader2
          size={17}
          className="animate-spin"
        />

        Loading jobs...

      </div>

    </div>

  ) : jobs.length === 0 ? (

    <div className="rounded-xl border border-dashed border-zinc-800 bg-zinc-900/30 p-10 text-center">

      <BriefcaseBusiness
        size={28}
        className="mx-auto mb-4 text-zinc-600"
      />

      <h3 className="text-sm font-medium">
        No jobs created yet
      </h3>

      <p className="mt-2 text-xs text-zinc-600">
        Create your first job below to start screening candidates.
      </p>

    </div>

  ) : (

    <div className="grid gap-4 lg:grid-cols-2">

      {jobs.map((existingJob) => (

        <Link
          key={existingJob.id}
          href={`/jobs/${existingJob.id}`}
          className="group rounded-xl border border-zinc-800 bg-zinc-900/50 p-5 transition hover:border-zinc-600 hover:bg-zinc-900"
        >

          <div className="flex items-start justify-between gap-4">

            <div className="flex items-start gap-4">

              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-zinc-800 bg-zinc-950">

                <BriefcaseBusiness
                  size={17}
                  className="text-zinc-400"
                />

              </div>

              <div>

                <h3 className="font-medium group-hover:text-white">
                  {existingJob.title}
                </h3>

                <p className="mt-1 text-xs text-zinc-500">
                  {existingJob.minimum_experience_years ?? 0}+
                  {" "}
                  years experience
                </p>

              </div>

            </div>


            <div className="flex items-center gap-2">

              <button
                type="button"
                onClick={(event) =>
                  handleDeleteJob(
                    event,
                    existingJob.id
                  )
                }
                disabled={
                  deletingJobId === existingJob.id
                }
                aria-label={`Delete ${existingJob.title}`}
                className="flex h-8 w-8 items-center justify-center rounded-md border border-zinc-800 bg-zinc-950 text-zinc-600 transition hover:border-red-900/60 hover:bg-red-950/20 hover:text-red-400 disabled:cursor-not-allowed disabled:opacity-50"
              >

                {deletingJobId === existingJob.id ? (

                  <Loader2
                    size={15}
                    className="animate-spin"
                  />

                ) : (

                  <Trash2 size={15} />

                )}

              </button>

              <ArrowUpRight
                size={17}
                className="text-zinc-600 transition group-hover:text-white"
              />

            </div>

          </div>


          {/* Skills */}

          <div className="mt-5 flex flex-wrap gap-2">

            {existingJob.required_skills
              ?.slice(0, 6)
              .map((skill) => (

                <span
                  key={skill}
                  className="rounded-md border border-zinc-800 bg-zinc-950 px-2.5 py-1.5 text-xs text-zinc-400"
                >
                  {skill}
                </span>

              ))}

          </div>


          {/* Footer */}

          <div className="mt-5 flex items-center justify-between border-t border-zinc-800 pt-4">

            <span className="text-xs text-zinc-600">
              {existingJob.responsibilities?.length || 0}
              {" "}
              responsibilities
            </span>

            <span className="text-xs text-zinc-500">
              Open job →
            </span>

          </div>

        </Link>

      ))}

    </div>

  )}

</div>


      <div className="grid gap-6 xl:grid-cols-5">

        {/* JD Input */}

        <div className="xl:col-span-3">

          <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">

            <div className="mb-5">

              <h2 className="font-medium">
                Create a Job
              </h2>

              <p className="mt-1 text-xs text-zinc-500">
                Paste the complete job description below.
              </p>

            </div>


            <textarea
              value={description}
              onChange={(event) => {
                setDescription(event.target.value);
                setError("");
              }}
              placeholder={`Example:

We are looking for a Full Stack Developer to join our engineering team.

Requirements:
• 1+ years of experience
• React.js
• JavaScript
• Node.js
• Express.js
• MongoDB
• REST APIs

Preferred:
• TypeScript
• Docker
• AWS

Responsibilities:
• Build responsive web applications
• Develop backend APIs
• Work with frontend and backend teams`}
              className="min-h-[360px] w-full resize-none rounded-xl border border-zinc-800 bg-zinc-950 p-4 text-sm leading-6 text-white outline-none transition placeholder:text-zinc-700 focus:border-zinc-600"
            />


            <div className="mt-4 flex items-center justify-between">

              <p className="text-xs text-zinc-600">
                {description.length} characters
              </p>

              <button
                onClick={handleCreateJob}
                disabled={loading}
                className="flex items-center gap-2 rounded-lg bg-white px-5 py-2.5 text-sm font-medium text-black transition hover:bg-zinc-200 disabled:cursor-not-allowed disabled:opacity-50"
              >

                {loading ? (
                  <>
                    <Loader2
                      size={16}
                      className="animate-spin"
                    />

                    Analyzing JD...
                  </>
                ) : (
                  <>
                    <Sparkles size={16} />

                    Analyze Job
                  </>
                )}

              </button>

            </div>


            {/* Error */}

            {error && (

              <div className="mt-4 flex items-start gap-3 rounded-lg border border-red-900/50 bg-red-950/20 p-4">

                <AlertCircle
                  size={17}
                  className="mt-0.5 shrink-0 text-red-400"
                />

                <p className="text-sm text-red-300">
                  {error}
                </p>

              </div>

            )}

          </div>

        </div>


        {/* Info Panel */}

        <div className="xl:col-span-2">

          <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">

            <div className="mb-6">

              <p className="text-xs uppercase tracking-wider text-zinc-500">
                AI processing
              </p>

              <h2 className="mt-2 text-lg font-semibold">
                Automatically extract requirements
              </h2>

            </div>


            <div className="space-y-5">

              <JobStep
                number="01"
                title="Paste JD"
                description="Provide the complete job description."
              />

              <JobStep
                number="02"
                title="AI Analysis"
                description="Gemini identifies the role, skills and requirements."
              />

              <JobStep
                number="03"
                title="Structure"
                description="Requirements are converted into structured job data."
              />

              <JobStep
                number="04"
                title="Save"
                description="The job is stored in Supabase and ready for screening."
              />

            </div>

          </div>


          {/* Quick info */}

          <div className="mt-6 rounded-xl border border-zinc-800 bg-zinc-900/50 p-5">

            <div className="flex items-start gap-3">

              <FileText
                size={18}
                className="mt-0.5 text-zinc-400"
              />

              <div>

                <p className="text-sm font-medium">
                  What AI extracts
                </p>

                <p className="mt-2 text-xs leading-5 text-zinc-500">
                  Job title, required skills, preferred skills,
                  responsibilities, experience requirements and
                  education requirements.
                </p>

              </div>

            </div>

          </div>

        </div>

      </div>


      {/* Created Job */}

      {job && (

        <div className="mt-6 rounded-xl border border-zinc-800 bg-zinc-900/50">

          {/* Success header */}

          <div className="flex items-center justify-between border-b border-zinc-800 p-6">

            <div>

              <div className="flex items-center gap-2">

                <CheckCircle2
                  size={18}
                  className="text-green-400"
                />

                <h2 className="font-medium">
                  Job created successfully
                </h2>

              </div>

              <p className="mt-1 text-xs text-zinc-500">
                AI extracted the job requirements successfully.
              </p>

            </div>


            {jobId && (

              <div className="rounded-md border border-zinc-800 bg-zinc-950 px-3 py-1.5">

                <span className="text-xs text-zinc-600">
                  Job ID
                </span>

                <span className="ml-2 font-mono text-xs text-zinc-400">
                  {jobId.slice(0, 8)}...
                </span>

              </div>

            )}

          </div>


          <div className="grid gap-8 p-6 lg:grid-cols-3">

            {/* Job title */}

            <div>

              <p className="text-xs uppercase tracking-wider text-zinc-500">
                Position
              </p>

              <h3 className="mt-3 text-xl font-semibold">
                {job.title || "Untitled Position"}
              </h3>

              {job.minimum_experience_years !== null &&
                job.minimum_experience_years !== undefined && (

                <p className="mt-2 text-sm text-zinc-500">
                  {job.minimum_experience_years}+ years experience
                </p>

              )}

            </div>


            {/* Required skills */}

            <div>

              <p className="text-xs uppercase tracking-wider text-zinc-500">
                Required Skills
              </p>

              <div className="mt-3 flex flex-wrap gap-2">

                {job.required_skills?.length ? (

                  job.required_skills.map((skill) => (

                    <span
                      key={skill}
                      className="rounded-md border border-zinc-700 bg-zinc-900 px-2.5 py-1.5 text-xs text-zinc-300"
                    >
                      {skill}
                    </span>

                  ))

                ) : (

                  <span className="text-sm text-zinc-600">
                    No required skills extracted
                  </span>

                )}

              </div>

            </div>


            {/* Preferred skills */}

            <div>

              <p className="text-xs uppercase tracking-wider text-zinc-500">
                Preferred Skills
              </p>

              <div className="mt-3 flex flex-wrap gap-2">

                {job.preferred_skills?.length ? (

                  job.preferred_skills.map((skill) => (

                    <span
                      key={skill}
                      className="rounded-md border border-zinc-800 bg-zinc-950 px-2.5 py-1.5 text-xs text-zinc-500"
                    >
                      {skill}
                    </span>

                  ))

                ) : (

                  <span className="text-sm text-zinc-600">
                    None specified
                  </span>

                )}

              </div>

            </div>

          </div>


          {/* Responsibilities */}

          {job.responsibilities?.length > 0 && (

            <div className="border-t border-zinc-800 p-6">

              <p className="mb-4 text-xs uppercase tracking-wider text-zinc-500">
                Responsibilities
              </p>

              <div className="grid gap-3 md:grid-cols-2">

                {job.responsibilities.map(
                  (responsibility, index) => (

                    <div
                      key={index}
                      className="flex gap-3 rounded-lg border border-zinc-800 bg-zinc-950 p-4"
                    >

                      <span className="text-xs text-zinc-600">
                        {String(index + 1).padStart(2, "0")}
                      </span>

                      <p className="text-sm leading-5 text-zinc-400">
                        {responsibility}
                      </p>

                    </div>

                  )
                )}

              </div>

            </div>

          )}


          {/* Education */}

          {job.education_requirements?.length > 0 && (

            <div className="border-t border-zinc-800 p-6">

              <p className="mb-4 text-xs uppercase tracking-wider text-zinc-500">
                Education Requirements
              </p>

              <div className="space-y-2">

                {job.education_requirements.map(
                  (education, index) => (

                    <div
                      key={index}
                      className="rounded-lg border border-zinc-800 bg-zinc-950 p-4 text-sm text-zinc-400"
                    >
                      {education}
                    </div>

                  )
                )}

              </div>

            </div>

          )}


          {/* Continue */}

          <div className="border-t border-zinc-800 p-6">

            <Link
  href={`/jobs/${jobId}`}
  className="flex items-center gap-2 rounded-lg bg-white px-5 py-2.5 text-sm font-medium text-black transition hover:bg-zinc-200"
>
  Continue to Candidates

  <ArrowRight size={16} />
</Link>

          </div>

        </div>

      )}

    </div>
  );
}


/* ------------------------------------------
   Job Step
------------------------------------------ */

function JobStep({
  number,
  title,
  description,
}: {
  number: string;
  title: string;
  description: string;
}) {

  return (
    <div className="flex gap-4">

      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-zinc-800 bg-zinc-950 text-xs font-medium text-zinc-400">
        {number}
      </div>

      <div>

        <h3 className="text-sm font-medium">
          {title}
        </h3>

        <p className="mt-1 text-xs leading-5 text-zinc-500">
          {description}
        </p>

      </div>

    </div>
  );
}