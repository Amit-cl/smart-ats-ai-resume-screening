import express from "express";
import {
  getAllCandidates,
  getCandidateById,
  updateCandidateStatus
} from "../controllers/candidateController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", protect, getAllCandidates);
router.get("/:id", protect, getCandidateById);
router.put("/:id/status", protect, updateCandidateStatus);

export default router;
