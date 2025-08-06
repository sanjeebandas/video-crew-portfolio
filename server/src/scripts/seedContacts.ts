// scripts/seedContacts.ts
import mongoose from "mongoose";
import dotenv from "dotenv";
import ContactInquiry from "../models/ContactInquiry";

dotenv.config();

const seedContacts = async () => {
  await mongoose.connect(process.env.MONGO_URI!);

  await ContactInquiry.deleteMany(); // Optional: clear existing data

  await ContactInquiry.insertMany([
    {
      name: "John Doe",
      email: "john@example.com",
      subject: "Project Inquiry",
      message: "Hi, I'm interested in your services.",
      status: "new",
    },
    {
      name: "Jane Smith",
      email: "jane@example.com",
      subject: "Collaboration",
      message: "Let's discuss a potential partnership.",
      status: "processing",
      adminNotes: "Reached out via email.",
    },
  ]);

  console.log("Dummy contacts inserted");
  process.exit();
};

seedContacts();
