-- Create database if it doesn't exist
CREATE DATABASE IF NOT EXISTS ims_backend CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Use the database
USE ims_backend;

-- Create feedbacks table if it doesn't exist
CREATE TABLE IF NOT EXISTS feedbacks (
  id INT AUTO_INCREMENT PRIMARY KEY,
  company_name VARCHAR(255) NOT NULL,
  unit_address TEXT NOT NULL,
  user_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  mobile VARCHAR(20) NOT NULL,
  designation VARCHAR(255) NOT NULL,
  department VARCHAR(255) NOT NULL,
  quality INT NOT NULL CHECK (quality >= 1 AND quality <= 5),
  delivery INT NOT NULL CHECK (delivery >= 1 AND delivery <= 5),
  finance INT NOT NULL CHECK (finance >= 1 AND finance <= 5),
  response INT NOT NULL CHECK (response >= 1 AND response <= 5),
  development INT NOT NULL CHECK (development >= 1 AND development <= 5),
  reason_quality TEXT NULL,
  reason_delivery TEXT NULL,
  reason_finance TEXT NULL,
  reason_response TEXT NULL,
  reason_development TEXT NULL,
  improvements TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_email (email),
  INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

