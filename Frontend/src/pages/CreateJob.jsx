import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api.js";

export default function CreateJob() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: "",
    department: "",
    requiredSkills: "",
    experience: "",
    location: "",
    employmentType: "Full-time",
    salaryRange: "",
    jobDescription: ""
  });

  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSaving(true);

    try {
      const res = await api.post("/jobs", form);
      navigate(`/jobs/${res.data._id}`);
    } catch (err) {
      setError(err.response?.data?.message || "Job creation failed");
    } finally {
      setSaving(false);
    }
  }

  function updateField(name, value) {
    setForm({ ...form, [name]: value });
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="page-title">Create Job</h1>
        <p className="muted">Add job description and required skills for AI matching.</p>
      </div>

      <form onSubmit={handleSubmit} className="card p-6 space-y-5">
        {error && <p className="text-sm text-red-600 bg-red-50 p-3 rounded-xl">{error}</p>}

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="label">Job Title *</label>
            <input className="input mt-1" value={form.title} onChange={(e) => updateField("title", e.target.value)} />
          </div>

          <div>
            <label className="label">Department</label>
            <input className="input mt-1" value={form.department} onChange={(e) => updateField("department", e.target.value)} />
          </div>

          <div>
            <label className="label">Required Skills</label>
            <input className="input mt-1" placeholder="React, JavaScript, Tailwind" value={form.requiredSkills} onChange={(e) => updateField("requiredSkills", e.target.value)} />
          </div>

          <div>
            <label className="label">Experience</label>
            <input className="input mt-1" placeholder="0-2 years" value={form.experience} onChange={(e) => updateField("experience", e.target.value)} />
          </div>

          <div>
            <label className="label">Location</label>
            <input className="input mt-1" placeholder="Noida / Remote" value={form.location} onChange={(e) => updateField("location", e.target.value)} />
          </div>

          <div>
            <label className="label">Salary Range</label>
            <input className="input mt-1" placeholder="3-5 LPA" value={form.salaryRange} onChange={(e) => updateField("salaryRange", e.target.value)} />
          </div>
        </div>

        <div>
          <label className="label">Job Description *</label>
          <textarea rows="7" className="input mt-1" value={form.jobDescription} onChange={(e) => updateField("jobDescription", e.target.value)} />
        </div>

        <button disabled={saving} className="btn-primary">
          {saving ? "Creating..." : "Create Job"}
        </button>
      </form>
    </div>
  );
}
