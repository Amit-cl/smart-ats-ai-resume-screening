import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { UploadCloud } from "lucide-react";
import api from "../api/api.js";
import StatusBadge from "../components/StatusBadge.jsx";
import ScoreBadge from "../components/ScoreBadge.jsx";

export default function JobDetails() {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [candidates, setCandidates] = useState([]);
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadStep, setUploadStep] = useState("");
  const [uploadResults, setUploadResults] = useState([]);

  async function loadData() {
    const jobRes = await api.get(`/jobs/${id}`);
    const candidateRes = await api.get(`/jobs/${id}/candidates`);
    setJob(jobRes.data);
    setCandidates(candidateRes.data);
  }

  useEffect(() => {
    loadData();
  }, [id]);

  async function updateStatus(candidateId, status) {
    await api.put(`/candidates/${candidateId}/status`, { status });
    loadData();
  }

  async function clearCandidates() {
    const ok = window.confirm("Are you sure? This will remove all candidates only for this selected job.");
    if (!ok) return;

    await api.delete(`/jobs/${id}/candidates`);
    loadData();
  }

  function handleFileChange(e) {
    setFiles(Array.from(e.target.files));
    setUploadResults([]);
    setUploadStep("Files selected. Ready to analyze.");
  }

  async function handleUpload(e) {
    e.preventDefault();

    if (files.length === 0) {
      alert("Please select at least one PDF resume");
      return;
    }

    const formData = new FormData();
    files.forEach((file) => formData.append("resumes", file));

    setUploading(true);
    setUploadResults([]);
    setUploadStep("Uploading resumes...");

    try {
      setTimeout(() => setUploadStep("Extracting PDF text..."), 600);
      setTimeout(() => setUploadStep("AI is comparing resumes with job description..."), 1200);

      const res = await api.post(`/jobs/${id}/upload-resumes`, formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      setUploadStep("Ranking updated successfully.");
      setUploadResults(res.data.results);
      setFiles([]);
      await loadData();
    } catch (err) {
      setUploadStep(err.response?.data?.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  if (!job) return <p className="muted">Loading job...</p>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="page-title">{job.title}</h1>
            <StatusBadge status={job.status} />
          </div>
          <p className="muted mt-1">
            {job.department || "Department not specified"} • {job.location || "Location not specified"}
          </p>
        </div>

        <button onClick={clearCandidates} className="btn-secondary text-red-600">
          Clear Candidates
        </button>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <div className="card p-5">
          <p className="text-sm text-slate-500 dark:text-slate-400">Candidates</p>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{job.candidateCount}</h2>
        </div>
        <div className="card p-5">
          <p className="text-sm text-slate-500 dark:text-slate-400">Average Score</p>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{job.averageScore}%</h2>
        </div>
        <div className="card p-5">
          <p className="text-sm text-slate-500 dark:text-slate-400">Experience</p>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">{job.experience || "Not specified"}</h2>
        </div>
      </div>

      <div className="card p-5">
        <h2 className="font-semibold text-slate-900 dark:text-white">Job Description</h2>
        <p className="text-sm text-slate-600 dark:text-slate-300 mt-3 whitespace-pre-line">{job.jobDescription}</p>

        <h3 className="font-semibold text-slate-900 dark:text-white mt-5">Required Skills</h3>
        <div className="flex flex-wrap gap-2 mt-3">
          {job.requiredSkills?.map((skill) => (
            <span key={skill} className="px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-sm">
              {skill}
            </span>
          ))}
        </div>
      </div>

      <div className="card p-5">
        <div className="flex items-center gap-3">
          <div className="h-11 w-11 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
            <UploadCloud className="text-slate-600 dark:text-slate-300" size={20} />
          </div>
          <div>
            <h2 className="font-semibold text-slate-900 dark:text-white">Upload Resumes for this Job</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">Single or bulk PDF upload. Ranking updates automatically.</p>
          </div>
        </div>

        <form onSubmit={handleUpload} className="mt-5 grid lg:grid-cols-[1fr_auto] gap-4 items-end">
          <div>
            <label className="label">Select PDF Resumes</label>
            <input type="file" accept="application/pdf" multiple onChange={handleFileChange} className="input mt-1" />
          </div>

          <button disabled={uploading} className="btn-primary">
            {uploading ? "Analyzing..." : "Upload & Analyze"}
          </button>
        </form>

        {uploadStep && (
          <div className="mt-5 border border-slate-200 dark:border-slate-800 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-slate-900 dark:text-white">{uploadStep}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">{files.length} file(s)</p>
            </div>

            <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full mt-3 overflow-hidden">
              <div className={`h-full bg-slate-900 dark:bg-white rounded-full ${uploading ? "w-2/3 animate-pulse" : "w-full"}`} />
            </div>
          </div>
        )}

        {uploadResults.length > 0 && (
          <div className="mt-5 space-y-2">
            {uploadResults.map((item, index) => (
              <div key={index} className="flex items-center justify-between border border-slate-200 dark:border-slate-800 rounded-xl p-3">
                <div>
                  <p className="text-sm font-medium text-slate-900 dark:text-white">{item.fileName}</p>
                  <p className={item.status === "Completed" ? "text-xs text-emerald-600 dark:text-emerald-300" : "text-xs text-red-600 dark:text-red-300"}>
                    {item.status}
                  </p>
                </div>

                {item.candidate && (
                  <Link to={`/candidates/${item.candidate._id}`} className="text-sm font-medium text-slate-900 dark:text-white hover:underline">
                    View
                  </Link>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="card overflow-hidden">
        <div className="p-5 border-b border-slate-200 dark:border-slate-800">
          <h2 className="font-semibold text-slate-900 dark:text-white">AI Candidate Ranking</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">Candidates are sorted by ATS score for this job only.</p>
        </div>

        <table className="w-full text-sm">
          <thead className="bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
            <tr>
              <th className="text-left p-4 text-slate-600 dark:text-slate-300">Rank</th>
              <th className="text-left p-4 text-slate-600 dark:text-slate-300">Candidate</th>
              <th className="text-left p-4 text-slate-600 dark:text-slate-300">Score</th>
              <th className="text-left p-4 text-slate-600 dark:text-slate-300">Matched Skills</th>
              <th className="text-left p-4 text-slate-600 dark:text-slate-300">Missing Skills</th>
              <th className="text-left p-4 text-slate-600 dark:text-slate-300">Status</th>
              <th className="text-right p-4 text-slate-600 dark:text-slate-300">Actions</th>
            </tr>
          </thead>

          <tbody>
            {candidates.length === 0 && (
              <tr>
                <td colSpan="7" className="p-8 text-center text-slate-500 dark:text-slate-400">
                  No candidates yet. Upload resumes above for this job.
                </td>
              </tr>
            )}

            {candidates.map((candidate, index) => (
              <tr key={candidate._id} className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50">
                <td className="p-4 font-semibold text-slate-700 dark:text-slate-200">#{index + 1}</td>
                <td className="p-4">
                  <Link to={`/candidates/${candidate._id}`} className="font-medium text-slate-900 dark:text-white hover:underline">
                    {candidate.candidateName}
                  </Link>
                  <p className="text-slate-500 dark:text-slate-400">{candidate.email || "No email found"}</p>
                </td>
                <td className="p-4"><ScoreBadge score={candidate.atsScore} /></td>
                <td className="p-4 text-slate-600 dark:text-slate-300 max-w-xs">{candidate.matchedSkills?.slice(0, 4).join(", ") || "-"}</td>
                <td className="p-4 text-slate-600 dark:text-slate-300 max-w-xs">{candidate.missingSkills?.slice(0, 4).join(", ") || "-"}</td>
                <td className="p-4"><StatusBadge status={candidate.status} /></td>
                <td className="p-4">
                  <div className="flex justify-end gap-2">
                    <button onClick={() => updateStatus(candidate._id, "Shortlisted")} className="px-3 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-300 text-xs font-medium">Shortlist</button>
                    <button onClick={() => updateStatus(candidate._id, "Rejected")} className="px-3 py-1.5 rounded-lg bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-300 text-xs font-medium">Reject</button>
                    <button onClick={() => updateStatus(candidate._id, "Interview")} className="px-3 py-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-300 text-xs font-medium">Interview</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
