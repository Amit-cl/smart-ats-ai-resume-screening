import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/api.js";
import { saveAuth } from "../utils/auth.js";

export default function Signup() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    try {
      const res = await api.post("/auth/register", form);
      saveAuth(res.data.user, res.data.token);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed");
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-6">
      <div className="card w-full max-w-md p-8">
        <h1 className="page-title">Create recruiter account</h1>
        <p className="muted mt-2">Start screening resumes with AI.</p>

        {error && <p className="mt-4 text-sm text-red-600 bg-red-50 p-3 rounded-xl">{error}</p>}

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="label">Name</label>
            <input className="input mt-1" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </div>

          <div>
            <label className="label">Email</label>
            <input className="input mt-1" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          </div>

          <div>
            <label className="label">Password</label>
            <input type="password" className="input mt-1" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
          </div>

          <button className="btn-primary w-full">Create Account</button>
        </form>

        <p className="text-sm text-slate-500 dark:text-slate-400 mt-6">
          Already have account? <Link to="/login" className="text-slate-900 dark:text-white font-medium">Login</Link>
        </p>
      </div>
    </div>
  );
}
