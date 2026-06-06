import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/api.js";
import ScoreBadge from "../components/ScoreBadge.jsx";
import StatusBadge from "../components/StatusBadge.jsx";

export default function Candidates() {
  const [jobs, setJobs] = useState([]);
  const [candidates, setCandidates] = useState([]);
  const [selectedJob, setSelectedJob] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [loading, setLoading] = useState(false);

  async function loadJobs() {
    const res = await api.get("/jobs");
    setJobs(res.data);
  }

  async function loadCandidates() {
    setLoading(true);

    try {
      const res = await api.get("/candidates", {
        params: { jobId: selectedJob, status: selectedStatus }
      });

      setCandidates(res.data);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadJobs();
  }, []);

  useEffect(() => {
    loadCandidates();
  }, [selectedJob, selectedStatus]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="page-title">Candidates</h1>
        <p className="muted">
          All candidates in one place. Use filters to avoid mixing old and new hiring data.
        </p>
      </div>

      <div className="card p-4 flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <label className="label">Filter by Job</label>
          <select className="input mt-1" value={selectedJob} onChange={(e) => setSelectedJob(e.target.value)}>
            <option value="all">All Jobs</option>
            {jobs.map((job) => (
              <option key={job._id} value={job._id}>{job.title}</option>
            ))}
          </select>
        </div>

        <div className="flex-1">
          <label className="label">Filter by Status</label>
          <select className="input mt-1" value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)}>
            <option value="all">All Status</option>
            <option value="Review">Review</option>
            <option value="Shortlisted">Shortlisted</option>
            <option value="Rejected">Rejected</option>
            <option value="Interview">Interview</option>
          </select>
        </div>
      </div>

      {loading && (
        <div className="card p-4">
          <p className="text-sm text-slate-600 dark:text-slate-300">Updating candidate list...</p>
          <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full mt-3 overflow-hidden">
            <div className="h-full w-2/3 bg-slate-900 dark:bg-white rounded-full animate-pulse" />
          </div>
        </div>
      )}

      <div className="card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
            <tr>
              <th className="text-left p-4 text-slate-600 dark:text-slate-300">Candidate</th>
              <th className="text-left p-4 text-slate-600 dark:text-slate-300">Job Applied</th>
              <th className="text-left p-4 text-slate-600 dark:text-slate-300">Score</th>
              <th className="text-left p-4 text-slate-600 dark:text-slate-300">Recommendation</th>
              <th className="text-left p-4 text-slate-600 dark:text-slate-300">Status</th>
              <th className="text-right p-4 text-slate-600 dark:text-slate-300">Action</th>
            </tr>
          </thead>

          <tbody>
            {candidates.length === 0 && (
              <tr>
                <td colSpan="6" className="p-8 text-center text-slate-500 dark:text-slate-400">
                  No candidates found for selected filters.
                </td>
              </tr>
            )}

            {candidates.map((candidate) => (
              <tr key={candidate._id} className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50">
                <td className="p-4">
                  <p className="font-medium text-slate-900 dark:text-white">{candidate.candidateName}</p>
                  <p className="text-slate-500 dark:text-slate-400">{candidate.email || "No email found"}</p>
                </td>

                <td className="p-4 text-slate-600 dark:text-slate-300">
                  {candidate.jobId?.title || "Job not found"}
                </td>

                <td className="p-4">
                  <ScoreBadge score={candidate.atsScore} />
                </td>

                <td className="p-4 text-slate-600 dark:text-slate-300">
                  {candidate.recommendation}
                </td>

                <td className="p-4">
                  <StatusBadge status={candidate.status} />
                </td>

                <td className="p-4 text-right">
                  <Link to={`/candidates/${candidate._id}`} className="btn-secondary">
                    View Profile
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
