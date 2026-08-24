"use client";

import {
  ArrowUpRight,
  BriefcaseBusiness,
  Loader2,
  Sparkles,
  TrendingUp,
  Users,
  ClipboardCheck,
} from "lucide-react";

import Link from "next/link";
import {
  useEffect,
  useState,
} from "react";

import {
  getDashboardStats,
} from "@/lib/api";


interface DashboardStats {

  total_candidates: number;

  total_jobs: number;

  total_screenings: number;

  average_score: number;

  recommendations: {
    "Strong Match": number;
    "Good Match": number;
    "Weak Match": number;
    Reject: number;
  };

  recent_candidates: Candidate[];

  recent_jobs: Job[];

}


interface Candidate {

  id: string;

  name: string;

  email?: string | null;

  skills?: string[];

  total_experience_years?: number | null;

  created_at?: string;

}


interface Job {

  id: string;

  title: string;

  minimum_experience_years?: number | null;

  created_at?: string;

}


export default function DashboardPage() {

  const [stats, setStats] =
    useState<DashboardStats | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");



  const loadDashboard = async () => {

    try {

      setLoading(true);

      setError("");

      const response =
        await getDashboardStats();

      setStats(
        response.stats
      );

    } catch (error) {

      console.error(
        "Failed to load dashboard:",
        error
      );

      setError(
        error instanceof Error
          ? error.message
          : "Failed to load dashboard."
      );

    } finally {

      setLoading(false);

    }
  };


  useEffect(() => {

    loadDashboard();

  }, []);


  if (loading) {

    return (
      <div className="flex min-h-[70vh] items-center justify-center">

        <div className="flex items-center gap-3 text-sm text-zinc-500">

          <Loader2
            size={18}
            className="animate-spin"
          />

          Loading dashboard...

        </div>

      </div>
    );

  }


  if (error || !stats) {

    return (
      <div className="p-8">

        <div className="rounded-xl border border-red-900/50 bg-red-950/20 p-6">

          <p className="text-sm text-red-300">

            {error ||
              "Dashboard data unavailable."}

          </p>

        </div>

      </div>
    );

  }


  return (
    <div className="p-8">

      {/* Header */}

      <div className="mb-8">

        <p className="text-xs uppercase tracking-wider text-zinc-500">
          Overview
        </p>

        <h1 className="mt-2 text-3xl font-semibold">
          Dashboard
        </h1>

        <p className="mt-2 text-sm text-zinc-500">
          Monitor your recruitment pipeline
          and AI screening activity.
        </p>

      </div>


      {/* Stats */}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">

        <StatCard
          icon={<Users size={18} />}
          title="Candidates"
          value={
            stats.total_candidates
          }
          subtitle="Candidates in database"
        />

        <StatCard
          icon={
            <BriefcaseBusiness
              size={18}
            />
          }
          title="Jobs"
          value={
            stats.total_jobs
          }
          subtitle="Active job positions"
        />

        <StatCard
          icon={
            <ClipboardCheck
              size={18}
            />
          }
          title="Screenings"
          value={
            stats.total_screenings
          }
          subtitle="AI assessments completed"
        />

        <StatCard
          icon={
            <TrendingUp size={18} />
          }
          title="Average Score"
          value={
            stats.average_score
          }
          subtitle="Out of 10"
        />

      </div>


      {/* Main grid */}

      <div className="mt-6 grid gap-6 xl:grid-cols-3">


        {/* Screening overview */}

        <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6 xl:col-span-1">

          <div className="mb-6">

            <div className="flex items-center gap-2">

              <Sparkles
                size={17}
                className="text-zinc-400"
              />

              <h2 className="font-medium">
                Screening Overview
              </h2>

            </div>

            <p className="mt-1 text-xs text-zinc-600">
              Candidate recommendations
            </p>

          </div>


          <div className="space-y-5">

            <RecommendationRow
              label="Strong Match"
              value={
                stats.recommendations[
                  "Strong Match"
                ]
              }
              total={
                stats.total_screenings
              }
            />

            <RecommendationRow
              label="Good Match"
              value={
                stats.recommendations[
                  "Good Match"
                ]
              }
              total={
                stats.total_screenings
              }
            />

            <RecommendationRow
              label="Weak Match"
              value={
                stats.recommendations[
                  "Weak Match"
                ]
              }
              total={
                stats.total_screenings
              }
            />

            <RecommendationRow
              label="Reject"
              value={
                stats.recommendations[
                  "Reject"
                ]
              }
              total={
                stats.total_screenings
              }
            />

          </div>

        </div>


        {/* Recent Jobs */}

        <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6 xl:col-span-2">

          <div className="mb-5 flex items-center justify-between">

            <div>

              <h2 className="font-medium">
                Recent Jobs
              </h2>

              <p className="mt-1 text-xs text-zinc-600">
                Recently created positions
              </p>

            </div>


            <Link
              href="/jobs"
              className="flex items-center gap-1 text-xs text-zinc-500 transition hover:text-white"
            >

              View all

              <ArrowUpRight
                size={13}
              />

            </Link>

          </div>


          {stats.recent_jobs.length === 0 ? (

            <EmptyState
              text="No jobs created yet."
            />

          ) : (

            <div className="space-y-2">

              {stats.recent_jobs.map(
                (job) => (

                  <Link
                    key={job.id}
                    href={`/jobs/${job.id}`}
                    className="flex items-center justify-between rounded-lg border border-zinc-800 bg-zinc-950 p-4 transition hover:border-zinc-700"
                  >

                    <div className="flex items-center gap-3">

                      <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-800">

                        <BriefcaseBusiness
                          size={16}
                          className="text-zinc-500"
                        />

                      </div>


                      <div>

                        <p className="text-sm font-medium">
                          {job.title}
                        </p>

                        <p className="mt-1 text-[11px] text-zinc-600">

                          {job.minimum_experience_years ??
                            0}
                          + years experience

                        </p>

                      </div>

                    </div>


                    <ArrowUpRight
                      size={15}
                      className="text-zinc-600"
                    />

                  </Link>

                )
              )}

            </div>

          )}

        </div>

      </div>


      {/* Recent Candidates */}

      <div className="mt-6 rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">

        <div className="mb-5 flex items-center justify-between">

          <div>

            <h2 className="font-medium">
              Recent Candidates
            </h2>

            <p className="mt-1 text-xs text-zinc-600">
              Recently uploaded candidates
            </p>

          </div>


          <Link
            href="/candidates"
            className="flex items-center gap-1 text-xs text-zinc-500 transition hover:text-white"
          >

            View all

            <ArrowUpRight
              size={13}
            />

          </Link>

        </div>


        {stats.recent_candidates.length === 0 ? (

          <EmptyState
            text="No candidates uploaded yet."
          />

        ) : (

          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">

            {stats.recent_candidates.map(
              (candidate) => (

                <Link
                  key={candidate.id}
                  href="/candidates"
                  className="rounded-lg border border-zinc-800 bg-zinc-950 p-4 transition hover:border-zinc-700"
                >

                  <div className="flex items-center gap-3">

                    <div className="flex h-10 w-10 items-center justify-center rounded-full border border-zinc-800 bg-zinc-900 text-xs font-medium">

                      {getInitials(
                        candidate.name
                      )}

                    </div>


                    <div className="min-w-0">

                      <p className="truncate text-sm font-medium">

                        {candidate.name}

                      </p>


                      <p className="mt-1 truncate text-xs text-zinc-600">

                        {candidate.email ||
                          "No email"}

                      </p>

                    </div>

                  </div>


                  <div className="mt-4 flex flex-wrap gap-1.5">

                    {candidate.skills
                      ?.slice(0, 4)
                      .map(
                        (skill) => (

                          <span
                            key={skill}
                            className="rounded-md border border-zinc-800 px-2 py-1 text-[10px] text-zinc-600"
                          >
                            {skill}
                          </span>

                        )
                      )}

                  </div>

                </Link>

              )
            )}

          </div>

        )}

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
  value: number;
  subtitle: string;
}) {

  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-5">

      <div className="flex items-center justify-between">

        <p className="text-xs text-zinc-500">
          {title}
        </p>

        <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-800 bg-zinc-950 text-zinc-500">

          {icon}

        </div>

      </div>


      <p className="mt-5 text-3xl font-semibold">
        {value}
      </p>


      <p className="mt-1 text-xs text-zinc-600">
        {subtitle}
      </p>

    </div>
  );
}


/* =========================================
   RECOMMENDATION ROW
========================================= */

function RecommendationRow({
  label,
  value,
  total,
}: {
  label: string;
  value: number;
  total: number;
}) {

  const percentage =
    total > 0
      ? Math.round(
          (value / total) * 100
        )
      : 0;


  return (
    <div>

      <div className="mb-2 flex items-center justify-between">

        <span className="text-xs text-zinc-500">
          {label}
        </span>

        <span className="text-xs text-zinc-400">
          {value}
        </span>

      </div>


      <div className="h-1.5 overflow-hidden rounded-full bg-zinc-800">

        <div
          className="h-full rounded-full bg-zinc-400 transition-all"
          style={{
            width: `${percentage}%`,
          }}
        />

      </div>

    </div>
  );
}


/* =========================================
   EMPTY STATE
========================================= */

function EmptyState({
  text,
}: {
  text: string;
}) {

  return (
    <div className="flex min-h-32 items-center justify-center rounded-lg border border-dashed border-zinc-800">

      <p className="text-xs text-zinc-600">
        {text}
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