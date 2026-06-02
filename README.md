# Smart ATS – AI-Powered Applicant Tracking System

Beginner-friendly full-stack Smart ATS project.

## Folders

```txt
Frontend  -> React + Vite + Tailwind
Backend   -> Node.js + Express + MongoDB
```

## Core Flow

Recruiter Login / Signup  
→ Create Job  
→ Open Job Details  
→ Upload single/bulk PDF resumes inside selected job  
→ Backend extracts resume text using pdf-parse  
→ Groq AI compares resume with job description  
→ MongoDB saves candidate with jobId  
→ Frontend shows job-wise candidate ranking  
→ Recruiter marks candidate as Review / Shortlisted / Rejected / Interview

## MVP Features

- Login / Signup
- Dashboard
- Jobs
- Create Job
- Job Details
- Inline resume upload inside Job Details
- Upload progress/status feedback
- Candidates page with job/status filters
- Candidate Profile
- Recruiter Profile
- Light / Dark mode
- Clear candidates only for selected job
- Groq AI scoring with fallback logic

## Backend Setup

```bash
cd Backend
npm install
```

Create `.env` inside `Backend/`:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/smart_ats
JWT_SECRET=mysecret123
CLIENT_URL=http://localhost:5173
GROQ_API_KEY=your_groq_key_here
GROQ_MODEL=llama-3.3-70b-versatile
```

Run backend:

```bash
npm run dev
```

Expected:

```txt
Server running on port 5000
MongoDB connected: 127.0.0.1
```

## Frontend Setup

```bash
cd Frontend
npm install
```

Create `.env` inside `Frontend/`:

```env
VITE_API_URL=http://localhost:5000/api
```

Run frontend:

```bash
npm run dev
```

Open:

```txt
http://localhost:5173
```

## Interview Line

I designed the database in a job-centric way. Every uploaded candidate resume is linked with a specific jobId, so candidate ranking is generated separately for each job opening and old candidate data does not mix with new comparisons.
