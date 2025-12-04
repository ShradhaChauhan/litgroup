const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const mysql = require("mysql2/promise");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config({
  path: path.join(__dirname, "..", ".env"),
});

const defaultConfig = {
  DB_HOST: "localhost",
  DB_PORT: "3306",
  DB_NAME: "ims_backend",
  DB_USER: "root",
  DB_PASSWORD: "Mysql@123",
  APP_PORT: "8080",
};

// Sanitize DB_HOST to remove protocol if present
const sanitizeDbHost = (host) => {
  if (!host) return host;
  return host.replace(/^https?:\/\//, "").replace(/\/$/, "").trim();
};

const resolvedEnv = {
  DB_HOST: sanitizeDbHost(process.env.DB_HOST || defaultConfig.DB_HOST),
  DB_PORT: process.env.DB_PORT || defaultConfig.DB_PORT,
  DB_NAME: process.env.DB_NAME || defaultConfig.DB_NAME,
  DB_USER: process.env.DB_USER || defaultConfig.DB_USER,
  DB_PASSWORD: process.env.DB_PASSWORD || defaultConfig.DB_PASSWORD,
  APP_PORT: process.env.APP_PORT || defaultConfig.APP_PORT,
  ALLOWED_ORIGINS: process.env.ALLOWED_ORIGINS || "",
};

const requiredEnv = ["DB_HOST", "DB_USER", "DB_PASSWORD", "DB_NAME"];
const missingEnv = requiredEnv.filter((key) => !process.env[key]);

if (missingEnv.length) {
  console.warn(
    `⚠️  Missing environment variables: ${missingEnv.join(
      ", "
    )} falling back to defaults defined in src/server.js`
  );
}

const app = express();

app.use(helmet());
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) {
        return callback(null, true);
      }

      const allowed = (resolvedEnv.ALLOWED_ORIGINS || "")
        .split(",")
        .map((value) => value.trim())
        .filter(Boolean);

      // Allow all origins if no specific origins are configured (development mode)
      if (!allowed.length) {
        return callback(null, true);
      }

      // Check if origin is in allowed list
      if (allowed.includes(origin)) {
        return callback(null, true);
      }

      // In development, also allow localhost and 127.0.0.1 on any port
      const isDevelopment = process.env.NODE_ENV !== "production";
      if (isDevelopment) {
        const localhostPattern = /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/;
        if (localhostPattern.test(origin)) {
          return callback(null, true);
        }
      }

      return callback(
        new Error("Origin not allowed by CORS configuration"),
        false
      );
    },
    methods: ["POST", "OPTIONS", "GET"],
    credentials: true,
  })
);
app.use(express.json({ limit: "1mb" }));
app.use(morgan("dev"));

const pool = mysql.createPool({
  host: resolvedEnv.DB_HOST,
  port: Number(resolvedEnv.DB_PORT),
  user: resolvedEnv.DB_USER,
  password: resolvedEnv.DB_PASSWORD,
  database: resolvedEnv.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  charset: "utf8mb4",
});

// Test database connection on startup
pool.getConnection()
  .then((connection) => {
    console.log("✅ Successfully connected to MySQL database");
    connection.release();
  })
  .catch((error) => {
    console.error("❌ Failed to connect to MySQL database:", error.message);
    console.error("   Please check:");
    console.error("   - MySQL server is running");
    console.error("   - Database credentials are correct");
    console.error("   - Database '" + resolvedEnv.DB_NAME + "' exists");
    console.error("   - User has proper permissions");
  });

const ratingFields = [
  "quality",
  "delivery",
  "finance",
  "response",
  "development",
];

const sanitizeText = (value) => {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed.length ? trimmed : null;
};

app.get("/health", async (_req, res) => {
  try {
    const connection = await pool.getConnection();
    await connection.ping();
    connection.release();
    res.status(200).json({ status: "ok" });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
});

app.post("/api/feedbacks", async (req, res) => {
  const payload = req.body || {};

  const requiredFields = [
    "company_name",
    "unit_address",
    "user_name",
    "email",
    "mobile",
    "designation",
    "department",
    "improvements",
  ];

  const missingFields = requiredFields.filter((field) => {
    const value = sanitizeText(payload[field]);
    return !value;
  });

  if (missingFields.length) {
    return res.status(400).json({
      message: `Missing required fields: ${missingFields.join(", ")}`,
    });
  }

  const ratingErrors = [];

  ratingFields.forEach((field) => {
    const ratingValue = Number(payload[field]);
    if (!Number.isInteger(ratingValue) || ratingValue < 1 || ratingValue > 5) {
      ratingErrors.push(`${field} must be an integer between 1 and 5`);
    }
    if (ratingValue === 1 && !sanitizeText(payload[`reason_${field}`])) {
      ratingErrors.push(`reason_${field} is required when giving 1 star`);
    }
  });

  if (ratingErrors.length) {
    return res.status(400).json({ message: ratingErrors.join(". ") });
  }

  const insertQuery = `
    INSERT INTO feedbacks (
      company_name,
      unit_address,
      user_name,
      email,
      mobile,
      designation,
      department,
      quality,
      delivery,
      finance,
      response,
      development,
      reason_quality,
      reason_delivery,
      reason_finance,
      reason_response,
      reason_development,
      improvements
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const params = [
    sanitizeText(payload.company_name),
    sanitizeText(payload.unit_address),
    sanitizeText(payload.user_name),
    sanitizeText(payload.email),
    sanitizeText(payload.mobile),
    sanitizeText(payload.designation),
    sanitizeText(payload.department),
    ...ratingFields.map((field) => Number(payload[field])),
    sanitizeText(payload.reason_quality),
    sanitizeText(payload.reason_delivery),
    sanitizeText(payload.reason_finance),
    sanitizeText(payload.reason_response),
    sanitizeText(payload.reason_development),
    sanitizeText(payload.improvements),
  ];

  try {
    const [result] = await pool.execute(insertQuery, params);
    res
      .status(201)
      .json({ message: "Feedback saved", feedbackId: result.insertId });
  } catch (error) {
    console.error("Failed to insert feedback", error);
    res.status(500).json({ message: "Failed to save feedback" });
  }
});

const port = Number(resolvedEnv.APP_PORT);

app.listen(port, () => {
  console.log(`✅ Feedback API listening on http://localhost:${port}`);
});

