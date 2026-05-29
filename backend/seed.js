const db = require("./db");
const fs = require("fs").promises;
const path = require("path");

async function seedDatabase() {
  let connection;
  try {
    connection = await db.getConnection();
    console.log("Database connection successful for seeding.");

    // 1. Read data from JSON files
    console.log("Reading data from JSON files...");
    const categoriesData = JSON.parse(
      await fs.readFile(path.join(__dirname, "data", "categories.json"), "utf8")
    );
    const subcategoriesData = JSON.parse(
      await fs.readFile(
        path.join(__dirname, "data", "subcategories.json"),
        "utf8"
      )
    );
    const productsData = JSON.parse(
      await fs.readFile(path.join(__dirname, "data", "products.json"), "utf8")
    );
    console.log("Data read successfully.");

    // 2. Insert Categories
    console.log("Inserting categories...");
    for (const category of categoriesData) {
      await connection.query(
        "INSERT INTO categories (id, name, slug, description, image) VALUES (?, ?, ?, ?, ?)",
        [
          category.id,
          category.name,
          category.slug,
          category.description,
          `/images/collections/${category.slug}.webp`, // Construct image path
        ]
      );
    }
    console.log("Categories inserted.");

    // 3. Insert Subcategories
    console.log("Inserting subcategories...");
    for (const subcategory of subcategoriesData) {
      await connection.query(
        "INSERT INTO subcategories (id, category_id, name, slug, description) VALUES (?, ?, ?, ?, ?)",
        [
          subcategory.id,
          subcategory.categoryId,
          subcategory.name,
          subcategory.slug,
          subcategory.description,
        ]
      );
    }
    console.log("Subcategories inserted.");

    // 4. Insert Products
    console.log("Inserting products...");
    for (const product of productsData) {
      await connection.query(
        "INSERT INTO products (id, subcategory_id, name, slug, description, price, included_items, packaging, image, images) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
        [
          product.id,
          product.subCategoryId,
          product.name,
          product.slug,
          product.description,
          product.price,
          JSON.stringify(product.included_items), // Convert array to JSON string
          product.packaging,
          product.image,
          JSON.stringify(product.images), // Convert images array to JSON string
        ]
      );
    }
    console.log("Products inserted.");

    console.log("\nDatabase seeding completed successfully! ✨");
  } catch (error) {
    console.error("🔥 An error occurred during database seeding:");
    console.error(error);
  } finally {
    if (connection) {
      console.log("Releasing connection...");
      connection.release();
    }
    console.log("Closing the connection pool.");
    await db.end();
  }
}

seedDatabase();
