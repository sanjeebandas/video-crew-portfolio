import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db";
import pingRoute from "./routes/ping";
import portfolioRoutes from "./routes/portfolio";
import authRoutes from "./routes/auth";
import contactRoutes from "./routes/contact";
import uploadRoutes from "./routes/upload";
import path from "path";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// ✅ Middleware

const corsOptions = {
  origin: "http://localhost:5173",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Connect to DB
connectDB?.();

// ✅ API Routes
app.use("/api/ping", pingRoute);
app.use("/api/portfolio", portfolioRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/upload", uploadRoutes);

app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// ✅ Fallback for 404
app.use((_req, res) => {
  res.status(404).json({ message: "API route not found" });
});

// ✅ Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
