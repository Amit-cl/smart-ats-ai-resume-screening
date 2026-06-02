import mongoose from "mongoose";

const candidateSchema = new mongoose.Schema(
  {
    jobId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      required: true
    },
    recruiterId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    candidateName: { type: String, default: "Unknown Candidate" },
    email: { type: String, default: "" },
    phone: { type: String, default: "" },
    resumeFileName: { type: String, default: "" },
    resumeText: { type: String, default: "" },
    atsScore: { type: Number, default: 0 },
    matchPercentage: { type: Number, default: 0 },
    matchedSkills: { type: [String], default: [] },
    missingSkills: { type: [String], default: [] },
    aiSummary: { type: String, default: "" },
    recommendation: {
      type: String,
      enum: ["Shortlist", "Review", "Reject"],
      default: "Review"
    },
    status: {
      type: String,
      enum: ["Review", "Shortlisted", "Rejected", "Interview"],
      default: "Review"
    }
  },
  { timestamps: true }
);

export default mongoose.model("Candidate", candidateSchema);
