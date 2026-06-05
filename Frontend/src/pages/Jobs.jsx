import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/api.js";
import StatusBadge from "../components/StatusBadge.jsx";

export default function Jobs() {
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    async function loadJobs() {
      const res = await api.get("/jobs");
      setJobs(res.data);
    }
    loadJobs();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="page-title">Jobs</h1>
          <p className="muted">Create jobs and manage job-wise candidate ranking.</p>
        </div>
        <Link to="/jobs/create" className="btn-primary">Create Job</Link>
      </div>

      <div className="card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-800">
            <tr>
              <th className="text-left p-4 font-semibold text-slate-600 dark:text-slate-300">Job Title</th>
              <th className="text-left p-4 font-semibold text-slate-600 dark:text-slate-300">Skills</th>
              <th className="text-left p-4 font-semibold text-slate-600 dark:text-slate-300">Candidates</th>
              <th className="text-left p-4 font-semibold text-slate-600 dark:text-slate-300">Status</th>
              <th className="text-right p-4 font-semibold text-slate-600 dark:text-slate-300">Action</th>
            </tr>
          </thead>
          <tbody>
            {jobs.length === 0 && (
              <tr>
                <td colSpan="5" className="p-8 text-center text-slate-500 dark:text-slate-400">
                  No jobs yet. Create your first job to start uploading resumes.
                </td>
              </tr>
            )}

            {jobs.map((job) => (
              <tr key={job._id} className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50">
                <td className="p-4">
                  <p className="font-medium text-slate-900 dark:text-white">{job.title}</p>
                  <p className="text-slate-500 dark:text-slate-400">{job.location || "No location"}</p>
                </td>
                <td className="p-4 text-slate-600 dark:text-slate-300">{job.requiredSkills?.slice(0, 3).join(", ")}</td>
                <td className="p-4 text-slate-600 dark:text-slate-300">{job.candidateCount}</td>
                <td className="p-4"><StatusBadge status={job.status} /></td>
                <td className="p-4 text-right">
                  <Link to={`/jobs/${job._id}`} className="btn-secondary">View</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
