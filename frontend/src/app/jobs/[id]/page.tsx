"use client";

import {
  ArrowLeft,
  ArrowUpRight,
  BriefcaseBusiness,
  CheckCircle2,
  Clock,
  Loader2,
  Sparkles,
  Users,
} from "lucide-react";

import Link from "next/link";
import { useEffect, useState } from "react";

import {
  getCandidates,
  getJobRankings,
  screenCandidate,
} from "@/lib/api";

import type {
  Candidate,
  Ranking,
} from "@/lib/types";


interface JobData {
  id: string;
  title: string;
  description: string;
  required_skills: string[];
  preferred_skills: string[];
  responsibilities: string[];
  minimum_experience_years?: number | null;
  education_requirements: string[];
}


export default function JobDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {

  const [jobId, setJobId] =
    useState<string>("");

  const [job, setJob] =
    useState<JobData | null>(null);

  const [candidates, setCandidates] =
    useState<Candidate[]>([]);

  const [rankings, setRankings] =
    useState<Ranking[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [screeningCandidateId, setScreeningCandidateId] =
    useState<string | null>(null);

  const [error, setError] =
    useState("");


  useEffect(() => {

    const loadPage = async () => {

      try {

        const resolvedParams = await params;

        setJobId(resolvedParams.id);

        /*
         * For now the job itself is fetched from
         * the existing API we'll add below.
         */

        const jobResponse =
          await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/api/jobs/${resolvedParams.id}`,
            {
              cache: "no-store",
            }
          );

        const jobData =
          await jobResponse.json();

        if (!jobResponse.ok) {
          throw new Error(
            jobData.detail ||
            "Failed to load job."
          );
        }

        setJob(jobData.job);


        const candidateResponse =
          await getCandidates();

        setCandidates(
          candidateResponse.candidates || []
        );


        const rankingResponse =
          await getJobRankings(
            resolvedParams.id
          );

        setRankings(
          rankingResponse.rankings || []
        );

      } catch (err) {

        setError(
          err instanceof Error
            ? err.message
            : "Failed to load job."
        );

      } finally {

        setLoading(false);

      }

    };

    loadPage();

  }, [params]);


  const handleScreen = async (
    candidateId: string
  ) => {

    try {

      setScreeningCandidateId(candidateId);
      setError("");

      await screenCandidate(
        candidateId,
        jobId
      );

      const rankingResponse =
        await getJobRankings(jobId);

      setRankings(
        rankingResponse.rankings || []
      );

    } catch (err) {

      setError(
        err instanceof Error
          ? err.message
          : "Failed to screen candidate."
      );

    } finally {

      setScreeningCandidateId(null);

    }
  };


  const getRankingForCandidate = (
    candidateId: string
  ) => {

    return rankings.find(
      (ranking) =>
        ranking.candidate_id === candidateId
    );

  };


  if (loading) {

    return (
      <div className="flex min-h-[70vh] items-center justify-center">

        <div className="flex items-center gap-3 text-sm text-zinc-500">

          <Loader2
            size={18}
            className="animate-spin"
          />

          Loading job...

        </div>

      </div>
    );

  }


  if (error && !job) {

    return (
      <div className="p-8">

        <Link
          href="/jobs"
          className="mb-6 inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-white"
        >

          <ArrowLeft size={16} />

          Back to Jobs

        </Link>

        <div className="rounded-xl border border-red-900/50 bg-red-950/20 p-6 text-sm text-red-300">

          {error}

        </div>

      </div>
    );

  }


  if (!job) {
    return null;
  }


  return (
    <div className="p-8">

      {/* Back */}

      <Link
        href="/jobs"
        className="mb-6 inline-flex items-center gap-2 text-sm text-zinc-500 transition hover:text-white"
      >

        <ArrowLeft size={16} />

        Back to Jobs

      </Link>


      {/* Job Header */}

      <div className="rounded-xl border border-zinc-800 bg-zinc-900/50">

        <div className="border-b border-zinc-800 p-6">

          <div className="flex flex-col justify-between gap-5 md:flex-row md:items-start">

            <div>

              <div className="mb-3 flex items-center gap-2 text-xs text-zinc-500">

                <BriefcaseBusiness size={15} />

                Job Position

              </div>

              <h1 className="text-3xl font-semibold">
                {job.title}
              </h1>

              <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-zinc-500">

                <span className="flex items-center gap-2">

                  <Clock size={15} />

                  {job.minimum_experience_years ?? 0}+
                  years experience

                </span>

                <span className="flex items-center gap-2">

                  <Users size={15} />

                  {candidates.length} candidates

                </span>

                <span className="flex items-center gap-2">

                  <CheckCircle2 size={15} />

                  {rankings.length} screened

                </span>

              </div>

            </div>


            <div className="rounded-lg border border-zinc-800 bg-zinc-950 px-4 py-3">

              <p className="text-xs text-zinc-600">
                Job ID
              </p>

              <p className="mt-1 font-mono text-xs text-zinc-400">
                {jobId}
              </p>

            </div>

          </div>

        </div>


        {/* Requirements */}

        <div className="grid gap-6 border-b border-zinc-800 p-6 lg:grid-cols-3">

          <SkillGroup
            title="Required Skills"
            skills={job.required_skills}
            required
          />

          <SkillGroup
            title="Preferred Skills"
            skills={job.preferred_skills}
          />

          <div>

            <p className="mb-3 text-xs uppercase tracking-wider text-zinc-500">
              Education
            </p>

            <div className="space-y-2">

              {job.education_requirements?.map(
                (education, index) => (

                  <div
                    key={index}
                    className="rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-xs text-zinc-400"
                  >
                    {education}
                  </div>

                )
              )}

            </div>

          </div>

        </div>


        {/* Error */}

        {error && (

          <div className="border-b border-red-900/50 bg-red-950/20 px-6 py-4 text-sm text-red-300">

            {error}

          </div>

        )}


        {/* Candidates */}

        <div>

          <div className="flex items-center justify-between border-b border-zinc-800 p-6">

            <div>

              <h2 className="font-medium">
                Candidates
              </h2>

              <p className="mt-1 text-xs text-zinc-500">
                Screen candidates against this position.
              </p>

            </div>

            <span className="rounded-md border border-zinc-800 bg-zinc-950 px-3 py-1.5 text-xs text-zinc-400">

              {rankings.length} screened

            </span>

          </div>


          {candidates.length === 0 ? (

            <div className="flex min-h-64 flex-col items-center justify-center p-6 text-center">

              <Users
                size={25}
                className="mb-4 text-zinc-600"
              />

              <h3 className="text-sm font-medium">
                No candidates yet
              </h3>

              <p className="mt-2 text-xs text-zinc-600">
                Upload a resume to add your first candidate.
              </p>

              <Link
                href="/upload"
                className="mt-5 inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2.5 text-sm font-medium text-black"
              >

                Upload Resume

                <ArrowUpRight size={15} />

              </Link>

            </div>

          ) : (

            <div className="divide-y divide-zinc-800">

              {candidates.map((candidate) => {

                const ranking =
                  getRankingForCandidate(
                    candidate.id || ""
                  );

                const isScreening =
                  screeningCandidateId === candidate.id;

                return (

                  <div
                    key={candidate.id}
                    className="flex flex-col gap-5 p-6 transition hover:bg-zinc-900/50 lg:flex-row lg:items-center lg:justify-between"
                  >

                    {/* Candidate */}

                    <div className="flex items-center gap-4">

                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-zinc-800 bg-zinc-900 text-sm font-medium text-zinc-300">

                        {candidate.name
                          ?.split(" ")
                          .map((part) => part[0])
                          .slice(0, 2)
                          .join("")
                          .toUpperCase()}

                      </div>


                      <div>

                        <h3 className="text-sm font-medium">
                          {candidate.name}
                        </h3>

                        <p className="mt-1 text-xs text-zinc-500">
                          {candidate.email || "No email"}
                        </p>

                        <p className="mt-1 text-xs text-zinc-600">
                          {candidate.total_experience_years ?? 0}
                          {" "}
                          years experience
                        </p>

                      </div>

                    </div>


                    {/* Skills */}

                    <div className="hidden max-w-md flex-1 lg:block">

                      <div className="flex flex-wrap gap-1.5">

                        {candidate.skills
                          ?.slice(0, 5)
                          .map((skill) => (

                            <span
                              key={skill}
                              className="rounded-md border border-zinc-800 bg-zinc-950 px-2 py-1 text-[11px] text-zinc-500"
                            >
                              {skill}
                            </span>

                          ))}

                      </div>

                    </div>


                    {/* Score */}

                    <div className="flex items-center gap-6">

                      {ranking ? (

                        <div className="text-right">

                          <p className="text-xl font-semibold">
                            {ranking.score}
                          </p>

                          <p className="mt-1 text-xs text-zinc-500">
                            {ranking.recommendation}
                          </p>

                        </div>

                      ) : (

                        <div className="text-right">

                          <p className="text-sm text-zinc-600">
                            Not screened
                          </p>

                        </div>

                      )}


                      {/* Action */}

                      {ranking ? (

                        <Link
                          href={`/candidates/${candidate.id}?job=${jobId}`}
                          className="flex items-center gap-2 rounded-lg border border-zinc-800 bg-zinc-950 px-4 py-2.5 text-xs font-medium text-zinc-300 transition hover:border-zinc-600 hover:text-white"
                        >

                          View Result

                          <ArrowUpRight size={14} />

                        </Link>

                      ) : (

                        <button
                          onClick={() =>
                            handleScreen(
                              candidate.id || ""
                            )
                          }
                          disabled={isScreening}
                          className="flex items-center gap-2 rounded-lg bg-white px-4 py-2.5 text-xs font-medium text-black transition hover:bg-zinc-200 disabled:cursor-not-allowed disabled:opacity-50"
                        >

                          {isScreening ? (

                            <>
                              <Loader2
                                size={14}
                                className="animate-spin"
                              />

                              Screening...
                            </>

                          ) : (

                            <>
                              <Sparkles size={14} />

                              Screen Candidate
                            </>

                          )}

                        </button>

                      )}

                    </div>

                  </div>

                );

              })}

            </div>

          )}

        </div>

      </div>


      {/* Rankings */}

      {rankings.length > 0 && (

        <div className="mt-6 rounded-xl border border-zinc-800 bg-zinc-900/50">

          <div className="border-b border-zinc-800 p-6">

            <h2 className="font-medium">
              Candidate Rankings
            </h2>

            <p className="mt-1 text-xs text-zinc-500">
              Candidates ranked by AI match score.
            </p>

          </div>


          <div className="divide-y divide-zinc-800">

            {rankings.map((ranking) => (

              <Link
                key={ranking.candidate_id}
                href={`/candidates/${ranking.candidate_id}?job=${jobId}`}
                className="flex items-center gap-5 p-5 transition hover:bg-zinc-900"
              >

                <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-800 bg-zinc-950 text-sm font-semibold">

                  #{ranking.rank}

                </div>


                <div className="flex-1">

                  <p className="text-sm font-medium">
                    {ranking.candidate?.name}
                  </p>

                  <p className="mt-1 text-xs text-zinc-500">
                    {ranking.recommendation}
                  </p>

                </div>


                <div className="text-right">

                  <p className="text-xl font-semibold">
                    {ranking.score}
                  </p>

                  <p className="text-[11px] text-zinc-600">
                    / 10
                  </p>

                </div>


                <ArrowUpRight
                  size={16}
                  className="text-zinc-600"
                />

              </Link>

            ))}

          </div>

        </div>

      )}

    </div>
  );
}


/* ------------------------------------------
   Skill Group
------------------------------------------ */

function SkillGroup({
  title,
  skills,
  required = false,
}: {
  title: string;
  skills: string[];
  required?: boolean;
}) {

  return (
    <div>

      <p className="mb-3 text-xs uppercase tracking-wider text-zinc-500">
        {title}
      </p>

      <div className="flex flex-wrap gap-2">

        {skills?.length ? (

          skills.map((skill) => (

            <span
              key={skill}
              className={`rounded-md border px-2.5 py-1.5 text-xs ${
                required
                  ? "border-zinc-700 bg-zinc-900 text-zinc-300"
                  : "border-zinc-800 bg-zinc-950 text-zinc-500"
              }`}
            >
              {skill}
            </span>

          ))

        ) : (

          <span className="text-xs text-zinc-600">
            None specified
          </span>

        )}

      </div>

    </div>
  );
}