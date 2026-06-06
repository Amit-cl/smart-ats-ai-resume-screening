import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/api.js";
import ScoreBadge from "../components/ScoreBadge.jsx";
import StatusBadge from "../components/StatusBadge.jsx";

export default function CandidateProfile() {
  const { id } = useParams();
  const [candidate, setCandidate] = useState(null);
  const [savingStatus, setSavingStatus] = useState("");

  async function loadCandidate() {
    const res = await api.get(`/candidates/${id}`);
    setCandidate(res.data);
  }

  useEffect(() => {
    loadCandidate();
  }, [id]);

  async function updateStatus(status) {
    setSavingStatus(`Updating status to ${status}...`);
    await api.put(`/candidates/${id}/status`, { status });
    await loadCandidate();
    setSavingStatus(`Status updated to ${status}`);
  }

  if (!candidate) return <p className="muted">Loading candidate...</p>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
        <div>
          <h1 className="page-title">{candidate.candidateName}</h1>
          <p className="muted">{candidate.email || "No email"} • {candidate.phone || "No phone"}</p>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Applied for: {candidate.jobId?.title}</p>
        </div>

        <div className="flex gap-2">
          <button onClick={() => updateStatus("Shortlisted")} className="btn-secondary text-emerald-700">Shortlist</button>
          <button onClick={() => updateStatus("Rejected")} className="btn-secondary text-red-700">Reject</button>
          <button onClick={() => updateStatus("Interview")} className="btn-secondary text-blue-700">Interview</button>
        </div>
      </div>

      {savingStatus && (
        <div className="card p-3">
          <p className="text-sm text-slate-600 dark:text-slate-300">{savingStatus}</p>
        </div>
      )}

      <div className="grid md:grid-cols-3 gap-4">
        <div className="card p-5">
          <p className="text-sm text-slate-500 dark:text-slate-400">ATS Score</p>
          <div className="mt-2"><ScoreBadge score={candidate.atsScore} /></div>
        </div>

        <div className="card p-5">
          <p className="text-sm text-slate-500 dark:text-slate-400">AI Recommendation</p>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-1">{candidate.recommendation}</h2>
        </div>

        <div className="card p-5">
          <p className="text-sm text-slate-500 dark:text-slate-400">Recruiter Status</p>
          <div className="mt-2"><StatusBadge status={candidate.status} /></div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="card p-5">
          <h2 className="font-semibold text-slate-900 dark:text-white">Matched Skills</h2>
          <div className="flex flex-wrap gap-2 mt-3">
            {candidate.matchedSkills?.length === 0 && <p className="text-sm text-slate-500 dark:text-slate-400">No matched skills found.</p>}
            {candidate.matchedSkills?.map((skill) => (
              <span key={skill} className="px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-300 text-sm">{skill}</span>
            ))}
          </div>
        </div>

        <div className="card p-5">
          <h2 className="font-semibold text-slate-900 dark:text-white">Missing Skills</h2>
          <div className="flex flex-wrap gap-2 mt-3">
            {candidate.missingSkills?.length === 0 && <p className="text-sm text-slate-500 dark:text-slate-400">No missing skills found.</p>}
            {candidate.missingSkills?.map((skill) => (
              <span key={skill} className="px-3 py-1 rounded-full bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-300 text-sm">{skill}</span>
            ))}
          </div>
        </div>
      </div>

      <div className="card p-5">
        <h2 className="font-semibold text-slate-900 dark:text-white">AI Summary</h2>
        <p className="text-sm text-slate-600 dark:text-slate-300 mt-3 whitespace-pre-line">{candidate.aiSummary}</p>
      </div>

      <div className="card p-5">
        <h2 className="font-semibold text-slate-900 dark:text-white">Extracted Resume Text</h2>
        <p className="text-sm text-slate-600 dark:text-slate-300 mt-3 max-h-96 overflow-auto whitespace-pre-line">
          {candidate.resumeText || "Resume text not available."}
        </p>
      </div>
    </div>
  );
}
