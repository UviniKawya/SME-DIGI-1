-- SME Digi Database Schema
-- Import this first in phpMyAdmin (or run: mysql -u root < schema.sql)

CREATE DATABASE IF NOT EXISTS sme_digi;
USE sme_digi;

-- 1. SME Registration
CREATE TABLE IF NOT EXISTS smes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    sme_name VARCHAR(150) NOT NULL,
    business_type VARCHAR(50) NOT NULL,
    location ENUM('Urban','Rural') NOT NULL,
    employees INT NOT NULL,
    years_operation INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Assessment Questions (varies by business_type + dimension)
CREATE TABLE IF NOT EXISTS assessment_questions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    business_type VARCHAR(50) NOT NULL,
    dimension VARCHAR(50) NOT NULL, -- Infrastructure | Financial | Digital Skills & Workforce | Cybersecurity
    question_text VARCHAR(255) NOT NULL,
    display_order INT DEFAULT 0
);

-- 3. Assessment Responses (Likert 1-5)
CREATE TABLE IF NOT EXISTS assessment_responses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    sme_id INT NOT NULL,
    question_id INT NOT NULL,
    score TINYINT NOT NULL CHECK (score BETWEEN 1 AND 5),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (sme_id) REFERENCES smes(id) ON DELETE CASCADE,
    FOREIGN KEY (question_id) REFERENCES assessment_questions(id)
);

-- 4. Inventory
CREATE TABLE IF NOT EXISTS inventory (
    id INT AUTO_INCREMENT PRIMARY KEY,
    sme_id INT NOT NULL,
    item_name VARCHAR(150) NOT NULL,
    category VARCHAR(100),
    quantity INT DEFAULT 0,
    unit_price DECIMAL(10,2) DEFAULT 0,
    reorder_level INT DEFAULT 5,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (sme_id) REFERENCES smes(id) ON DELETE CASCADE
);

-- 5. Sales
CREATE TABLE IF NOT EXISTS sales (
    id INT AUTO_INCREMENT PRIMARY KEY,
    sme_id INT NOT NULL,
    item_id INT NOT NULL,
    quantity_sold INT NOT NULL,
    sale_price DECIMAL(10,2) NOT NULL,
    sale_date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (sme_id) REFERENCES smes(id) ON DELETE CASCADE,
    FOREIGN KEY (item_id) REFERENCES inventory(id)
);
