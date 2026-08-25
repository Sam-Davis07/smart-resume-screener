"use client";

import {
  Search,
  X,
  User,
  BriefcaseBusiness,
  Loader2,
  ArrowUpRight,
} from "lucide-react";

import Link from "next/link";

import {
  useEffect,
  useRef,
  useState,
} from "react";

import { searchGlobal } from "@/lib/api";


interface SearchCandidate {
  id: string;
  name: string;
  email?: string | null;
  skills?: string[];
}


interface SearchJob {
  id: string;
  title: string;
}


interface SearchResults {
  success: boolean;
  candidates: SearchCandidate[];
  jobs: SearchJob[];
}


export default function Navbar() {

  const [query, setQuery] =
    useState("");

  const [results, setResults] =
    useState<SearchResults | null>(null);

  const [searching, setSearching] =
    useState(false);

  const [searchOpen, setSearchOpen] =
    useState(false);

  const searchRef =
    useRef<HTMLDivElement>(null);


  /* --------------------------------
     Search
  -------------------------------- */

  useEffect(() => {

    const trimmedQuery =
      query.trim();


    if (!trimmedQuery) {

      setResults(null);
      setSearchOpen(false);

      return;

    }


    setSearchOpen(true);


    const timer =
      setTimeout(async () => {

        try {

          setSearching(true);


          const response =
            await searchGlobal(
              trimmedQuery
            );


          setResults(response);

        } catch (error) {

          console.error(
            "Search failed:",
            error
          );

          setResults({
            success: false,
            candidates: [],
            jobs: [],
          });

        } finally {

          setSearching(false);

        }

      }, 350);


    return () => {
      clearTimeout(timer);
    };

  }, [query]);


  /* --------------------------------
     Close search on outside click
  -------------------------------- */

  useEffect(() => {

    const handleClickOutside = (
      event: MouseEvent
    ) => {

      if (
        searchRef.current &&
        !searchRef.current.contains(
          event.target as Node
        )
      ) {

        setSearchOpen(false);

      }

    };


    document.addEventListener(
      "mousedown",
      handleClickOutside
    );


    return () => {

      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );

    };

  }, []);


  const clearSearch = () => {

    setQuery("");

    setResults(null);

    setSearchOpen(false);

  };


  const hasResults =
    Boolean(
      results &&
      (
        results.candidates.length > 0 ||
        results.jobs.length > 0
      )
    );


  return (
    <header className="fixed left-64 right-0 top-0 z-30 flex h-16 items-center justify-between border-b border-zinc-800 bg-zinc-950/90 px-8 backdrop-blur">


      {/* =================================
          SEARCH
      ================================= */}

      <div
        ref={searchRef}
        className="relative w-96"
      >

        <div className="flex items-center gap-3 rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2">

          <Search
            size={17}
            className="shrink-0 text-zinc-500"
          />


          <input
            type="text"
            value={query}
            onChange={(event) =>
              setQuery(
                event.target.value
              )
            }
            onFocus={() => {

              if (query.trim()) {
                setSearchOpen(true);
              }

            }}
            placeholder="Search candidates, jobs..."
            className="w-full bg-transparent text-sm text-white outline-none placeholder:text-zinc-600"
          />


          {searching && (

            <Loader2
              size={15}
              className="shrink-0 animate-spin text-zinc-500"
            />

          )}


          {!searching && query && (

            <button
              type="button"
              onClick={clearSearch}
              className="shrink-0 text-zinc-600 transition hover:text-white"
              aria-label="Clear search"
            >

              <X size={15} />

            </button>

          )}

        </div>


        {/* =================================
            SEARCH RESULTS
        ================================= */}

        {searchOpen && query.trim() && (

          <div className="absolute left-0 right-0 top-full z-50 mt-2 overflow-hidden rounded-xl border border-zinc-800 bg-zinc-950 shadow-2xl">


            {searching ? (

              <div className="flex items-center justify-center gap-2 p-6 text-xs text-zinc-600">

                <Loader2
                  size={14}
                  className="animate-spin"
                />

                Searching...

              </div>

            ) : !hasResults ? (

              <div className="p-6 text-center">

                <Search
                  size={18}
                  className="mx-auto mb-2 text-zinc-700"
                />

                <p className="text-sm text-zinc-500">
                  No results found
                </p>

                <p className="mt-1 text-xs text-zinc-700">
                  Try another name, skill,
                  or job title.
                </p>

              </div>

            ) : (

              <div className="max-h-96 overflow-y-auto">


                {/* Candidates */}

                {results?.candidates &&
                  results.candidates.length > 0 && (

                    <div className="border-b border-zinc-800 p-3">

                      <p className="mb-2 px-2 text-[10px] font-medium uppercase tracking-wider text-zinc-600">
                        Candidates
                      </p>


                      <div className="space-y-1">

                        {results.candidates
                          .map(
                            (candidate) => (

                              <Link
                                key={candidate.id}
                                href="/candidates"
                                onClick={() =>
                                  setSearchOpen(
                                    false
                                  )
                                }
                                className="flex items-center gap-3 rounded-lg p-3 transition hover:bg-zinc-900"
                              >

                                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-zinc-800 bg-zinc-900">

                                  <User
                                    size={15}
                                    className="text-zinc-500"
                                  />

                                </div>


                                <div className="min-w-0 flex-1">

                                  <p className="truncate text-sm font-medium text-zinc-200">

                                    {candidate.name}

                                  </p>


                                  <p className="truncate text-xs text-zinc-600">

                                    {candidate.email ||
                                      candidate.skills
                                        ?.slice(
                                          0,
                                          2
                                        )
                                        .join(
                                          " · "
                                        ) ||
                                      "Candidate"}

                                  </p>

                                </div>


                                <ArrowUpRight
                                  size={14}
                                  className="text-zinc-700"
                                />

                              </Link>

                            )
                          )}

                      </div>

                    </div>

                  )}


                {/* Jobs */}

                {results?.jobs &&
                  results.jobs.length > 0 && (

                    <div className="p-3">

                      <p className="mb-2 px-2 text-[10px] font-medium uppercase tracking-wider text-zinc-600">
                        Jobs
                      </p>


                      <div className="space-y-1">

                        {results.jobs.map(
                          (job) => (

                            <Link
                              key={job.id}
                              href={`/jobs/${job.id}`}
                              onClick={() =>
                                setSearchOpen(
                                  false
                                )
                              }
                              className="flex items-center gap-3 rounded-lg p-3 transition hover:bg-zinc-900"
                            >

                              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-zinc-800 bg-zinc-900">

                                <BriefcaseBusiness
                                  size={15}
                                  className="text-zinc-500"
                                />

                              </div>


                              <div className="min-w-0 flex-1">

                                <p className="truncate text-sm font-medium text-zinc-200">

                                  {job.title}

                                </p>


                                <p className="text-xs text-zinc-600">

                                  Job position

                                </p>

                              </div>


                              <ArrowUpRight
                                size={14}
                                className="text-zinc-700"
                              />

                            </Link>

                          )
                        )}

                      </div>

                    </div>

                  )}

              </div>

            )}

          </div>

        )}

      </div>


      {/* =================================
          RIGHT SIDE
      ================================= */}

      <div className="flex items-center gap-5">


        {/* User */}

        <div className="flex items-center gap-3">

          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-800 text-xs font-medium text-white">
            HR
          </div>


          <div className="hidden sm:block">

            <p className="text-sm font-medium text-white">
              Recruiter
            </p>

            <p className="text-xs text-zinc-500">
              Hiring Team
            </p>

          </div>

        </div>

      </div>

    </header>
  );
}