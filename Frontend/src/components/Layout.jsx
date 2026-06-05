import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { Briefcase, LayoutDashboard, LogOut, Moon, Sparkles, Sun, UserRound, Users } from "lucide-react";
import { getUser, logout } from "../utils/auth.js";
import { useTheme } from "../context/ThemeContext.jsx";

export default function Layout() {
  const navigate = useNavigate();
  const user = getUser();
  const { theme, toggleTheme } = useTheme();

  function handleLogout() {
    logout();
    navigate("/login");
  }

  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium ${
      isActive
        ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900"
        : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
    }`;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex">
      <aside className="w-72 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 p-5 hidden md:flex md:flex-col">
        <div className="flex items-center gap-3 mb-8">
          <div className="h-10 w-10 rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 flex items-center justify-center">
            <Sparkles size={20} />
          </div>
          <div>
            <h1 className="font-bold text-slate-900 dark:text-white">Smart ATS</h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">AI Resume Screening</p>
          </div>
        </div>

        <nav className="space-y-2 flex-1">
          <NavLink to="/dashboard" className={linkClass}>
            <LayoutDashboard size={18} />
            Dashboard
          </NavLink>

          <NavLink to="/jobs" className={linkClass}>
            <Briefcase size={18} />
            Jobs
          </NavLink>

          <NavLink to="/candidates" className={linkClass}>
            <Users size={18} />
            Candidates
          </NavLink>

          <NavLink to="/profile" className={linkClass}>
            <UserRound size={18} />
            Profile
          </NavLink>
        </nav>

        <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-xl">
          <LogOut size={18} />
          Logout
        </button>
      </aside>

      <main className="flex-1">
        <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-6 py-4 flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-500 dark:text-slate-400">Welcome back</p>
            <h2 className="font-semibold text-slate-900 dark:text-white">{user?.name || "Recruiter"}</h2>
          </div>

          <button onClick={toggleTheme} className="btn-secondary flex items-center gap-2">
            {theme === "dark" ? <Sun size={17} /> : <Moon size={17} />}
            {theme === "dark" ? "Light Mode" : "Dark Mode"}
          </button>
        </header>

        <div className="p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
