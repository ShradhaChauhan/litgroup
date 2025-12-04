import express from "express";
import mysql from "mysql2";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// Setup path resolution
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Serve static files from "public"
app.use(express.static(path.join(__dirname, "public")));

// MySQL connection
const db = mysql.createConnection({
  host: "localhost",
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  port: 3306,
});

db.connect((err) => {
  if (err) {
    console.error("❌ Database connection failed:", err);
  } else {
    console.log("✅ Connected to MySQL database");
  }
});

// Handle form submission
app.post("/submit-feedback", (req, res) => {
  const data = req.body;

  const sql = `
    INSERT INTO feedbacks (
      company_name, unit_address, user_name, email, mobile,
      designation, department, quality, delivery, finance,
      response, development, improvements
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(
    sql,
    [
      data.companyName,
      data.unitAddress,
      data.userName,
      data.email,
      data.mobile,
      data.designation,
      data.department,
      data.quality,
      data.delivery,
      data.finance,
      data.response,
      data.development,
      data.improvements,
    ],
    (err, result) => {
      if (err) {
        console.error("❌ Error inserting data:", err);
        res.status(500).send("Error saving feedback");
      } else {
        console.log("✅ Feedback saved successfully!");
        res.send("Feedback saved successfully!");
      }
    }
  );
});

// Start server
const PORT = 3000;
app.listen(PORT, () => console.log(`🚀 Server running at http://localhost:${PORT}`));
