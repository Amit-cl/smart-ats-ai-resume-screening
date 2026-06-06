import { Mail, ShieldCheck, UserRound } from "lucide-react";
import { getUser } from "../utils/auth.js";
import { useTheme } from "../context/ThemeContext.jsx";

export default function Profile() {
  const user = getUser();
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <h1 className="page-title">Recruiter Profile</h1>
        <p className="muted">
          Basic account information and display preference.
        </p>
      </div>

      <div className="card p-6">
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 flex items-center justify-center">
            <UserRound size={28} />
          </div>

          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">{user?.name || "Recruiter"}</h2>
            <p className="text-slate-500 dark:text-slate-400">Talent Acquisition Workspace</p>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="card p-5">
          <div className="flex items-center gap-3">
            <Mail className="text-slate-500 dark:text-slate-400" />
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">Email</p>
              <h3 className="font-semibold text-slate-900 dark:text-white">{user?.email || "No email"}</h3>
            </div>
          </div>
        </div>

        <div className="card p-5">
          <div className="flex items-center gap-3">
            <ShieldCheck className="text-slate-500 dark:text-slate-400" />
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">Role</p>
              <h3 className="font-semibold text-slate-900 dark:text-white">{user?.role || "recruiter"}</h3>
            </div>
          </div>
        </div>
      </div>

      <div className="card p-5">
        <h2 className="font-semibold text-slate-900 dark:text-white">Appearance</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Choose the mode you are comfortable working in.
        </p>

        <div className="mt-4 flex items-center justify-between border border-slate-200 dark:border-slate-800 rounded-xl p-4">
          <div>
            <p className="font-medium text-slate-900 dark:text-white">Current Mode</p>
            <p className="text-sm text-slate-500 dark:text-slate-400 capitalize">{theme} mode</p>
          </div>

          <button onClick={toggleTheme} className="btn-secondary">
            Switch to {theme === "dark" ? "Light" : "Dark"}
          </button>
        </div>
      </div>

      <div className="card p-5">
        <h2 className="font-semibold text-slate-900 dark:text-white">Project Note</h2>
        <p className="text-sm text-slate-600 dark:text-slate-300 mt-2">
          This profile page is intentionally simple for MVP. Advanced team settings,
          notifications, and company management can be added later as future enhancements.
        </p>
      </div>
    </div>
  );
}
