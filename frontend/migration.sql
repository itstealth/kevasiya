-- Migration to add new optional fields to products table
-- Run this SQL command in your MySQL database

ALTER TABLE products 
ADD COLUMN tags JSON NULL COMMENT 'Array of product tags',
ADD COLUMN MOQ INT NULL COMMENT 'Minimum Order Quantity',
ADD COLUMN isFeatured BOOLEAN DEFAULT FALSE COMMENT 'Whether product is featured',
ADD COLUMN sales TEXT NULL COMMENT 'Sales information or notes';

-- Optional: Add indexes for better performance
CREATE INDEX idx_products_featured ON products(isFeatured);
CREATE INDEX idx_products_moq ON products(MOQ);

-- Verify the new structure
-- DESCRIBE products; 