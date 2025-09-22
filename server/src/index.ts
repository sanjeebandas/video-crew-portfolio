import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";

import connectDB from "./config/db";
import pingRoute from "./routes/ping";
import portfolioRoutes from "./routes/portfolio";
import authRoutes from "./routes/auth";
import contactRoutes from "./routes/contact";
import uploadRoutes from "./routes/upload";
import pageVisitRoutes from "./routes/pageVisit";
import notificationRoutes from "./routes/notifications";

dotenv.config();

// Environment variable validation
const validateEnvironment = () => {
  const requiredVars = ["MONGO_URI", "JWT_SECRET"];
  const missingVars = requiredVars.filter((varName) => !process.env[varName]);

  if (missingVars.length > 0) {
    console.error("❌ Missing required environment variables:", missingVars);
    process.exit(1);
  }

  // Log environment configuration
  console.log("🔧 Environment Configuration:");
  console.log(`   NODE_ENV: ${process.env.NODE_ENV || "development"}`);
  console.log(`   PORT: ${process.env.PORT || 5000}`);
  console.log(
    `   MONGO_URI: ${process.env.MONGO_URI ? "✅ Set" : "❌ Missing"}`
  );
  console.log(
    `   JWT_SECRET: ${process.env.JWT_SECRET ? "✅ Set" : "❌ Missing"}`
  );

  // Log storage configuration
  const storagePath =
    process.env.RENDER_PERSISTENT_DISK_PATH || process.env.VOLUME_MOUNT_PATH;
  if (storagePath) {
    console.log(`Storage Path: ${storagePath} (Persistent Disk)`);
  } else {
    console.log(`Storage Path: Local development (server/uploads/)`);
  }

  console.log("✅ Environment validation passed");
};

// Validate environment before starting server
validateEnvironment();

const app = express();
const PORT = process.env.PORT || 5000;

//  Allowed CORS origins (add more if needed)
const allowedOrigins = [
  "http://localhost:5173", // local dev
  "https://video-crew-portfolio.onrender.com", // current render frontend
  "https://video-crew-portfolio-backend.onrender.com", // your backend domain
];

//  Dynamic CORS handling
const corsOptions = {
  origin: function (origin: string | undefined, callback: Function) {
    console.log(`CORS check for origin: ${origin}`);

    if (!origin || allowedOrigins.includes(origin)) {
      console.log(`CORS allowed for origin: ${origin}`);
      callback(null, true);
    } else {
      console.log(`CORS blocked origin: ${origin}`);
      console.log(`Allowed origins:`, allowedOrigins);
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: false, // Changed to false to match frontend
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

//  Middlewares
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//  Connect DB
connectDB?.();

//  Routes
app.use("/api/ping", pingRoute);
app.use("/api/portfolio", portfolioRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/pagevisit", pageVisitRoutes);
app.use("/api/notifications", notificationRoutes);

// Debug endpoint to test CORS
app.get("/api/test-cors", (req, res) => {
  res.json({
    message: "CORS test successful",
    origin: req.headers.origin,
    timestamp: new Date().toISOString(),
  });
});

//  Serve static uploads with environment-aware path
const getStaticUploadsPath = (): string => {
  // Platform-specific environment variables
  const platformPaths = {
    // Render Premium persistent disk
    RENDER_PERSISTENT_DISK_PATH: process.env.RENDER_PERSISTENT_DISK_PATH, //make sure to add this in the .env file once RENDER subscription is activated
    // Generic volume mount
    VOLUME_MOUNT_PATH: process.env.VOLUME_MOUNT_PATH,
    // Local development fallback
    LOCAL_UPLOAD_PATH: path.join(__dirname, "../uploads"),
  };

  // Find first available platform path
  for (const [key, value] of Object.entries(platformPaths)) {
    if (value) {
      console.log(`🌐 Using static uploads path for ${key}: ${value}`);
      return value;
    }
  }

  // Final fallback (should never reach here)
  const fallbackPath = path.join(__dirname, "../uploads");
  console.log(`🌐 Using fallback static uploads path: ${fallbackPath}`);
  return fallbackPath;
};

const staticUploadsPath = getStaticUploadsPath();
app.use("/uploads", express.static(staticUploadsPath));

//  Error handling middleware
app.use(
  (
    err: any,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    console.error("Error:", err);
    res.status(500).json({
      message: "Internal server error",
      error:
        process.env.NODE_ENV === "development"
          ? err.message
          : "Something went wrong",
    });
  }
);

//  404 Fallback for all routes
app.use((_req, res) => {
  res.status(404).json({ message: "Route not found" });
});

//  Start server
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`🌐 CORS enabled for origins:`, allowedOrigins);
});
