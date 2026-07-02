const bcrypt = require("bcrypt");
const db = require("./db");
require("dotenv").config();

async function createAdminUser() {
  try {
    const username = process.env.INITIAL_ADMIN_USERNAME || "admin";
    const password = process.env.INITIAL_ADMIN_PASSWORD || "admin123";

    // Check if user already exists
    const [existingUsers] = await db.query(
      "SELECT id FROM admin_users WHERE username = ?",
      [username]
    );

    if (existingUsers.length > 0) {
      console.log("Admin user already exists!");
      return;
    }

    // Hash password
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Insert admin user
    const [result] = await db.query(
      "INSERT INTO admin_users (username, password_hash) VALUES (?, ?)",
      [username, passwordHash]
    );

    console.log("✅ Admin user created successfully!");
    console.log(`Username: ${username}`);
    console.log(`Password: ${password}`);
    console.log(`ID: ${result.insertId}`);
    console.log(
      "\n⚠️  IMPORTANT: Change the default password after first login!"
    );
  } catch (error) {
    console.error("❌ Error creating admin user:", error);
  } finally {
    process.exit(0);
  }
}

createAdminUser();
