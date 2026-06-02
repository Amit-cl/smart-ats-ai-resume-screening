import mongoose from "mongoose";

const jobSchema = new mongoose.Schema(
  {
    recruiterId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    title: { type: String, required: true, trim: true },
    department: { type: String, trim: true },
    requiredSkills: { type: [String], default: [] },
    experience: { type: String, trim: true },
    location: { type: String, trim: true },
    employmentType: { type: String, default: "Full-time" },
    salaryRange: { type: String, trim: true },
    jobDescription: { type: String, required: true },
    status: {
      type: String,
      enum: ["Active", "Closed"],
      default: "Active"
    }
  },
  { timestamps: true }
);

export default mongoose.model("Job", jobSchema);
