import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Jobs from "./pages/Jobs.jsx";
import CreateJob from "./pages/CreateJob.jsx";
import JobDetails from "./pages/JobDetails.jsx";
import CandidateProfile from "./pages/CandidateProfile.jsx";
import Candidates from "./pages/Candidates.jsx";
import Profile from "./pages/Profile.jsx";
import Layout from "./components/Layout.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="jobs" element={<Jobs />} />
        <Route path="jobs/create" element={<CreateJob />} />
        <Route path="jobs/:id" element={<JobDetails />} />
        <Route path="candidates" element={<Candidates />} />
        <Route path="candidates/:id" element={<CandidateProfile />} />
        <Route path="profile" element={<Profile />} />
      </Route>
    </Routes>
  );
}
