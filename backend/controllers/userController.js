import { runCppProgram } from "../utils/cppHelper.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const USERS_CSV = path.join(__dirname, "../../data/users.csv");

export const getAllUsers = async (req, res) => {
  try {
    // Read from CSV file
    const csvData = fs.readFileSync(USERS_CSV, "utf-8");
    const lines = csvData.split("\n").slice(1); // Skip header

    const users = lines
      .filter((line) => line.trim())
      .map((line) => {
        const [id, firstName, lastName, email] = line.split(",");
        return {
          userId: parseInt(id),
          name: `${firstName} ${lastName}`,
          email: email,
        };
      });

    res.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Failed to fetch users" });
  }
};

export const createUser = async (req, res) => {
  try {
    const { userId, name, email } = req.body;

    if (!userId || !name || !email) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Split name into first and last
    const nameParts = name.trim().split(" ");
    const firstName = nameParts[0] || name;
    const lastName = nameParts.slice(1).join(" ") || "";

    // Read existing CSV
    const csvData = fs.readFileSync(USERS_CSV, "utf-8");
    const lines = csvData.split("\n");

    // Check if user ID already exists
    const userExists = lines.some((line) => {
      const [id] = line.split(",");
      return parseInt(id) === userId;
    });

    if (userExists) {
      return res.status(400).json({ error: "User ID already exists" });
    }

    // Append new user
    const now = new Date().toISOString().split("T")[0];
    const newLine = `${userId},${firstName},${lastName},${email},N/A,N/A,${now}`;

    fs.appendFileSync(USERS_CSV, `\n${newLine}`);

    res.json({
      success: true,
      message: "User created successfully",
      user: { userId, name, email },
    });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ error: "Failed to create user" });
  }
};
