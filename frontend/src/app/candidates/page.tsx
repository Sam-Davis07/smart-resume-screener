"use client";

import {
  ArrowUpRight,
  BriefcaseBusiness,
  FileText,
  Loader2,
  Search,
  Users,
  Download,
  Trash2
} from "lucide-react";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";


import {
  getCandidates,
  getCandidateScreeningHistory,
  getCandidateResumeUrl,
  deleteCandidate
} from "@/lib/api";

import type {
  Candidate,
  CandidateScreeningHistory,
} from "@/lib/types";


export default function CandidatesPage() {

  const [candidates, setCandidates] =
    useState<Candidate[]>([]);

  const [search, setSearch] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");


  /* --------------------------------
     Load candidates + jobs
  -------------------------------- */

  useEffect(() => {

    const loadData = async () => {

      try {

        setLoading(true);
        setError("");

        const candidatesResponse =
          await getCandidates();

        setCandidates(
          candidatesResponse.candidates || []
        );


      } catch (error) {

        console.error(
          "Failed to load candidates:",
          error
        );

        setError(
          error instanceof Error
            ? error.message
            : "Failed to load candidates."
        );

      } finally {

        setLoading(false);

      }

    };


    loadData();

  }, []);


  /* --------------------------------
     Search
  -------------------------------- */

  const filteredCandidates =
    useMemo(() => {

      const query =
        search.trim().toLowerCase();

      if (!query) {
        return candidates;
      }

      return candidates.filter(
        (candidate) => {

          const name =
            candidate.name
              ?.toLowerCase() || "";

          const email =
            candidate.email
              ?.toLowerCase() || "";

          const skills =
            candidate.skills
              ?.join(" ")
              .toLowerCase() || "";

          return (
            name.includes(query) ||
            email.includes(query) ||
            skills.includes(query)
          );

        }
      );

    }, [candidates, search]);


  /* --------------------------------
     Statistics
  -------------------------------- */

  const totalCandidates =
    candidates.length;

  const totalSkills =
    candidates.reduce(
      (total, candidate) =>
        total +
        (candidate.skills?.length || 0),
      0
    );

  const averageExperience =
    candidates.length
      ? (
          candidates.reduce(
            (total, candidate) =>
              total +
              Number(
                candidate.total_experience_years || 0
              ),
            0
          ) / candidates.length
        ).toFixed(1)
      : "0";


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

          Loading candidates...

        </div>

      </div>
    );

  }


  /* --------------------------------
     Error
  -------------------------------- */

  if (error) {

    return (
      <div className="p-8">

        <div className="rounded-xl border border-red-900/50 bg-red-950/20 p-6">

          <p className="text-sm text-red-300">
            {error}
          </p>

        </div>

      </div>
    );

  }


  return (
    <div className="p-8">

      {/* =================================
          HEADER
      ================================= */}

      <div className="mb-8">

        <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">

          <div>

            <p className="text-xs uppercase tracking-wider text-zinc-500">
              Recruitment
            </p>

            <h1 className="mt-2 text-3xl font-semibold">
              Candidates
            </h1>

            <p className="mt-2 text-sm text-zinc-500">
              Review and manage candidates
              from your recruitment pipeline.
            </p>

          </div>


          <Link
            href="/upload"
            className="inline-flex w-fit items-center gap-2 rounded-lg bg-white px-4 py-2.5 text-sm font-medium text-black transition hover:bg-zinc-200"
          >

            <Users size={16} />

            Upload Resume

          </Link>

        </div>

      </div>


      {/* =================================
          STATISTICS
      ================================= */}

      <div className="mb-6 grid gap-4 md:grid-cols-3">

        <StatCard
          icon={<Users size={18} />}
          title="Total Candidates"
          value={totalCandidates.toString()}
          subtitle="Candidates in database"
        />


        <StatCard
          icon={<FileText size={18} />}
          title="Total Skills"
          value={totalSkills.toString()}
          subtitle="Skills extracted by AI"
        />


        <StatCard
          icon={<BriefcaseBusiness size={18} />}
          title="Average Experience"
          value={`${averageExperience} yrs`}
          subtitle="Across all candidates"
        />

      </div>


      {/* =================================
          SEARCH
      ================================= */}

      <div className="mb-6 flex flex-col gap-3 md:flex-row">

        <div className="relative flex-1">

          <Search
            size={17}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600"
          />

          <input
            type="text"
            placeholder="Search candidates by name, email, or skill..."
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
            className="w-full rounded-lg border border-zinc-800 bg-zinc-950 py-3 pl-11 pr-4 text-sm text-white outline-none placeholder:text-zinc-600 transition focus:border-zinc-600"
          />

        </div>

      </div>


      {/* =================================
          CANDIDATES
      ================================= */}

      <div className="rounded-xl border border-zinc-800 bg-zinc-900/50">

        <div className="flex items-center justify-between border-b border-zinc-800 p-6">

          <div>

            <h2 className="font-medium">
              All Candidates
            </h2>

            <p className="mt-1 text-xs text-zinc-500">
              {filteredCandidates.length}{" "}
              {filteredCandidates.length === 1
                ? "candidate"
                : "candidates"}{" "}
              found
            </p>

          </div>

        </div>


        {/* Empty state */}

        {filteredCandidates.length === 0 ? (

          <div className="flex min-h-72 flex-col items-center justify-center px-6 text-center">

            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full border border-zinc-800 bg-zinc-950">

              <Users
                size={20}
                className="text-zinc-600"
              />

            </div>


            {search ? (

              <>
                <h3 className="text-sm font-medium">
                  No candidates found
                </h3>

                <p className="mt-2 max-w-sm text-xs text-zinc-600">
                  Try searching with another
                  name, email, or skill.
                </p>
              </>

            ) : (

              <>
                <h3 className="text-sm font-medium">
                  No candidates yet
                </h3>

                <p className="mt-2 max-w-sm text-xs text-zinc-600">
                  Upload a resume to create
                  your first candidate.
                </p>

                <Link
                  href="/upload"
                  className="mt-5 rounded-lg bg-white px-4 py-2.5 text-sm font-medium text-black transition hover:bg-zinc-200"
                >
                  Upload Resume
                </Link>
              </>

            )}

          </div>

        ) : (

          /* =================================
             CANDIDATE LIST
          ================================= */

          <div className="divide-y divide-zinc-800">

            {filteredCandidates.map(
              (candidate) => (

                <CandidateRow
                  key={candidate.id}
                  candidate={candidate}
                  onDeleted={(candidateId) => {
                    setCandidates((current) =>
                      current.filter(
                        (item) => item.id !== candidateId
                      )
                    );
                  }}
                />

              )
            )}

          </div>

        )}

      </div>

    </div>
  );
}


/* =========================================
   CANDIDATE ROW
========================================= */

function CandidateRow({
  candidate,
  onDeleted,
}: {
  candidate: Candidate;
  onDeleted: (candidateId: string) => void;
}) {

  const [history, setHistory] =
    useState<CandidateScreeningHistory[]>([]);

  const [loadingHistory, setLoadingHistory] =
    useState(true);

  const [deleting, setDeleting] =
    useState(false);


  useEffect(() => {

    const loadHistory = async () => {

      try {

        const response =
          await getCandidateScreeningHistory(
            candidate.id
          );

        setHistory(
          response.screenings || []
        );

      } catch (error) {

        console.error(
          "Failed to load screening history:",
          error
        );

      } finally {

        setLoadingHistory(false);

      }

    };


    loadHistory();

  }, [candidate.id]);


  const handleDelete = async () => {

    const confirmed = window.confirm(
      `Are you sure you want to delete ${candidate.name}?\n\nThis will also delete the candidate's screening history.`
    );

    if (!confirmed) {
      return;
    }

    try {

      setDeleting(true);

      await deleteCandidate(
        candidate.id
      );

      onDeleted(candidate.id);

    } catch (error) {

      console.error(
        "Failed to delete candidate:",
        error
      );

      window.alert(
        error instanceof Error
          ? error.message
          : "Failed to delete candidate."
      );

    } finally {

      setDeleting(false);

    }
  };


  return (
    <div className="p-6 transition hover:bg-zinc-900/50">


      {/* Candidate header */}

      <div className="flex flex-col gap-5 lg:flex-row lg:items-center">


        {/* Candidate */}

        <div className="flex min-w-[280px] items-center gap-4">

          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-zinc-800 bg-zinc-950 text-sm font-medium">

            {getInitials(
              candidate.name
            )}

          </div>


          <div className="min-w-0">

            <h3 className="truncate text-sm font-medium">

              {candidate.name}

            </h3>


            {candidate.email && (

              <p className="mt-1 truncate text-xs text-zinc-500">

                {candidate.email}

              </p>

            )}


            <p className="mt-1 text-xs text-zinc-600">

              {candidate.total_experience_years ?? 0}
              {" "}
              years experience

            </p>

          </div>

        </div>


        {/* Skills */}

        <div className="flex-1">

          <p className="mb-2 text-[10px] uppercase tracking-wider text-zinc-600">
            Skills
          </p>


          <div className="flex flex-wrap gap-1.5">

            {candidate.skills
              ?.slice(0, 5)
              .map(skill => (

                <span
                  key={skill}
                  className="rounded-md border border-zinc-800 bg-zinc-950 px-2.5 py-1.5 text-[11px] text-zinc-500"
                >
                  {skill}
                </span>

              ))}


            {(candidate.skills?.length || 0) > 5 && (

              <span className="rounded-md border border-zinc-800 bg-zinc-950 px-2.5 py-1.5 text-[11px] text-zinc-600">

                +{candidate.skills.length - 5}

              </span>

            )}

          </div>

        </div>


        {/* Screening count */}

        <div className="min-w-[120px]">

          <p className="text-[10px] uppercase tracking-wider text-zinc-600">

            Screenings

          </p>


          <p className="mt-2 text-sm font-medium">

            {loadingHistory
              ? "..."
              : history.length}

          </p>

        </div>


      </div>


      {/* Screening History */}

      <div className="mt-6 border-t border-zinc-800 pt-5">


        <div className="mb-3 flex items-center justify-between">

          <p className="text-xs font-medium text-zinc-400">

            Screening History

          </p>


          <span className="text-[10px] text-zinc-600">

            {history.length}{" "}
            {history.length === 1
              ? "assessment"
              : "assessments"}

          </span>

        </div>


        {loadingHistory ? (

          <div className="flex items-center gap-2 text-xs text-zinc-600">

            <Loader2
              size={13}
              className="animate-spin"
            />

            Loading screening history...

          </div>

        ) : history.length === 0 ? (

          <div className="rounded-lg border border-dashed border-zinc-800 bg-zinc-950 p-4">

            <p className="text-xs text-zinc-600">

              This candidate hasn't been screened
              for any job yet.

            </p>

          </div>

        ) : (

          <div className="space-y-2">

            {history.map(screening => (

              <div
                key={screening.id}
                className="flex flex-col gap-4 rounded-lg border border-zinc-800 bg-zinc-950 p-4 md:flex-row md:items-center"
              >


                {/* Job */}

                <div className="flex-1">

                  <p className="text-sm font-medium">

                    {screening.jobs?.title ||
                      "Unknown Job"}

                  </p>


                  <p className="mt-1 text-[11px] text-zinc-600">

                    {screening.created_at
                      ? new Date(
                          screening.created_at
                        ).toLocaleDateString()
                      : "Unknown date"}

                  </p>

                </div>


                {/* Score */}

                <div className="text-left md:text-right">

                  <p className="text-lg font-semibold">

                    {screening.score}

                    <span className="ml-1 text-xs font-normal text-zinc-600">
                      / 10
                    </span>

                  </p>


                  <p className="text-[11px] text-zinc-500">

                    {screening.recommendation}

                  </p>

                </div>


                {/* Action */}

                <Link
                  href={`/candidates/${candidate.id}?job=${screening.job_id}`}
                  className="inline-flex items-center justify-center gap-2 rounded-lg border border-zinc-800 px-3 py-2 text-xs font-medium text-zinc-400 transition hover:border-zinc-600 hover:text-white"
                >

                  View Assessment

                  <ArrowUpRight
                    size={13}
                  />

                </Link>


              </div>

            ))}

          </div>

        )}

      </div>


      {/* Resume */}

      <div className="flex items-center gap-2">

  {candidate.resume_filename && (

    <a
      href={getCandidateResumeUrl(candidate.id)}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-2 rounded-lg border border-zinc-800 px-3 py-2 text-xs font-medium text-zinc-400 transition hover:border-zinc-600 hover:text-white"
    >

      <Download size={14} />

      Resume

    </a>

  )}

  <button
    type="button"
    onClick={handleDelete}
    disabled={deleting}
    aria-label={`Delete ${candidate.name}`}
    title={`Delete ${candidate.name}`}
    className="inline-flex items-center justify-center rounded-lg border border-zinc-800 p-2 text-zinc-500 transition hover:border-red-900/60 hover:bg-red-950/20 hover:text-red-400 disabled:cursor-not-allowed disabled:opacity-50"
  >

    {deleting ? (

      <Loader2
        size={14}
        className="animate-spin"
      />

    ) : (

      <Trash2 size={14} />

    )}

  </button>

</div>

    </div>
  );
}


/* =========================================
   STAT CARD
========================================= */

function StatCard({
  icon,
  title,
  value,
  subtitle,
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
  subtitle: string;
}) {

  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-5">

      <div className="mb-4 flex items-center justify-between">

        <p className="text-xs text-zinc-500">
          {title}
        </p>

        <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-800 bg-zinc-950 text-zinc-500">

          {icon}

        </div>

      </div>


      <p className="text-2xl font-semibold">
        {value}
      </p>

      <p className="mt-1 text-xs text-zinc-600">
        {subtitle}
      </p>

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