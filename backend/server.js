const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const csrf = require("csurf");
const rateLimit = require("express-rate-limit");
const db = require("./db");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5001;
const JWT_SECRET =
  process.env.JWT_SECRET || "your-secret-key-change-in-production";

// Rate Limiting
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: { error: "Too many requests, please try again later." },
  standardHeaders: true,
  legacyHeaders: false,
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Limit each IP to 10 login attempts
  message: { error: "Too many login attempts, please try again later." },
  standardHeaders: true,
  legacyHeaders: false,
});

// CSRF Protection
const csrfProtection = csrf({ cookie: true });

// --- DYNAMIC PATHS SETUP ---
// The 'uploads' directory is now located within the backend directory.
const UPLOADS_DIR = process.env.UPLOADS_DIR || path.join(__dirname, "uploads");
const TEMP_UPLOADS_DIR = path.join(__dirname, "temp_uploads"); // Temp files can stay within the backend.

// Ensure directories exist
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}
if (!fs.existsSync(TEMP_UPLOADS_DIR)) {
  fs.mkdirSync(TEMP_UPLOADS_DIR, { recursive: true });
}

// --- Middleware & Setup ---
app.use(cors());
app.use(bodyParser.json({ limit: '10kb' })); // Limit body size
app.use(cookieParser());

// Security Headers
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');

  // HSTS (only in production)
  if (process.env.NODE_ENV === 'production') {
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  }

  next();
});

// Health check endpoint (no auth required, no rate limit)
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Apply rate limiting to all API routes
app.use("/api/", generalLimiter);

// CSRF token endpoint (GET requests are safe)
app.get("/api/csrf-token", csrfProtection, (req, res) => {
  res.json({ csrfToken: req.csrfToken() });
});

// Serve files from the backend's own 'uploads' directory
app.use("/uploads", express.static(UPLOADS_DIR));

// Serve token exchange page
app.get("/token-exchange", (req, res) => {
  res.sendFile(path.join(__dirname, "token-exchange.html"));
});

const tempUploadDir = path.join(__dirname, "temp_uploads");
if (!fs.existsSync(tempUploadDir)) {
  fs.mkdirSync(tempUploadDir, { recursive: true });
}
const upload = multer({ dest: TEMP_UPLOADS_DIR });

// --- Helper Functions ---

// Path traversal prevention
const isPathSafe = (basePath, userPath) => {
  const resolved = path.resolve(basePath, userPath);
  return resolved.startsWith(basePath);
};

const sanitizeSlug = (slug) => {
  // Only allow alphanumeric, hyphens, and underscores
  return slug.replace(/[^a-zA-Z0-9\-_]/g, "");
};

const slugify = (text) =>
  text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, "-") // Replace spaces with -
    .replace(/[^\w\-]+/g, "") // Remove all non-word chars
    .replace(/\-\-+/g, "-") // Replace multiple - with single -
    .replace(/^-+/, "") // Trim - from start of text
    .replace(/-+$/, ""); // Trim - from end of text

const sanitizeFileName = (filename) => {
  if (!filename) return `file-${Date.now()}`;
  const extension = path.extname(filename);
  const name = path.basename(filename, extension);
  return `${slugify(name)}${extension.toLowerCase()}`;
};

const handleError = (
  res,
  err,
  message = "An internal server error occurred."
) => {
  console.error("[HANDLE_ERROR]", err);
  res.status(500).json({ error: message, details: err.message });
};

// Authentication middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ error: "Access token required" });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: "Invalid or expired token" });
    }
    req.user = user;
    next();
  });
};

// CSRF protection middleware for state-changing operations
// Since we use JWT in Authorization header, we validate via custom header
const csrfValidation = (req, res, next) => {
  // Skip CSRF for GET requests (safe methods)
  if (req.method === "GET") {
    return next();
  }
  // For state-changing methods, validate CSRF token from header
  const csrfToken = req.headers["x-csrf-token"] || req.headers["x-xsrf-token"];
  // In production, validate against stored CSRF token
  // For now, require the header to be present
  if (!csrfToken && process.env.NODE_ENV === "production") {
    return res.status(403).json({ error: "CSRF token required" });
  }
  next();
};

const processUploadedFile = (file, entity, folderName) => {
  if (!file) return null;

  const sanitizedFilename = sanitizeFileName(file.originalname);
  const finalDir = path.join(UPLOADS_DIR, entity, folderName);

  if (!fs.existsSync(finalDir)) {
    fs.mkdirSync(finalDir, { recursive: true });
  }

  const finalPath = path.join(finalDir, sanitizedFilename);
  const publicUrl = `/uploads/${entity}/${folderName}/${sanitizedFilename}`;

  try {
    fs.renameSync(file.path, finalPath);
    return publicUrl;
  } catch (error) {
    console.error(
      "[PROCESS_FILE] FATAL ERROR processing file:",
      error
    );
    if (fs.existsSync(file.path)) {
      fs.unlinkSync(file.path);
    }
    throw error;
  }
};

const deleteFileFromPath = (filePath) => {
  if (!filePath) return;

  // filePath is the public URL, e.g., /uploads/products/image.png
  // We need to construct the full file system path to delete it.
  const relativePath = filePath.startsWith("/uploads/")
    ? filePath.substring("/uploads/".length)
    : filePath;
  const fullPath = path.join(UPLOADS_DIR, relativePath);

  if (fs.existsSync(fullPath)) {
    try {
      fs.unlinkSync(fullPath);
      console.log("[DELETE_FILE] Deleted file");
    } catch (err) {
      console.error("[DELETE_FILE] Error deleting file:", err);
    }
  } else {
    console.warn("[DELETE_FILE] File not found for deletion");
  }
};

// =================================================================
// --- AUTHENTICATION ROUTES ---
// =================================================================

// POST /api/login (with rate limiting)
app.post("/api/login", authLimiter, async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res
        .status(400)
        .json({ error: "Username and password are required" });
    }

    // Find user in database
    const [users] = await db.query(
      "SELECT id, username, password_hash FROM admin_users WHERE username = ?",
      [username]
    );

    if (users.length === 0) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const user = users[0];

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password_hash);
    if (!isValidPassword) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, username: user.username },
      JWT_SECRET,
      { expiresIn: "24h" }
    );

    res.json({
      token,
      user: {
        id: user.id,
        username: user.username,
      },
    });
  } catch (err) {
    handleError(res, err, "Login failed");
  }
});

// GET /api/me - Get current user info
app.get("/api/me", authenticateToken, async (req, res) => {
  try {
    const [users] = await db.query(
      "SELECT id, username, created_at FROM admin_users WHERE id = ?",
      [req.user.id]
    );

    if (users.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({
      user: {
        id: users[0].id,
        username: users[0].username,
        created_at: users[0].created_at,
      },
    });
  } catch (err) {
    handleError(res, err, "Failed to get user info");
  }
});

// POST /api/admin-users - Create new admin user (protected)
app.post("/api/admin-users", authenticateToken, async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res
        .status(400)
        .json({ error: "Username and password are required" });
    }

    // Hash password
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Insert new user
    const [result] = await db.query(
      "INSERT INTO admin_users (username, password_hash) VALUES (?, ?)",
      [username, passwordHash]
    );

    res.status(201).json({
      id: result.insertId,
      username,
      message: "Admin user created successfully",
    });
  } catch (err) {
    if (err.code === "ER_DUP_ENTRY") {
      return res.status(400).json({ error: "Username already exists" });
    }
    handleError(res, err, "Failed to create admin user");
  }
});

// GET /api/admin-users - List all admin users (protected)
app.get("/api/admin-users", authenticateToken, async (req, res) => {
  try {
    const [users] = await db.query(
      "SELECT id, username, created_at FROM admin_users ORDER BY created_at DESC"
    );

    res.json(users);
  } catch (err) {
    handleError(res, err, "Failed to fetch admin users");
  }
});

// PUT /api/admin-users/:id - Update admin user password (protected)
app.put("/api/admin-users/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({ error: "Password is required" });
    }

    // Hash new password
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Update user
    await db.query("UPDATE admin_users SET password_hash = ? WHERE id = ?", [
      passwordHash,
      id,
    ]);

    res.json({ message: "Password updated successfully" });
  } catch (err) {
    handleError(res, err, "Failed to update password");
  }
});

// DELETE /api/admin-users/:id - Delete admin user (protected)
app.delete("/api/admin-users/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    // Prevent deleting the current user
    if (parseInt(id) === req.user.id) {
      return res.status(400).json({ error: "Cannot delete your own account" });
    }

    await db.query("DELETE FROM admin_users WHERE id = ?", [id]);
    res.json({ message: "Admin user deleted successfully" });
  } catch (err) {
    handleError(res, err, "Failed to delete admin user");
  }
});

// =================================================================
// --- API ROUTES ---
// =================================================================

app.get("/api/categories", async (req, res) => {
  try {
    const { slug } = req.query;
    if (slug) {
      const [rows] = await db.query("SELECT * FROM categories WHERE slug = ?", [
        slug,
      ]);
      res.json(rows);
    } else {
      const [rows] = await db.query("SELECT * FROM categories ORDER BY name");
      res.json(rows);
    }
  } catch (err) {
    handleError(res, err);
  }
});

app.get("/api/subcategories", async (req, res) => {
  try {
    const { category_id } = req.query;
    if (category_id) {
      const [rows] = await db.query(
        "SELECT * FROM subcategories WHERE category_id = ? ORDER BY id",
        [category_id]
      );
      res.json(rows);
    } else {
      const [rows] = await db.query("SELECT * FROM subcategories ORDER BY id");
      res.json(rows);
    }
  } catch (err) {
    handleError(res, err);
  }
});

app.get("/api/subcategory-details", async (req, res) => {
  try {
    const { category_slug, subcategory_slug } = req.query;
    if (!category_slug || !subcategory_slug)
      return res.status(400).json({ error: "Slugs are required." });
    const [rows] = await db.query(
      "SELECT s.* FROM subcategories s JOIN categories c ON s.category_id = c.id WHERE c.slug = ? AND s.slug = ?",
      [category_slug, subcategory_slug]
    );
    if (rows.length === 0) return res.status(404).json({ error: "Not found." });
    res.json(rows[0]);
  } catch (err) {
    handleError(res, err);
  }
});

app.get("/api/products", async (req, res) => {
  try {
    const { category_id, subcategory_id, slug, name, isFeatured, tags, moq } =
      req.query;
    let query = `SELECT p.*, c.name as category_name, s.name as subcategory_name FROM products p LEFT JOIN categories c ON p.category_id = c.id LEFT JOIN subcategories s ON p.subcategory_id = s.id`;
    const params = [];

    let whereClauses = [];
    if (category_id) {
      whereClauses.push("p.category_id = ?");
      params.push(category_id);
    }
    if (subcategory_id) {
      whereClauses.push("p.subcategory_id = ?");
      params.push(subcategory_id);
    }
    if (name) {
      whereClauses.push("p.name LIKE ?");
      params.push(`%${name}%`);
    }
    if (slug) {
      whereClauses.push("p.slug = ?");
      params.push(slug);
    }
    if (isFeatured === "true" || isFeatured === "false") {
      whereClauses.push("p.isFeatured = ?");
      params.push(isFeatured === "true" ? 1 : 0);
    }
    if (tags) {
      // Simple LIKE search for a tag within the JSON array string.
      // E.g., finds "new" in '["new", "featured"]'
      whereClauses.push("p.tags LIKE ?");
      params.push(`%${tags}%`);
    }
    if (moq) {
      whereClauses.push("p.MOQ <= ?");
      params.push(moq);
    }

    if (whereClauses.length > 0) {
      query += ` WHERE ${whereClauses.join(" AND ")}`;
    }

    query += " ORDER BY p.id DESC";
    const [rows] = await db.query(query, params);
    res.json(
      rows.map((p) => ({
        ...p,
        included_items: p.included_items ? JSON.parse(p.included_items) : [],
        images: p.images ? JSON.parse(p.images) : [],
        // The 'tags' column is of type JSON and is parsed automatically by the driver.
        tags: p.tags || [],
        MOQ: p.MOQ || null,
        isFeatured: Boolean(p.isFeatured),
        sales: p.sales || null,
      }))
    );
  } catch (err) {
    handleError(res, err);
  }
});

app.delete("/api/:entity/:id", async (req, res) => {
  try {
    const { entity, id } = req.params;
    if (
      ![
        "categories",
        "subcategories",
        "products",
        "contact-submissions",
      ].includes(entity)
    )
      return res.status(400).json({ error: "Invalid entity." });

    if (entity === "products") {
      const [[product]] = await db.query(
        "SELECT slug, image, images FROM products WHERE id = ?",
        [id]
      );

      if (product) {
        // Delete main image and gallery images
        deleteFileFromPath(product.image);
        const gallery = product.images ? JSON.parse(product.images) : [];
        gallery.forEach(deleteFileFromPath);

        // After deleting files, delete the entire product folder
        const safeSlug = sanitizeSlug(product.slug || "");
        const productFolder = path.join(UPLOADS_DIR, "products", safeSlug);
        if (fs.existsSync(productFolder)) {
          console.log("[DELETE_FOLDER] Deleting folder");
          fs.rmSync(productFolder, { recursive: true, force: true });
        }
      }
    }

    // For all entities, delete the database record
    // Handle contact-submissions table name with underscore
    const tableName =
      entity === "contact-submissions" ? "contact_submissions" : entity;
    await db.query(`DELETE FROM ${tableName} WHERE id = ?`, [id]);
    res.status(200).json({ message: `Deleted successfully` });
  } catch (err) {
    if (err.code === "ER_ROW_IS_REFERENCED_2")
      return res.status(400).json({ error: `Cannot delete, item is in use.` });
    handleError(res, err);
  }
});

// --- CONTACT FORM SUBMISSIONS ---

// GET /api/contact-submissions
app.get("/api/contact-submissions", async (req, res) => {
  try {
    const { search } = req.query;
    let query = "SELECT * FROM contact_submissions";
    const params = [];

    if (search) {
      query += " WHERE first_name LIKE ? OR last_name LIKE ? OR email LIKE ?";
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    query += " ORDER BY submitted_at DESC";
    const [rows] = await db.query(query, params);
    res.json(rows);
  } catch (err) {
    handleError(res, err, "Failed to fetch contact submissions.");
  }
});

// POST /api/contact-submissions
app.post("/api/contact-submissions", async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      phone,
      productDetails,
      message,
      occasion,
      numGifts,
      budget,
      source,
    } = req.body;

    // Basic validation
    if (!firstName || !phone) {
      return res
        .status(400)
        .json({ error: "First name and phone number are required." });
    }

    // Insert into database (with new optional fields)
    const [result] = await db.query(
      "INSERT INTO contact_submissions (first_name, last_name, email, phone, product_details, message, occasion, num_gifts, budget) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [
        firstName,
        lastName || null,
        email || null,
        phone,
        productDetails || null,
        message || null,
        occasion || null,
        Number.isFinite(parseInt(numGifts)) ? parseInt(numGifts) : null,
        budget || null,
      ]
    );

    // Send to Google Sheets with UTM data
    try {
      await sendToGoogleSheets({
        firstName,
        lastName: lastName || "",
        email: email || "",
        phone,
        productDetails: productDetails || "",
        message: message || "",
        occasion: occasion || "",
        numGifts: Number.isFinite(parseInt(numGifts)) ? parseInt(numGifts) : "",
        budget: budget || "",
        utm_source: req.body.utm_source || "",
        utm_medium: req.body.utm_medium || "",
        utm_campaign: req.body.utm_campaign || "",
        utm_term: req.body.utm_term || "",
        utm_content: req.body.utm_content || "",
        timestamp: new Date().toISOString(),
        source: source || "website",
      });
    } catch (sheetsError) {
      console.error("Failed to send to Google Sheets:", sheetsError);
      // Don't fail the request if Google Sheets fails
    }

    res.status(201).json({
      id: result.insertId,
      message: "Submission received successfully.",
    });
  } catch (err) {
    handleError(res, err, "Failed to save contact submission.");
  }
});

// Function to send data to Google Sheets
async function sendToGoogleSheets(data) {
  const GOOGLE_APPS_SCRIPT_URL = process.env.GOOGLE_APPS_SCRIPT_URL;

  if (!GOOGLE_APPS_SCRIPT_URL) {
    console.warn(
      "GOOGLE_APPS_SCRIPT_URL not configured, skipping Google Sheets integration"
    );
    return;
  }

  try {
    const response = await fetch(GOOGLE_APPS_SCRIPT_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(
        `Google Sheets API responded with status: ${response.status}`
      );
    }

    const result = await response.json();
    console.log("Successfully sent to Google Sheets:", result);
  } catch (error) {
    console.error("Error sending to Google Sheets:", error);
    throw error;
  }
}

app.post("/api/categories", upload.single("image"), async (req, res) => {
  try {
    const { name, description } = req.body;
    const slug = slugify(name);
    const imagePath = processUploadedFile(req.file, "categories", slug);
    const [result] = await db.query(
      "INSERT INTO categories (name, slug, description, image) VALUES (?, ?, ?, ?)",
      [name, slug, description, imagePath]
    );
    res.status(201).json({
      id: result.insertId,
      name,
      slug: slug,
      description,
      image: imagePath,
    });
  } catch (err) {
    handleError(res, err);
  }
});

app.put("/api/categories/:id", upload.single("image"), async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;
    let imagePath = req.body.image;
    const newSlug = slugify(name);

    if (req.file) {
      const [[category]] = await db.query(
        "SELECT slug FROM categories WHERE id = ?",
        [id]
      );
      const folderName = category ? category.slug : newSlug;
      imagePath = processUploadedFile(req.file, "categories", folderName);
    }
    await db.query(
      "UPDATE categories SET name = ?, slug = ?, description = ?, image = ? WHERE id = ?",
      [name, newSlug, description, imagePath, id]
    );
    res.status(200).json({ message: "Category updated successfully" });
  } catch (err) {
    handleError(res, err);
  }
});

app.post("/api/subcategories", upload.single("image"), async (req, res) => {
  try {
    const { category_id, name, description } = req.body;
    const slug = slugify(name);
    const imagePath = processUploadedFile(req.file, "subcategories", slug);
    const [result] = await db.query(
      "INSERT INTO subcategories (category_id, name, slug, description, image) VALUES (?, ?, ?, ?, ?)",
      [category_id, name, slug, description, imagePath]
    );
    res.status(201).json({
      id: result.insertId,
      name,
      slug: slug,
      description,
      image: imagePath,
      category_id,
    });
  } catch (err) {
    handleError(res, err);
  }
});

app.put("/api/subcategories/:id", upload.single("image"), async (req, res) => {
  try {
    const { id } = req.params;
    const { category_id, name, description } = req.body;
    let imagePath = req.body.image;
    const newSlug = slugify(name);
    if (req.file) {
      const [[subcategory]] = await db.query(
        "SELECT slug FROM subcategories WHERE id = ?",
        [id]
      );
      const folderName = subcategory ? subcategory.slug : newSlug;
      imagePath = processUploadedFile(req.file, "subcategories", folderName);
    }
    await db.query(
      "UPDATE subcategories SET category_id = ?, name = ?, slug = ?, description = ?, image = ? WHERE id = ?",
      [category_id, name, newSlug, description, imagePath, id]
    );
    res.status(200).json({ message: "Subcategory updated successfully" });
  } catch (err) {
    handleError(res, err);
  }
});

const productUploadFields = upload.fields([
  { name: "image", maxCount: 1 },
  { name: "images", maxCount: 10 },
]);

const upsertProduct = async (req, res) => {
  const { id } = req.params;
  let {
    name,
    description,
    price,
    packaging,
    category_id,
    subcategory_id,
    included_items,
    // Note: 'images_to_remove' is no longer used from the frontend.
    // We calculate deletions on the backend for reliability.
    existing_main_image,
    existing_gallery_images,
    // New optional fields
    tags,
    MOQ,
    isFeatured,
    sales,
  } = req.body;

  let processedFilePaths = [];

  try {
    // --- 1. Slug and Folder Management ---
    let newSlug = slugify(name);
    let oldSlug = null;
    let folderNameForUpload = null;
    let mustRenameFolder = false;

    // Normalize incoming gallery images to always be an array
    const keptGalleryFromFrontend = Array.isArray(existing_gallery_images)
      ? existing_gallery_images
      : existing_gallery_images
      ? [existing_gallery_images]
      : [];

    if (id) {
      // --- UPDATE EXISTING PRODUCT ---
      const [[currentProduct]] = await db.query(
        "SELECT slug, image, images FROM products WHERE id = ?",
        [id]
      );
      if (!currentProduct) {
        return res.status(404).json({ error: "Product not found" });
      }
      oldSlug = currentProduct.slug;
      folderNameForUpload = oldSlug; // Default to old folder

      // --- Backend-driven Image Deletion Logic ---
      const currentGalleryFromDb = currentProduct.images
        ? JSON.parse(currentProduct.images)
        : [];
      const currentMainImageFromDb = currentProduct.image;

      // 1. Gallery Images: Delete any URL that was in the DB but is not in the list sent from the frontend.
      const galleryUrlsToDelete = currentGalleryFromDb.filter(
        (dbUrl) => !keptGalleryFromFrontend.includes(dbUrl)
      );
      galleryUrlsToDelete.forEach(deleteFileFromPath);

      // 2. Main Image: Delete if it was in the DB, not sent from the frontend, AND no new main image is being uploaded.
      const keptMainImageFromFrontend = existing_main_image || null;
      if (
        currentMainImageFromDb &&
        !keptMainImageFromFrontend &&
        !req.files?.image?.[0]
      ) {
        deleteFileFromPath(currentMainImageFromDb);
      }
      // --- End of Deletion Logic ---

      // If name is cleared, keep the old slug.
      if (!newSlug) {
        newSlug = oldSlug;
      }

      // If slug is changing, check for conflicts and mark for rename
      if (newSlug !== oldSlug) {
        const [conflict] = await db.query(
          "SELECT 1 FROM products WHERE slug = ? AND id != ?",
          [newSlug, id]
        );
        if (conflict.length > 0) {
          newSlug = `${newSlug}-${Math.random().toString(36).substring(2, 8)}`;
        }
        mustRenameFolder = true;
      }
    } else {
      // --- CREATE NEW PRODUCT ---
      // If name is empty, create a placeholder slug.
      if (!newSlug) {
        newSlug = `product-${Date.now()}`;
      }

      // Check for slug conflicts
      const [conflict] = await db.query(
        "SELECT 1 FROM products WHERE slug = ?",
        [newSlug]
      );
      if (conflict.length > 0) {
        newSlug = `${newSlug}-${Math.random().toString(36).substring(2, 8)}`;
      }
      folderNameForUpload = newSlug; // New products use the new slug
    }

    // --- 2. Rename Folder & Update Existing Image Paths (if necessary) ---
    let keptMainImage = existing_main_image || null;
    let keptGalleryImages = keptGalleryFromFrontend;

    if (mustRenameFolder) {
      const safeOldSlug = sanitizeSlug(oldSlug || "");
      const safeNewSlug = sanitizeSlug(newSlug || "");

      const oldFolderPath = path.join(UPLOADS_DIR, "products", safeOldSlug);
      const newFolderPath = path.join(UPLOADS_DIR, "products", safeNewSlug);

      if (fs.existsSync(oldFolderPath)) {
        console.log("[RENAME] Renaming folder");
        fs.renameSync(oldFolderPath, newFolderPath);
      }

      // Update the URLs of images we are keeping - use hardcoded regex
      const slugRegex = /\/(?:[^/]+)\//g;
      if (keptMainImage) {
        keptMainImage = keptMainImage.replace(slugRegex, `/${safeNewSlug}/`);
      }
      keptGalleryImages = keptGalleryImages.map((url) =>
        url.replace(slugRegex, `/${safeNewSlug}/`)
      );

      // New uploads should go into the new folder
      folderNameForUpload = safeNewSlug;
    }

    // --- 3. This block is now handled by the backend-driven logic above ---
    // const toRemove = Array.isArray(images_to_remove) ...
    // toRemove.forEach(deleteFileFromPath);

    // --- 4. Process New File Uploads ---
    let newMainImagePath = null;
    if (req.files && req.files.image) {
      newMainImagePath = processUploadedFile(
        req.files.image[0],
        "products",
        folderNameForUpload
      );
      if (newMainImagePath) processedFilePaths.push(newMainImagePath);
    }

    const newGalleryImagePaths =
      req.files && req.files.images
        ? req.files.images
            .map((file) => {
              const p = processUploadedFile(
                file,
                "products",
                folderNameForUpload
              );
              if (p) processedFilePaths.push(p);
              return p;
            })
            .filter((p) => p !== null)
        : [];

    // --- 5. Determine Final Image State ---
    const finalMainImage = newMainImagePath || keptMainImage;
    const finalGalleryImages = [...keptGalleryImages, ...newGalleryImagePaths];

    // --- 6. Prepare and Execute Database Query ---
    const productData = [
      category_id,
      subcategory_id || null,
      name,
      newSlug, // Use the final, correct slug
      description,
      price,
      typeof included_items === "string"
        ? included_items
        : JSON.stringify(included_items || []),
      JSON.stringify(finalGalleryImages),
      packaging,
      finalMainImage,
      // New optional fields
      typeof tags === "string" ? tags : JSON.stringify(tags || []),
      MOQ ? parseInt(MOQ) : null,
      isFeatured === "true" || isFeatured === true ? 1 : 0,
      sales || null,
    ];

    if (id) {
      await db.query(
        "UPDATE products SET category_id = ?, subcategory_id = ?, name = ?, slug = ?, description = ?, price = ?, included_items = ?, images = ?, packaging = ?, image = ?, tags = ?, MOQ = ?, isFeatured = ?, sales = ? WHERE id = ?",
        [...productData, id]
      );
      res
        .status(200)
        .json({ message: "Product updated successfully", slug: newSlug });
    } else {
      const [result] = await db.query(
        "INSERT INTO products (category_id, subcategory_id, name, slug, description, price, included_items, images, packaging, image, tags, MOQ, isFeatured, sales) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
        productData
      );
      res.status(201).json({ id: result.insertId, slug: newSlug });
    }
  } catch (err) {
    // --- 7. Error Handling & Cleanup ---
    console.error(
      `[UPSERT_ERROR] Operation failed for product "${name}". Cleaning up uploaded files.`
    );
    processedFilePaths.forEach(deleteFileFromPath);
    handleError(
      res,
      err,
      `Failed to save product. ${
        err.code === "ER_DUP_ENTRY"
          ? "A product with this name already exists."
          : ""
      }`
    );
  }
};

app.post("/api/products", productUploadFields, upsertProduct);
app.put("/api/products/:id", productUploadFields, upsertProduct);

// --- Temporary script to organize images from /pictures folder ---
const ORGANIZE_PICTURES_TOKEN = "kevasiya_organize_script_20240702";

app.get("/organize-pictures", (req, res) => {
  if (req.query.token !== ORGANIZE_PICTURES_TOKEN) {
    return res
      .status(403)
      .send("Unauthorized. Please provide the correct token.");
  }

  const picturesDir = path.join(__dirname, "pictures");
  const destBaseDir = path.join(UPLOADS_DIR, "products");
  let output = "Starting picture organization process...<br>";

  if (!fs.existsSync(picturesDir)) {
    return res
      .status(404)
      .send(
        "Error: The source folder `/pictures` does not exist in the backend root."
      );
  }

  try {
    const files = fs.readdirSync(picturesDir);
    output += `Found ${files.length} items in /pictures.<br><br>`;

    for (const file of files) {
      const sourceFilePath = path.join(picturesDir, file);
      const fileStats = fs.statSync(sourceFilePath);

      if (fileStats.isFile()) {
        const fileNameWithoutExt = path.parse(file).name;
        const slug = slugify(fileNameWithoutExt);
        const destFolderPath = path.join(destBaseDir, slug);
        const destFilePath = path.join(destFolderPath, file);

        try {
          if (!fs.existsSync(destFolderPath)) {
            fs.mkdirSync(destFolderPath, { recursive: true });
            fs.chmodSync(destFolderPath, 0o777);
            output += `✅ Created folder: ${slug}<br>`;
          } else {
            output += `✔️ Folder exists: ${slug}<br>`;
          }

          fs.copyFileSync(sourceFilePath, destFilePath);
          output += `➡️ Copied ${file} to ${slug}/<br><br>`;
        } catch (e) {
          output += `❌ FAILED for ${file}: ${e.message}<br><br>`;
        }
      }
    }
    output += "Process finished.";
    res.status(200).send(output);
  } catch (err) {
    console.error("[ORGANIZE_PICTURES_ERROR]", err);
    res.status(500).send(`An error occurred: ${err.message}`);
  }
});

// --- INSTAGRAM TOKEN MANAGEMENT ---
let cachedTokens = {
  kevasiya_main: null,
  kevasiya_corporate: null,
  expires_at: null,
};

// Function to exchange short-lived token for long-lived token
const exchangeForLongLivedToken = async (shortLivedToken) => {
  try {
    const CLIENT_SECRET = process.env.INSTAGRAM_APP_SECRET;
    if (!CLIENT_SECRET) {
      throw new Error("INSTAGRAM_APP_SECRET is not set in environment variables");
    }

    const exchangeUrl = `https://graph.instagram.com/access_token?grant_type=ig_exchange_token&client_secret=${CLIENT_SECRET}&access_token=${shortLivedToken}`;

    const response = await fetch(exchangeUrl);
    const data = await response.json();

    if (data.error) {
      throw new Error(`Token exchange failed: ${data.error.message}`);
    }

    return data.access_token;
  } catch (error) {
    console.error("[TOKEN_EXCHANGE_ERROR]", error);
    throw error;
  }
};

// Function to refresh token if it's about to expire
const refreshTokenIfNeeded = async (currentToken) => {
  try {
    const refreshUrl = `https://graph.instagram.com/refresh_access_token?grant_type=ig_refresh_token&access_token=${currentToken}`;

    const response = await fetch(refreshUrl);
    const data = await response.json();

    if (data.error) {
      throw new Error(`Token refresh failed: ${data.error.message}`);
    }

    return data.access_token;
  } catch (error) {
    console.error("[TOKEN_REFRESH_ERROR]", error);
    throw error;
  }
};

// Endpoint to manually exchange tokens
app.post("/api/instagram-exchange-token", async (req, res) => {
  try {
    const { short_lived_token, account_type } = req.body;

    if (!short_lived_token || !account_type) {
      return res.status(400).json({
        error: "short_lived_token and account_type are required",
      });
    }

    if (!["kevasiya_main", "kevasiya_corporate"].includes(account_type)) {
      return res.status(400).json({
        error: "account_type must be 'kevasiya_main' or 'kevasiya_corporate'",
      });
    }

    const longLivedToken = await exchangeForLongLivedToken(short_lived_token);

    // Cache the token
    cachedTokens[account_type] = longLivedToken;
    cachedTokens.expires_at = Date.now() + 60 * 24 * 60 * 60 * 1000; // 60 days

    res.json({
      success: true,
      message: `Long-lived token generated for ${account_type}`,
      token: longLivedToken,
      expires_in_days: 60,
    });
  } catch (error) {
    handleError(res, error, "Failed to exchange Instagram token");
  }
});

// Helper function to get valid token
const getValidInstagramToken = async (accountType) => {
  // First try environment variables
  const envTokenKey =
    accountType === "kevasiya_main"
      ? "INSTAGRAM_ACCESS_TOKEN"
      : "INSTAGRAM_CORPORATE_ACCESS_TOKEN";

  const envToken = process.env[envTokenKey];
  if (envToken) {
    return envToken;
  }

  // Then try cached tokens
  const cachedToken = cachedTokens[accountType];
  if (
    cachedToken &&
    cachedTokens.expires_at &&
    Date.now() < cachedTokens.expires_at
  ) {
    // Try to refresh if we're within 7 days of expiry
    if (Date.now() > cachedTokens.expires_at - 7 * 24 * 60 * 60 * 1000) {
      try {
        const refreshedToken = await refreshTokenIfNeeded(cachedToken);
        cachedTokens[accountType] = refreshedToken;
        cachedTokens.expires_at = Date.now() + 60 * 24 * 60 * 60 * 1000;
        return refreshedToken;
      } catch (error) {
        console.warn(
          "[TOKEN_REFRESH_WARNING] Failed to refresh token, using existing:",
          error.message
        );
      }
    }
    return cachedToken;
  }

  return null;
};

// --- INSTAGRAM FEED API ---
app.get("/api/instagram-feed", async (req, res) => {
  try {
    const ACCESS_TOKEN = await getValidInstagramToken("kevasiya_main");

    if (!ACCESS_TOKEN) {
      console.error(
        "[INSTAGRAM_FEED] No valid token available. Please use /api/instagram-exchange-token endpoint."
      );
      return res.status(500).json({
        error:
          "Instagram integration requires token setup. Please contact administrator.",
        data: [],
        setup_required: true,
      });
    }

    const INSTAGRAM_API_URL = `https://graph.instagram.com/me/media?fields=id,caption,media_url,permalink,media_type,thumbnail_url,timestamp,username,like_count,comments_count&access_token=${ACCESS_TOKEN}&limit=6`;

    const response = await fetch(INSTAGRAM_API_URL);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("[INSTAGRAM_FEED] API Error:", errorText);

      // If token is invalid, clear the cached token
      if (
        errorText.includes("OAuthException") ||
        errorText.includes("Invalid OAuth")
      ) {
        cachedTokens.kevasiya_main = null;
      }

      return res.status(500).json({
        error: "Failed to fetch Instagram feed",
        details: errorText,
        data: [],
        token_expired: true,
      });
    }

    const data = await response.json();

    // Resolve carousel items to ensure we have a usable media_url/thumbnail
    if (data && Array.isArray(data.data)) {
      const resolved = await Promise.all(
        data.data.map(async (item) => {
          try {
            if (
              item.media_type === "CAROUSEL_ALBUM" &&
              (!item.media_url || !item.thumbnail_url)
            ) {
              const childRes = await fetch(
                `https://graph.instagram.com/${item.id}/children?fields=id,media_url,thumbnail_url,media_type&access_token=${ACCESS_TOKEN}`
              );
              const childJson = await childRes.json();
              const firstChild = childJson?.data?.[0];
              if (firstChild) {
                return {
                  ...item,
                  media_url: item.media_url || firstChild.media_url,
                  thumbnail_url: item.thumbnail_url || firstChild.thumbnail_url,
                };
              }
            }
          } catch (e) {
            console.warn(
              "[INSTAGRAM_FEED] Failed to resolve carousel child:",
              e
            );
          }
          return item;
        })
      );
      data.data = resolved;
    }

    res.json(data);
  } catch (err) {
    handleError(res, err, "Failed to fetch Instagram feed.");
  }
});

// --- INSTAGRAM FEED API FOR CORPORATE ACCOUNT ---
app.get("/api/instagram-feed-corporate", async (req, res) => {
  try {
    const CORPORATE_ACCESS_TOKEN = await getValidInstagramToken(
      "kevasiya_corporate"
    );

    if (!CORPORATE_ACCESS_TOKEN) {
      console.error(
        "[INSTAGRAM_FEED_CORPORATE] No valid token available. Please use /api/instagram-exchange-token endpoint."
      );
      return res.status(500).json({
        error:
          "Corporate Instagram integration requires token setup. Please contact administrator.",
        data: [],
        setup_required: true,
      });
    }

    const CORPORATE_API_URL = `https://graph.instagram.com/me/media?fields=id,caption,media_url,permalink,media_type,thumbnail_url,timestamp,username,like_count,comments_count&access_token=${CORPORATE_ACCESS_TOKEN}&limit=6`;

    const response = await fetch(CORPORATE_API_URL);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("[INSTAGRAM_FEED_CORPORATE] API Error:", errorText);

      // If token is invalid, clear the cached token
      if (
        errorText.includes("OAuthException") ||
        errorText.includes("Invalid OAuth")
      ) {
        cachedTokens.kevasiya_corporate = null;
      }

      return res.status(500).json({
        error: "Failed to fetch corporate Instagram feed",
        details: errorText,
        data: [],
        token_expired: true,
      });
    }

    const data = await response.json();

    // Resolve carousel items to ensure we have a usable media_url/thumbnail
    if (data && Array.isArray(data.data)) {
      const resolved = await Promise.all(
        data.data.map(async (item) => {
          try {
            if (
              item.media_type === "CAROUSEL_ALBUM" &&
              (!item.media_url || !item.thumbnail_url)
            ) {
              const childRes = await fetch(
                `https://graph.instagram.com/${item.id}/children?fields=id,media_url,thumbnail_url,media_type&access_token=${CORPORATE_ACCESS_TOKEN}`
              );
              const childJson = await childRes.json();
              const firstChild = childJson?.data?.[0];
              if (firstChild) {
                return {
                  ...item,
                  media_url: item.media_url || firstChild.media_url,
                  thumbnail_url: item.thumbnail_url || firstChild.thumbnail_url,
                };
              }
            }
          } catch (e) {
            console.warn(
              "[INSTAGRAM_FEED_CORPORATE] Failed to resolve carousel child:",
              e
            );
          }
          return item;
        })
      );
      data.data = resolved;
    }

    res.json(data);
  } catch (err) {
    handleError(res, err, "Failed to fetch corporate Instagram feed.");
  }
});

// --- TEST ENDPOINT TO IDENTIFY AVAILABLE ACCOUNTS ---
app.get("/api/instagram-accounts", async (req, res) => {
  try {
    const ACCESS_TOKEN = process.env.INSTAGRAM_ACCESS_TOKEN;

    // Get current user info
    const userResponse = await fetch(
      `https://graph.instagram.com/me?fields=id,username&access_token=${ACCESS_TOKEN}`
    );

    const userData = await userResponse.json();

    // Try to get accounts (this might not work for Instagram Basic Display API)
    let accountsData = null;
    try {
      const accountsResponse = await fetch(
        `https://graph.instagram.com/me/accounts?access_token=${ACCESS_TOKEN}`
      );
      if (accountsResponse.ok) {
        accountsData = await accountsResponse.json();
      }
    } catch (e) {
      console.log("Accounts endpoint not available");
    }

    res.json({
      current_user: userData,
      accounts: accountsData,
      message:
        "This shows what accounts are available with the current access token",
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- Server Start ---
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
