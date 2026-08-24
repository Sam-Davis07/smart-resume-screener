"use client";

import {
  AlertTriangle,
  ArrowLeft,
  CheckCircle2,
  Loader2,
  Sparkles,
  User,
  XCircle,
} from "lucide-react";

import Link from "next/link";
import { use, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

import { getScreeningResult } from "@/lib/api";

import type {
  Candidate,
  Screening,
} from "@/lib/types";


interface ScreeningResponse {
  success: boolean;
  screening: Screening;
  candidate: Candidate;
}


export default function CandidateAssessmentPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {

  const { id: candidateId } = use(params);

  const searchParams = useSearchParams();

  const jobId = searchParams.get("job");


  const [candidate, setCandidate] =
    useState<Candidate | null>(null);

  const [screening, setScreening] =
    useState<Screening | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");


  useEffect(() => {

    const loadAssessment = async () => {

      if (!jobId) {

        setError(
          "Job ID is missing from the URL."
        );

        setLoading(false);

        return;
      }


      try {

        setLoading(true);
        setError("");


        const response: ScreeningResponse =
          await getScreeningResult(
            candidateId,
            jobId
          );


        setCandidate(
          response.candidate
        );

        setScreening(
          response.screening
        );


      } catch (error) {

        console.error(
          "Failed to load candidate assessment:",
          error
        );

        setError(
          error instanceof Error
            ? error.message
            : "Failed to load candidate assessment."
        );

      } finally {

        setLoading(false);

      }

    };


    loadAssessment();

  }, [candidateId, jobId]);


  /* --------------------------------
     Loading
  -------------------------------- */

  if (loading) {

    return (
      <div className="flex min-h-[70vh] items-center justify-center">

        <div className="flex items-center gap-3 text-sm text-zinc-500">

          <Loader2
            size={18}
            className="animate-spin"
          />

          Loading candidate assessment...

        </div>

      </div>
    );

  }


  /* --------------------------------
     Error
  -------------------------------- */

  if (error || !candidate || !screening) {

    return (
      <div className="p-8">

        <Link
          href={
            jobId
              ? `/jobs/${jobId}`
              : "/jobs"
          }
          className="mb-6 inline-flex items-center gap-2 text-sm text-zinc-500 transition hover:text-white"
        >

          <ArrowLeft size={16} />

          Back

        </Link>


        <div className="rounded-xl border border-red-900/50 bg-red-950/20 p-6 text-sm text-red-300">

          {error ||
            "Candidate assessment could not be found."}

        </div>

      </div>
    );

  }


  return (
    <div className="p-8">

      {/* --------------------------------
          Back
      -------------------------------- */}

      <Link
  href="/candidates"
  className="mb-6 inline-flex items-center gap-2 text-sm text-zinc-500 transition hover:text-white"
>
  <ArrowLeft size={16} />

  Back to Candidates
</Link>


      {/* --------------------------------
          Candidate Header
      -------------------------------- */}

      <div className="rounded-xl border border-zinc-800 bg-zinc-900/50">

        <div className="border-b border-zinc-800 p-6">

          <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-center">


            {/* Candidate information */}

            <div className="flex items-center gap-4">

              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-zinc-800 bg-zinc-950 text-lg font-medium">

                {getInitials(
                  candidate.name
                )}

              </div>


              <div>

                <p className="text-xs uppercase tracking-wider text-zinc-500">
                  Candidate Assessment
                </p>

                <h1 className="mt-1 text-2xl font-semibold">
                  {candidate.name}
                </h1>

                <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-zinc-500">

                  {candidate.email && (
                    <span>
                      {candidate.email}
                    </span>
                  )}

                  {candidate.phone && (
                    <span>
                      {candidate.phone}
                    </span>
                  )}

                </div>

              </div>

            </div>


            {/* Score */}

            <ScoreCard
              score={screening.score}
              recommendation={
                screening.recommendation
              }
            />

          </div>

        </div>


        {/* --------------------------------
            Candidate Summary
        -------------------------------- */}

        <div className="grid gap-4 border-b border-zinc-800 p-6 md:grid-cols-3">

          <SummaryCard
            title="Experience"
            value={`${candidate.total_experience_years ?? 0} years`}
          />

          <SummaryCard
            title="Skills"
            value={`${candidate.skills?.length ?? 0}`}
          />

          <SummaryCard
            title="AI Match Score"
            value={`${screening.score} / 10`}
          />

        </div>


        {/* --------------------------------
            Skills Analysis
        -------------------------------- */}

        <div className="border-b border-zinc-800 p-6">

          <div className="mb-6">

            <div className="flex items-center gap-2">

              <Sparkles
                size={17}
                className="text-zinc-400"
              />

              <h2 className="font-medium">
                Skills Analysis
              </h2>

            </div>

            <p className="mt-1 text-xs text-zinc-500">
              AI comparison between the candidate
              and the job requirements.
            </p>

          </div>


          <div className="grid gap-6 lg:grid-cols-3">

            <SkillSection
              title="Matched Required Skills"
              skills={
                screening.matched_skills
              }
              variant="success"
            />


            <SkillSection
              title="Missing Required Skills"
              skills={
                screening.missing_required_skills
              }
              variant="danger"
            />


            <SkillSection
              title="Matched Preferred Skills"
              skills={
                screening.matched_preferred_skills
              }
              variant="neutral"
            />

          </div>

        </div>


        {/* --------------------------------
            Strengths / Concerns
        -------------------------------- */}

        <div className="grid gap-6 border-b border-zinc-800 p-6 lg:grid-cols-2">

          <InsightSection
            title="Strengths"
            items={
              screening.strengths
            }
            icon={
              <CheckCircle2
                size={17}
              />
            }
            variant="success"
          />


          <InsightSection
            title="Concerns"
            items={
              screening.concerns
            }
            icon={
              <AlertTriangle
                size={17}
              />
            }
            variant="warning"
          />

        </div>


        {/* --------------------------------
            Candidate Skills
        -------------------------------- */}

        <div className="border-b border-zinc-800 p-6">

          <h2 className="mb-4 font-medium">
            Candidate Skills
          </h2>

          <div className="flex flex-wrap gap-2">

            {candidate.skills?.length ? (

              candidate.skills.map(
                (skill) => (

                  <span
                    key={skill}
                    className="rounded-md border border-zinc-800 bg-zinc-950 px-3 py-2 text-xs text-zinc-400"
                  >
                    {skill}
                  </span>

                )
              )

            ) : (

              <p className="text-xs text-zinc-600">
                No skills found.
              </p>

            )}

          </div>

        </div>


        {/* --------------------------------
            AI Justification
        -------------------------------- */}

        <div className="border-b border-zinc-800 p-6">

          <div className="mb-4 flex items-center gap-2">

            <Sparkles
              size={17}
              className="text-zinc-400"
            />

            <h2 className="font-medium">
              AI Justification
            </h2>

          </div>


          <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-5">

            <p className="text-sm leading-7 text-zinc-400">

              {screening.justification ||
                "No justification was provided."}

            </p>

          </div>

        </div>


        {/* --------------------------------
            Footer
        -------------------------------- */}

        <div className="p-6">

          <Link
            href={
              jobId
                ? `/jobs/${jobId}`
                : "/jobs"
            }
            className="inline-flex items-center gap-2 rounded-lg bg-white px-5 py-2.5 text-sm font-medium text-black transition hover:bg-zinc-200"
          >

            <ArrowLeft size={15} />

            Back to Candidates

          </Link>

        </div>

      </div>

    </div>
  );
}


/* =========================================
   SCORE CARD
========================================= */

function ScoreCard({
  score,
  recommendation,
}: {
  score: number;
  recommendation: string;
}) {

  const scoreClass =
    score >= 8
      ? "text-green-400"
      : score >= 6
        ? "text-yellow-400"
        : "text-red-400";


  return (
    <div className="flex items-center gap-5 rounded-xl border border-zinc-800 bg-zinc-950 px-6 py-4">

      <div className="text-right">

        <p
          className={`text-4xl font-semibold ${scoreClass}`}
        >
          {score}
        </p>

        <p className="text-xs text-zinc-600">
          / 10
        </p>

      </div>


      <div className="h-12 w-px bg-zinc-800" />


      <div>

        <p className="text-[10px] uppercase tracking-wider text-zinc-600">
          Recommendation
        </p>

        <p className="mt-1 text-sm font-medium text-zinc-300">
          {recommendation}
        </p>

      </div>

    </div>
  );
}


/* =========================================
   SUMMARY CARD
========================================= */

function SummaryCard({
  title,
  value,
}: {
  title: string;
  value: string;
}) {

  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-5">

      <p className="text-xs uppercase tracking-wider text-zinc-600">
        {title}
      </p>

      <p className="mt-2 text-xl font-semibold">
        {value}
      </p>

    </div>
  );
}


/* =========================================
   SKILL SECTION
========================================= */

function SkillSection({
  title,
  skills,
  variant,
}: {
  title: string;
  skills: string[];
  variant:
    | "success"
    | "danger"
    | "neutral";
}) {

  return (
    <div>

      <h3 className="mb-3 text-xs uppercase tracking-wider text-zinc-500">
        {title}
      </h3>


      {skills?.length ? (

        <div className="flex flex-wrap gap-2">

          {skills.map(
            (skill) => {

              const Icon =
                variant === "success"
                  ? CheckCircle2
                  : variant === "danger"
                    ? XCircle
                    : Sparkles;


              return (
                <span
                  key={skill}
                  className="flex items-center gap-2 rounded-md border border-zinc-800 bg-zinc-950 px-3 py-2 text-xs text-zinc-400"
                >

                  <Icon
                    size={13}
                    className={
                      variant === "success"
                        ? "text-green-400"
                        : variant === "danger"
                          ? "text-red-400"
                          : "text-zinc-500"
                    }
                  />

                  {skill}

                </span>
              );

            }
          )}

        </div>

      ) : (

        <div className="rounded-lg border border-dashed border-zinc-800 bg-zinc-950 p-4 text-xs text-zinc-600">
          None
        </div>

      )}

    </div>
  );
}


/* =========================================
   INSIGHT SECTION
========================================= */

function InsightSection({
  title,
  items,
  icon,
  variant,
}: {
  title: string;
  items: string[];
  icon: React.ReactNode;
  variant:
    | "success"
    | "warning";
}) {

  return (
    <div>

      <div className="mb-4 flex items-center gap-2 text-zinc-400">

        {icon}

        <h2 className="text-xs uppercase tracking-wider">
          {title}
        </h2>

      </div>


      {items?.length ? (

        <div className="space-y-2">

          {items.map(
            (item, index) => (

              <div
                key={index}
                className="rounded-lg border border-zinc-800 bg-zinc-950 p-4 text-sm leading-6 text-zinc-400"
              >
                {item}
              </div>

            )
          )}

        </div>

      ) : (

        <div className="rounded-lg border border-dashed border-zinc-800 bg-zinc-950 p-4 text-sm text-zinc-600">
          None specified
        </div>

      )}

    </div>
  );
}


/* =========================================
   INITIALS
========================================= */

function getInitials(
  name: string
) {

  if (!name) {
    return "C";
  }

  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map(
      (word) => word[0]
    )
    .join("")
    .toUpperCase();
}