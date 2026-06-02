import pdfParse from "pdf-parse";
import Job from "../models/Job.js";
import Candidate from "../models/Candidate.js";
import { analyzeResumeWithGroq } from "../services/groqService.js";

export async function uploadResumes(req, res) {
  const { jobId } = req.params;

  const job = await Job.findOne({
    _id: jobId,
    recruiterId: req.user._id
  });

  if (!job) {
    res.status(404);
    throw new Error("Job not found");
  }

  if (!req.files || req.files.length === 0) {
    res.status(400);
    throw new Error("Please upload at least one PDF resume");
  }

  const results = [];

  for (const file of req.files) {
    try {
      const pdfData = await pdfParse(file.buffer);
      const resumeText = pdfData.text || "";

      const aiResult = await analyzeResumeWithGroq(job, resumeText, file.originalname);

      const candidate = await Candidate.create({
        jobId: job._id,
        recruiterId: req.user._id,
        candidateName: aiResult.candidateName,
        email: aiResult.email,
        phone: aiResult.phone,
        resumeFileName: file.originalname,
        resumeText,
        atsScore: aiResult.atsScore,
        matchPercentage: aiResult.matchPercentage,
        matchedSkills: aiResult.matchedSkills,
        missingSkills: aiResult.missingSkills,
        aiSummary: aiResult.aiSummary,
        recommendation: aiResult.recommendation,
        status: "Review"
      });

      results.push({
        fileName: file.originalname,
        status: "Completed",
        candidate
      });
    } catch (error) {
      results.push({
        fileName: file.originalname,
        status: "Failed",
        error: error.message
      });
    }
  }

  res.status(201).json({
    message: "Resume processing completed",
    results
  });
}

export async function getCandidatesByJob(req, res) {
  const { jobId } = req.params;

  const job = await Job.findOne({
    _id: jobId,
    recruiterId: req.user._id
  });

  if (!job) {
    res.status(404);
    throw new Error("Job not found");
  }

  const candidates = await Candidate.find({ jobId }).sort({ atsScore: -1 });
  res.json(candidates);
}

export async function getAllCandidates(req, res) {
  const filter = { recruiterId: req.user._id };

  if (req.query.jobId && req.query.jobId !== "all") {
    filter.jobId = req.query.jobId;
  }

  if (req.query.status && req.query.status !== "all") {
    filter.status = req.query.status;
  }

  const candidates = await Candidate.find(filter)
    .populate("jobId", "title")
    .sort({ createdAt: -1 });

  res.json(candidates);
}

export async function getCandidateById(req, res) {
  const candidate = await Candidate.findOne({
    _id: req.params.id,
    recruiterId: req.user._id
  }).populate("jobId", "title requiredSkills jobDescription");

  if (!candidate) {
    res.status(404);
    throw new Error("Candidate not found");
  }

  res.json(candidate);
}

export async function updateCandidateStatus(req, res) {
  const { status } = req.body;
  const allowedStatus = ["Review", "Shortlisted", "Rejected", "Interview"];

  if (!allowedStatus.includes(status)) {
    res.status(400);
    throw new Error("Invalid status");
  }

  const candidate = await Candidate.findOne({
    _id: req.params.id,
    recruiterId: req.user._id
  });

  if (!candidate) {
    res.status(404);
    throw new Error("Candidate not found");
  }

  candidate.status = status;
  await candidate.save();

  res.json(candidate);
}

export async function clearCandidatesForJob(req, res) {
  const { jobId } = req.params;

  const job = await Job.findOne({
    _id: jobId,
    recruiterId: req.user._id
  });

  if (!job) {
    res.status(404);
    throw new Error("Job not found");
  }

  const result = await Candidate.deleteMany({
    jobId,
    recruiterId: req.user._id
  });

  res.json({
    message: "Candidates cleared for this job",
    deletedCount: result.deletedCount
  });
}
