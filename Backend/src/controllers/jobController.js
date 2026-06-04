import Job from "../models/Job.js";
import Candidate from "../models/Candidate.js";

export async function createJob(req, res) {
  const {
    title,
    department,
    requiredSkills,
    experience,
    location,
    employmentType,
    salaryRange,
    jobDescription
  } = req.body;

  if (!title || !jobDescription) {
    res.status(400);
    throw new Error("Job title and job description are required");
  }

  const skillsArray = Array.isArray(requiredSkills)
    ? requiredSkills
    : String(requiredSkills || "")
        .split(",")
        .map(skill => skill.trim())
        .filter(Boolean);

  const job = await Job.create({
    recruiterId: req.user._id,
    title,
    department,
    requiredSkills: skillsArray,
    experience,
    location,
    employmentType,
    salaryRange,
    jobDescription
  });

  res.status(201).json(job);
}

export async function getJobs(req, res) {
  const jobs = await Job.find({ recruiterId: req.user._id }).sort({ createdAt: -1 });

  const jobsWithCounts = await Promise.all(
    jobs.map(async job => {
      const candidateCount = await Candidate.countDocuments({ jobId: job._id });
      return { ...job.toObject(), candidateCount };
    })
  );

  res.json(jobsWithCounts);
}

export async function getJobById(req, res) {
  const job = await Job.findOne({
    _id: req.params.id,
    recruiterId: req.user._id
  });

  if (!job) {
    res.status(404);
    throw new Error("Job not found");
  }

  const candidates = await Candidate.find({ jobId: job._id }).sort({ atsScore: -1 });

  const avgScore = candidates.length
    ? Math.round(candidates.reduce((sum, c) => sum + c.atsScore, 0) / candidates.length)
    : 0;

  res.json({
    ...job.toObject(),
    candidateCount: candidates.length,
    averageScore: avgScore
  });
}

export async function updateJob(req, res) {
  const job = await Job.findOne({
    _id: req.params.id,
    recruiterId: req.user._id
  });

  if (!job) {
    res.status(404);
    throw new Error("Job not found");
  }

  Object.assign(job, req.body);

  if (req.body.requiredSkills && !Array.isArray(req.body.requiredSkills)) {
    job.requiredSkills = String(req.body.requiredSkills)
      .split(",")
      .map(skill => skill.trim())
      .filter(Boolean);
  }

  const updatedJob = await job.save();
  res.json(updatedJob);
}

export async function deleteJob(req, res) {
  const job = await Job.findOne({
    _id: req.params.id,
    recruiterId: req.user._id
  });

  if (!job) {
    res.status(404);
    throw new Error("Job not found");
  }

  await Candidate.deleteMany({ jobId: job._id });
  await job.deleteOne();

  res.json({ message: "Job and related candidates deleted" });
}

export async function getDashboardStats(req, res) {
  const recruiterId = req.user._id;

  const totalJobs = await Job.countDocuments({ recruiterId });
  const totalCandidates = await Candidate.countDocuments({ recruiterId });
  const shortlisted = await Candidate.countDocuments({ recruiterId, status: "Shortlisted" });
  const rejected = await Candidate.countDocuments({ recruiterId, status: "Rejected" });
  const interview = await Candidate.countDocuments({ recruiterId, status: "Interview" });

  const candidates = await Candidate.find({ recruiterId });
  const averageScore = candidates.length
    ? Math.round(candidates.reduce((sum, c) => sum + c.atsScore, 0) / candidates.length)
    : 0;

  const recentJobs = await Job.find({ recruiterId }).sort({ createdAt: -1 }).limit(5);
  const recentCandidates = await Candidate.find({ recruiterId })
    .populate("jobId", "title")
    .sort({ createdAt: -1 })
    .limit(5);

  res.json({
    totalJobs,
    totalCandidates,
    shortlisted,
    rejected,
    interview,
    averageScore,
    recentJobs,
    recentCandidates
  });
}
