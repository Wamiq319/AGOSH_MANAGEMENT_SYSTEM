import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import {
  userRoutes,
  authRoutes,
  branchRoutes,
  studentRoutes,
  dashboardRoutes,
  donationRoutes,
} from "./routes/index.js";

// Load environment variables
dotenv.config();

const app = express();

// ---------------------
// CORS Configuration
// ---------------------
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(",") // allows multiple origins separated by comma
  : [];

const corsOptions = {
  origin: (origin, callback) => {
    console.log("Request Origin:", origin);
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
  optionsSuccessStatus: 204,
};
app.use(cors(corsOptions));

// ---------------------
// Body Parser
// ---------------------
app.use(express.json({ limit: "30mb" }));
app.use(express.urlencoded({ limit: "30mb", extended: true }));

// ---------------------
// Request Logger
// ---------------------
app.use((req, res, next) => {
  const { method, originalUrl, body } = req;
  console.log(`\n--- Incoming Request ---`);
  console.log(`[${new Date().toISOString()}] ${method} ${originalUrl}`);
  if (body && Object.keys(body).length > 0) {
    console.log("Request Body:", body);
  }
  res.on("finish", () => {
    console.log("--- Response Sent ---");
    console.log(
      `[${new Date().toISOString()}] Status: ${res.statusCode} ${
        res.statusMessage
      }`
    );
    console.log("--------------");
  });
  next();
});

// ---------------------
// MongoDB Connection
// ---------------------
const mongoUri = process.env.MONGO_URI;
const dbName = process.env.DB_NAME;

if (!mongoUri || !dbName) {
  console.error("❌ Missing MONGO_URI or DB_NAME in .env file!");
  process.exit(1);
}

console.log("🔍 Connecting to MongoDB URI:", mongoUri);
console.log("🔍 Database Name:", dbName);

mongoose
  .connect(mongoUri, { dbName })
  .then(() => console.log(`✅ MongoDB Connected to database: ${dbName}`))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

// ---------------------
// Routes
// ---------------------
app.get("/api", (req, res) => {
  res.status(200).json({ message: "Server is running" });
});

app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/branches", branchRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/donations", donationRoutes);

// ---------------------
// Server Start
// ---------------------
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
