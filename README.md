
# Smart ATS - AI Resume Screening System

Smart ATS is a full-stack web application that I am building to make resume screening easier for recruiters.

The basic idea is that a recruiter can create a job, upload resumes for that job, and the system will compare each resume with the job description. After comparison, it gives an ATS score, matched skills, missing skills, a short summary, and a recommendation.

I started this project because resume screening is a common problem in recruitment. When many candidates apply for one job, checking every resume manually takes time. This project tries to reduce that manual work by using AI for the first level of screening.

## Current Status

This project is currently in progress.

Right now, I have mainly worked on the backend part. The backend includes authentication, job management, candidate management, resume upload, PDF text extraction, MongoDB models, and AI-based resume matching.

Frontend work will be improved step by step after the backend flow is stable.

## Main Project Flow

```txt
Recruiter creates a job
→ Recruiter uploads resume PDF for that job
→ Backend extracts text from the resume
→ AI compares resume text with job description
→ ATS score is generated
→ Candidate is saved under that job
→ Recruiter can review, shortlist, reject, or move candidate to interview
````

## API Overview

### Auth APIs

```txt
POST /api/auth/register
POST /api/auth/login
GET  /api/auth/me
```

### Job APIs

```txt
POST   /api/jobs
GET    /api/jobs
GET    /api/jobs/:id
PUT    /api/jobs/:id
DELETE /api/jobs/:id
```

### Candidate APIs

```txt
POST /api/jobs/:jobId/upload-resumes
GET  /api/jobs/:jobId/candidates
GET  /api/candidates
GET  /api/candidates/:id
PUT  /api/candidates/:id/status
```

## Database Collections

### User

Stores recruiter account details.

```js
{
  name,
  email,
  password,
  role
}
```

### Job

Stores job details created by recruiter.

```js
{
  recruiterId,
  title,
  department,
  requiredSkills,
  experience,
  location,
  employmentType,
  salaryRange,
  jobDescription,
  status
}
```

### Candidate

Stores resume analysis and candidate details.

```js
{
  jobId,
  recruiterId,
  candidateName,
  email,
  phone,
  resumeText,
  atsScore,
  matchedSkills,
  missingSkills,
  aiSummary,
  recommendation,
  status
}
```

## What I Learned

While working on this project, I learned and practiced:

* How to structure a MERN-style full-stack project
* How authentication works using JWT
* How to design MongoDB schemas
* How to upload files using Multer
* How to extract text from PDF resumes
* How to connect an AI API with backend logic
* How to store candidates job-wise using jobId
* How to build APIs for real recruiter workflows

## Future Work

* Complete frontend UI
* Connect frontend with all backend APIs
* Add candidate profile page
* Add resume preview
* Add better filters and sorting
* Add dashboard analytics
* Add deployment
* Improve AI scoring logic

## Note

This project is still under development. I am building it step by step, starting with the backend workflow first and then improving the frontend and user experience.

## Author

Amit Kumar


