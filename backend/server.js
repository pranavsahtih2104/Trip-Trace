import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";

import authRoutes from "./routes/authRoutes.js";
import testRoutes from "./routes/testRoutes.js";
import tripRoutes from "./routes/tripRoutes.js";

dotenv.config();
connectDB();

const app = express();

/* ✅ CORS – MUST BE BEFORE ROUTES */
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

/* ✅ This is REQUIRED for preflight */
app.options("*", cors());

app.use(express.json());

/* ROUTES */
app.use("/api/auth", authRoutes);
app.use("/api/test", testRoutes);
app.use("/api/trips", tripRoutes);

const PORT = process.env.PORT || 5001;
app.listen(PORT, () =>
  console.log(`Server running on port ${PORT}`)
);
