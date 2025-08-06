import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import Admin from "../models/Admin";

dotenv.config(); // Load env variables

const seedAdmin = async () => {
  const MONGO_URI = process.env.MONGO_URI;

  if (!MONGO_URI) {
    console.error("Missing MONGO_URI in .env");
    process.exit(1);
  }

  try {
    await mongoose.connect(MONGO_URI);
    console.log("MongoDB connected");

    const existing = await Admin.findOne({ email: "admin@videocrew.com" });
    if (existing) {
      console.log("Admin already exists. Aborting.");
      process.exit(0);
    }

    const hashedPassword = await bcrypt.hash("Test@123", 10);

    const admin = new Admin({
      email: "admin@videocrew.com",
      password: hashedPassword,
      name: "VideoCrew Admin",
    });

    await admin.save();

    console.log("Admin user created successfully!");
    process.exit(0);
  } catch (err) {
    console.error("Error creating admin user:", err);
    process.exit(1);
  }
};

seedAdmin();
