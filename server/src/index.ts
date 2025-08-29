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

const app = express();
const PORT = process.env.PORT || 5000;

//  Allowed CORS origins (add more if needed)
const allowedOrigins = [
  "http://localhost:5173", // local dev
  "https://*.vercel.app", // allow any vercel subdomain
  "https://*.up.railway.app", // allow railway domains
  "https://*.onrender.com", // allow render domains
  "https://video-crew-portfolio.onrender.com", // current render frontend
];

//  Dynamic CORS handling
const corsOptions = {
  origin: function (origin: string | undefined, callback: Function) {
    if (!origin || allowedOrigins.some(allowed => {
      if (allowed.includes('*')) {
        const pattern = allowed.replace('*', '.*');
        return new RegExp(pattern).test(origin);
      }
      return allowed === origin;
    })) {
      callback(null, true);
    } else {
      console.log(`CORS blocked origin: ${origin}`);
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
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

//  Serve static uploads
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

//  Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err);
  res.status(500).json({ 
    message: "Internal server error", 
    error: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

//  404 Fallback
app.use((_req, res) => {
  res.status(404).json({ message: "API route not found" });
});

//  Start server
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`🌐 CORS enabled for origins:`, allowedOrigins);
});
