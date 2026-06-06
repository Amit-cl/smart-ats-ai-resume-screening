import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import connectDB from "./src/config/db.js";
import authRoutes from "./src/routes/authRoutes.js";
import jobRoutes from "./src/routes/jobRoutes.js";
import candidateRoutes from "./src/routes/candidateRoutes.js";
import { errorHandler } from "./src/middleware/errorHandler.js";

const app = express();

app.use(cors({
  origin: [
    "http://localhost:5173",
    "http://localhost:5174",
    "https://smart-ats-ai-resume-screening.vercel.app"
  ],
  credentials: true
}));
app.use(express.json({ limit: "10mb" }));

connectDB();

app.get("/", (req, res) => {
  res.json({ message: "Smart ATS API is running" });
});

app.use("/api/auth", authRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/candidates", candidateRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
