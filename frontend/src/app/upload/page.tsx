"use client";

import {
  Upload,
  FileText,
  CheckCircle2,
  AlertCircle,
  Loader2,
  X,
  ArrowRight,
  Sparkles,
} from "lucide-react";

import { useRef, useState } from "react";

import { uploadResume } from "@/lib/api";
import type { Candidate } from "@/lib/types";


export default function UploadPage() {

  const fileInputRef = useRef<HTMLInputElement>(null);

  const [file, setFile] = useState<File | null>(null);

  const [candidate, setCandidate] =
    useState<Candidate | null>(null);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const [dragging, setDragging] =
    useState(false);


  const handleFile = (selectedFile: File) => {

    setError("");
    setCandidate(null);

    if (selectedFile.type !== "application/pdf") {
      setError("Please upload a PDF file.");
      return;
    }

    if (selectedFile.size > 10 * 1024 * 1024) {
      setError("File size must be less than 10MB.");
      return;
    }

    setFile(selectedFile);
  };


  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {

    const selectedFile =
      event.target.files?.[0];

    if (selectedFile) {
      handleFile(selectedFile);
    }
  };


  const handleDrop = (
    event: React.DragEvent<HTMLDivElement>
  ) => {

    event.preventDefault();

    setDragging(false);

    const droppedFile =
      event.dataTransfer.files?.[0];

    if (droppedFile) {
      handleFile(droppedFile);
    }
  };


  const removeFile = () => {

    setFile(null);
    setCandidate(null);
    setError("");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };


  const analyzeResume = async () => {

    if (!file) {
      setError("Please select a resume first.");
      return;
    }

    try {

      setLoading(true);
      setError("");

      const response =
        await uploadResume(file);

      setCandidate(response.candidate);

    } catch (err) {

      setError(
        err instanceof Error
          ? err.message
          : "Failed to analyze resume."
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

          <Sparkles size={15} />

          AI Resume Analysis

        </p>

        <h1 className="text-3xl font-semibold tracking-tight">
          Upload Resume
        </h1>

        <p className="mt-2 max-w-2xl text-sm text-zinc-500">
          Upload a candidate's resume and let AI extract
          their skills, experience and education.
        </p>

      </div>


      <div className="grid gap-6 xl:grid-cols-5">

        {/* Upload Section */}

        <div className="xl:col-span-3">

          <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">

            <div className="mb-5">

              <h2 className="font-medium">
                Resume file
              </h2>

              <p className="mt-1 text-xs text-zinc-500">
                PDF files only · Maximum 10MB
              </p>

            </div>


            {!file ? (

              <div
                onDragOver={(event) => {
                  event.preventDefault();
                  setDragging(true);
                }}
                onDragLeave={() => {
                  setDragging(false);
                }}
                onDrop={handleDrop}
                onClick={() =>
                  fileInputRef.current?.click()
                }
                className={`flex min-h-72 cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed transition ${
                  dragging
                    ? "border-white bg-zinc-800"
                    : "border-zinc-700 bg-zinc-950 hover:border-zinc-500 hover:bg-zinc-900"
                }`}
              >

                <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-xl border border-zinc-800 bg-zinc-900">

                  <Upload
                    size={22}
                    className="text-zinc-300"
                  />

                </div>

                <p className="text-sm font-medium">
                  Drop your resume here
                </p>

                <p className="mt-2 text-xs text-zinc-500">
                  or click to browse from your computer
                </p>

                <div className="mt-5 rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-xs text-zinc-400">
                  PDF · Max 10MB
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="application/pdf"
                  onChange={handleInputChange}
                  className="hidden"
                />

              </div>

            ) : (

              <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-5">

                <div className="flex items-center justify-between">

                  <div className="flex items-center gap-4">

                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-zinc-900">

                      <FileText
                        size={21}
                        className="text-zinc-300"
                      />

                    </div>

                    <div>

                      <p className="max-w-md truncate text-sm font-medium">
                        {file.name}
                      </p>

                      <p className="mt-1 text-xs text-zinc-500">
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </p>

                    </div>

                  </div>


                  <button
                    onClick={removeFile}
                    className="rounded-lg p-2 text-zinc-500 transition hover:bg-zinc-900 hover:text-white"
                  >
                    <X size={17} />
                  </button>

                </div>


                <button
                  onClick={analyzeResume}
                  disabled={loading}
                  className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg bg-white px-4 py-3 text-sm font-medium text-black transition hover:bg-zinc-200 disabled:cursor-not-allowed disabled:opacity-50"
                >

                  {loading ? (
                    <>
                      <Loader2
                        size={17}
                        className="animate-spin"
                      />

                      Analyzing Resume...
                    </>
                  ) : (
                    <>
                      <Sparkles size={17} />

                      Analyze Resume
                    </>
                  )}

                </button>

              </div>

            )}


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


        {/* Information Panel */}

        <div className="xl:col-span-2">

          <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">

            <div className="mb-6">

              <p className="text-xs uppercase tracking-wider text-zinc-500">
                What happens next
              </p>

              <h2 className="mt-2 text-lg font-semibold">
                AI-powered extraction
              </h2>

            </div>


            <div className="space-y-5">

              <Step
                number="01"
                title="Upload"
                description="Your PDF resume is securely sent to the screening API."
              />

              <Step
                number="02"
                title="Extract"
                description="The resume text is extracted and processed by AI."
              />

              <Step
                number="03"
                title="Structure"
                description="Skills, experience and education are converted into structured data."
              />

              <Step
                number="04"
                title="Save"
                description="The candidate profile is saved and ready for screening."
              />

            </div>

          </div>

        </div>

      </div>


      {/* Candidate Result */}

      {candidate && (

        <div className="mt-6 rounded-xl border border-zinc-800 bg-zinc-900/50">

          <div className="flex items-center justify-between border-b border-zinc-800 p-6">

            <div>

              <div className="flex items-center gap-2">

                <CheckCircle2
                  size={18}
                  className="text-green-400"
                />

                <h2 className="font-medium">
                  Resume analyzed successfully
                </h2>

              </div>

              <p className="mt-1 text-xs text-zinc-500">
                Candidate profile extracted from the resume.
              </p>

            </div>

            <ArrowRight
              size={18}
              className="text-zinc-500"
            />

          </div>


          <div className="grid gap-8 p-6 lg:grid-cols-3">

            {/* Candidate */}

            <div>

              <p className="text-xs uppercase tracking-wider text-zinc-500">
                Candidate
              </p>

              <h3 className="mt-3 text-xl font-semibold">
                {candidate.name}
              </h3>

              {candidate.email && (
                <p className="mt-2 text-sm text-zinc-500">
                  {candidate.email}
                </p>
              )}

              {candidate.phone && (
                <p className="mt-1 text-sm text-zinc-500">
                  {candidate.phone}
                </p>
              )}

            </div>


            {/* Skills */}

            <div>

              <p className="text-xs uppercase tracking-wider text-zinc-500">
                Skills
              </p>

              <div className="mt-3 flex flex-wrap gap-2">

                {candidate.skills?.length ? (

                  candidate.skills.map((skill) => (

                    <span
                      key={skill}
                      className="rounded-md border border-zinc-700 bg-zinc-900 px-2.5 py-1.5 text-xs text-zinc-300"
                    >
                      {skill}
                    </span>

                  ))

                ) : (

                  <span className="text-sm text-zinc-600">
                    No skills extracted
                  </span>

                )}

              </div>

            </div>


            {/* Experience */}

            <div>

              <p className="text-xs uppercase tracking-wider text-zinc-500">
                Experience
              </p>

              <p className="mt-3 text-xl font-semibold">
                {candidate.total_experience_years ?? 0}
              </p>

              <p className="text-sm text-zinc-500">
                years of experience
              </p>

            </div>

          </div>


          {/* Experience details */}

          {candidate.experience?.length > 0 && (

            <div className="border-t border-zinc-800 p-6">

              <p className="mb-4 text-xs uppercase tracking-wider text-zinc-500">
                Work Experience
              </p>

              <div className="space-y-4">

                {candidate.experience.map(
                  (experience, index) => (

                    <div
                      key={index}
                      className="rounded-lg border border-zinc-800 bg-zinc-950 p-4"
                    >

                      <div className="flex items-start justify-between">

                        <div>

                          <h4 className="text-sm font-medium">
                            {experience.role}
                          </h4>

                          <p className="mt-1 text-sm text-zinc-500">
                            {experience.company}
                          </p>

                        </div>

                        {experience.duration && (

                          <span className="text-xs text-zinc-600">
                            {experience.duration}
                          </span>

                        )}

                      </div>

                      {experience.description && (

                        <p className="mt-3 text-sm leading-6 text-zinc-500">
                          {experience.description}
                        </p>

                      )}

                    </div>

                  )
                )}

              </div>

            </div>

          )}


          {/* Education */}

          {candidate.education?.length > 0 && (

            <div className="border-t border-zinc-800 p-6">

              <p className="mb-4 text-xs uppercase tracking-wider text-zinc-500">
                Education
              </p>

              <div className="grid gap-3 md:grid-cols-2">

                {candidate.education.map(
                  (education, index) => (

                    <div
                      key={index}
                      className="rounded-lg border border-zinc-800 bg-zinc-950 p-4"
                    >

                      <h4 className="text-sm font-medium">
                        {education.degree}
                      </h4>

                      <p className="mt-1 text-sm text-zinc-500">
                        {education.institution}
                      </p>

                      {education.field && (

                        <p className="mt-1 text-xs text-zinc-600">
                          {education.field}
                        </p>

                      )}

                    </div>

                  )
                )}

              </div>

            </div>

          )}

        </div>

      )}

    </div>
  );
}


/* ------------------------------------------
   Step component
------------------------------------------ */

function Step({
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