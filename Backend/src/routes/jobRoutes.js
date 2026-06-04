import express from "express";
import {
  createJob,
  getJobs,
  getJobById,
  updateJob,
  deleteJob,
  getDashboardStats
} from "../controllers/jobController.js";

import {
  uploadResumes,
  getCandidatesByJob,
  clearCandidatesForJob
} from "../controllers/candidateController.js";

import { protect } from "../middleware/authMiddleware.js";
import { upload } from "../middleware/uploadMiddleware.js";

const router = express.Router();

router.get("/stats/dashboard", protect, getDashboardStats);

router.route("/")
  .post(protect, createJob)
  .get(protect, getJobs);

router.route("/:id")
  .get(protect, getJobById)
  .put(protect, updateJob)
  .delete(protect, deleteJob);

router.post("/:jobId/upload-resumes", protect, upload.array("resumes", 20), uploadResumes);
router.get("/:jobId/candidates", protect, getCandidatesByJob);
router.delete("/:jobId/candidates", protect, clearCandidatesForJob);

export default router;
