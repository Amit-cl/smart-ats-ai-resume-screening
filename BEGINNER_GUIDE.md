# Beginner Guide – Smart ATS

## Main Flow

Login → Create Job → Open Job → Upload Resume → AI Score → Ranking → Shortlist/Reject

## Why jobId is important?

Every candidate has a `jobId`.

```js
{
  candidateName: "Amit Kumar",
  jobId: "frontend_job_id",
  atsScore: 82
}
```

This keeps candidates separate job-wise.

## Backend Files

```txt
Backend/server.js
Main backend start file.

Backend/src/models/
MongoDB schemas.

Backend/src/controllers/
Main logic.

Backend/src/routes/
API routes.

Backend/src/services/groqService.js
AI resume matching logic.
```

## Frontend Files

```txt
Frontend/src/pages/
All screens.

Frontend/src/components/
Reusable UI components.

Frontend/src/api/api.js
Axios setup.

Frontend/src/context/ThemeContext.jsx
Light/Dark mode logic.
```
