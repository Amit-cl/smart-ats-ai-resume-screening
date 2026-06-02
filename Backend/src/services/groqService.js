import Groq from "groq-sdk";
import { parseJsonFromText } from "../utils/parseJson.js";

function fallbackResumeAnalysis(job, resumeText, fileName = "") {
  const requiredSkills = job.requiredSkills || [];
  const lowerResume = resumeText.toLowerCase();

  const matchedSkills = requiredSkills.filter(skill =>
    lowerResume.includes(skill.toLowerCase())
  );

  const missingSkills = requiredSkills.filter(skill =>
    !lowerResume.includes(skill.toLowerCase())
  );

  const score = requiredSkills.length
    ? Math.round((matchedSkills.length / requiredSkills.length) * 100)
    : 50;

  let recommendation = "Review";
  if (score >= 75) recommendation = "Shortlist";
  if (score < 45) recommendation = "Reject";

  return {
    candidateName: fileName.replace(".pdf", "") || "Unknown Candidate",
    email: "",
    phone: "",
    atsScore: score,
    matchPercentage: score,
    matchedSkills,
    missingSkills,
    aiSummary: "Fallback analysis generated from required skills because AI response was unavailable.",
    recommendation
  };
}

export async function analyzeResumeWithGroq(job, resumeText, fileName = "") {
  if (!process.env.GROQ_API_KEY) {
    return fallbackResumeAnalysis(job, resumeText, fileName);
  }

  try {
    const groq = new Groq({
      apiKey: process.env.GROQ_API_KEY
    });

    const prompt = `
Compare this resume with the given job description.

Job Title: ${job.title}
Department: ${job.department || "Not specified"}
Experience Required: ${job.experience || "Not specified"}
Required Skills: ${(job.requiredSkills || []).join(", ")}
Job Description:
${job.jobDescription}

Resume Text:
${resumeText}

Return only valid JSON. Do not add markdown. Do not add explanation.

JSON format:
{
  "candidateName": "",
  "email": "",
  "phone": "",
  "atsScore": 0,
  "matchPercentage": 0,
  "matchedSkills": [],
  "missingSkills": [],
  "aiSummary": "",
  "recommendation": "Shortlist"
}

Rules:
- atsScore must be a number between 0 and 100.
- recommendation must be one of: "Shortlist", "Review", "Reject".
- Use "Review" if unsure.
`;

    const completion = await groq.chat.completions.create({
      model: process.env.GROQ_MODEL || "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content: "You are a professional ATS resume screening assistant. Return only valid JSON."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.2
    });

    const aiText = completion.choices[0].message.content;
    const parsed = parseJsonFromText(aiText);

    return {
      candidateName: parsed.candidateName || fileName.replace(".pdf", "") || "Unknown Candidate",
      email: parsed.email || "",
      phone: parsed.phone || "",
      atsScore: Number(parsed.atsScore) || 0,
      matchPercentage: Number(parsed.matchPercentage || parsed.atsScore) || 0,
      matchedSkills: Array.isArray(parsed.matchedSkills) ? parsed.matchedSkills : [],
      missingSkills: Array.isArray(parsed.missingSkills) ? parsed.missingSkills : [],
      aiSummary: parsed.aiSummary || "AI summary not available.",
      recommendation: ["Shortlist", "Review", "Reject"].includes(parsed.recommendation)
        ? parsed.recommendation
        : "Review"
    };
  } catch (error) {
    console.log("Groq failed, using fallback:", error.message);
    return fallbackResumeAnalysis(job, resumeText, fileName);
  }
}
