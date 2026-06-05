import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Briefcase, Users, CheckCircle, XCircle, BarChart3 } from "lucide-react";
import api from "../api/api.js";
import ScoreBadge from "../components/ScoreBadge.jsx";
import StatusBadge from "../components/StatusBadge.jsx";

export default function Dashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    async function loadStats() {
      const res = await api.get("/jobs/stats/dashboard");
      setStats(res.data);
    }
    loadStats();
  }, []);

  if (!stats) return <p className="muted">Loading dashboard...</p>;

  const cards = [
    { label: "Total Jobs", value: stats.totalJobs, icon: Briefcase },
    { label: "Total Candidates", value: stats.totalCandidates, icon: Users },
    { label: "Shortlisted", value: stats.shortlisted, icon: CheckCircle },
    { label: "Rejected", value: stats.rejected, icon: XCircle },
    { label: "Average ATS Score", value: `${stats.averageScore}%`, icon: BarChart3 }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p className="muted">Quick overview of hiring activity.</p>
        </div>
        <Link to="/jobs/create" className="btn-primary">Create Job</Link>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.label} className="card p-5">
              <div className="h-10 w-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-700 dark:text-slate-200">
                <Icon size={20} />
              </div>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-4">{card.label}</p>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{card.value}</h2>
            </div>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="card p-5">
          <h2 className="font-semibold text-slate-900 dark:text-white mb-4">Recent Jobs</h2>
          <div className="space-y-3">
            {stats.recentJobs.length === 0 && <p className="text-sm text-slate-500 dark:text-slate-400">No jobs created yet.</p>}
            {stats.recentJobs.map((job) => (
              <Link key={job._id} to={`/jobs/${job._id}`} className="block border border-slate-200 dark:border-slate-800 rounded-xl p-3 hover:bg-slate-50 dark:hover:bg-slate-800/50">
                <div className="flex items-center justify-between">
                  <p className="font-medium text-slate-900 dark:text-white">{job.title}</p>
                  <StatusBadge status={job.status} />
                </div>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{job.location || "Location not specified"}</p>
              </Link>
            ))}
          </div>
        </div>

        <div className="card p-5">
          <h2 className="font-semibold text-slate-900 dark:text-white mb-4">Recent Candidates</h2>
          <div className="space-y-3">
            {stats.recentCandidates.length === 0 && <p className="text-sm text-slate-500 dark:text-slate-400">No resumes uploaded yet.</p>}
            {stats.recentCandidates.map((candidate) => (
              <Link key={candidate._id} to={`/candidates/${candidate._id}`} className="block border border-slate-200 dark:border-slate-800 rounded-xl p-3 hover:bg-slate-50 dark:hover:bg-slate-800/50">
                <div className="flex items-center justify-between">
                  <p className="font-medium text-slate-900 dark:text-white">{candidate.candidateName}</p>
                  <ScoreBadge score={candidate.atsScore} />
                </div>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{candidate.jobId?.title || "Job removed"}</p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
