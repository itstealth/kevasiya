-- Database setup for Kevasiya UTM tracking and Google Sheets integration
-- Run this script in your MySQL database

USE kevasiya;

-- Create contact_submissions table if it doesn't exist
CREATE TABLE IF NOT EXISTS contact_submissions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255),
    email VARCHAR(255),
    phone VARCHAR(20) NOT NULL,
    product_details TEXT,
    message TEXT,
    utm_source VARCHAR(255),
    utm_medium VARCHAR(255),
    utm_campaign VARCHAR(255),
    utm_term VARCHAR(255),
    utm_content VARCHAR(255),
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_contact_submissions_email ON contact_submissions(email);
CREATE INDEX IF NOT EXISTS idx_contact_submissions_phone ON contact_submissions(phone);
CREATE INDEX IF NOT EXISTS idx_contact_submissions_utm_campaign ON contact_submissions(utm_campaign);
CREATE INDEX IF NOT EXISTS idx_contact_submissions_submitted_at ON contact_submissions(submitted_at);

-- Verify table creation
DESCRIBE contact_submissions;

-- Show indexes
SHOW INDEX FROM contact_submissions;
