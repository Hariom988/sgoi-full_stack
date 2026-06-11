import { config } from "dotenv";
import { resolve } from "path";
config({ path: resolve(process.cwd(), ".env.local") });

import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import * as readline from "readline";

const AdminSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  passwordHash: { type: String, required: true },
  createdAt: { type: Date, default: () => new Date() },
});

const Admin = mongoose.models.Admin ?? mongoose.model("Admin", AdminSchema);

function prompt(question: string): Promise<string> {
  const rl = readline.createInterface({
    input: process.stdin,            
    output: process.stdout,
  });
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer);
    });               
  });
}

async function main() {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    console.error("\nMONGODB_URI is not set. Add it to .env.local and try again.\n");
    process.exit(1);
  }

  console.log("\n  SGOI Admin Account Setup\n");

  const email = await prompt("Admin email: ");
  const password = await prompt("Admin password (min 12 chars): ");

  if (!email.trim() || !password) {
    console.error("\n  Email and password are required.\n");
    process.exit(1);
  }

  if (password.length < 12) {
    console.error("\n  Password must be at least 12 characters.\n");
    process.exit(1);
  }

  console.log("\n  Connecting to MongoDB…");
  await mongoose.connect(uri);

  const existing = await Admin.findOne({ email: email.trim().toLowerCase() });
  if (existing) {
    console.error("\n  An admin with this email already exists.\n");
    await mongoose.disconnect();
    process.exit(1);
  }

  console.log("\n  Hashing password (this takes a moment)…");
  const passwordHash = await bcrypt.hash(password, 12);

  await Admin.create({
    email: email.trim().toLowerCase(),
    passwordHash,
  });

  console.log("\n  Admin account created successfully.");
  console.log(`   Email: ${email.trim().toLowerCase()}`);
  console.log("\n   Keep your credentials safe. Do not share them.\n");

  await mongoose.disconnect();
  process.exit(0);
}

main().catch((err) => {
  console.error("\n  Seed failed:", err);
  process.exit(1);
});