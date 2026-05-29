const db = require("./db"); // Make sure this path is correct for your setup
const path = require("path");
const fs = require("fs");

// --- Helper functions copied from server.js ---
const slugify = (text) => {
  if (!text) return "";
  return text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, "-") // Replace spaces with -
    .replace(/[^\w\-.]+/g, "") // Remove all non-word chars except dots
    .replace(/\-\-+/g, "-") // Replace multiple - with single -
    .replace(/^-+/, "") // Trim - from start of text
    .replace(/-+$/, ""); // Trim - from end of text
};

// Sanitizes a filename to be URL-friendly
const sanitizeFileName = (filename) => {
  if (!filename) return `file-${Date.now()}`;
  const extension = path.extname(filename);
  const name = path.basename(filename, extension);
  // Slugify the name part and re-attach the original (lowercased) extension
  return `${slugify(name)}${extension.toLowerCase()}`;
};

// --- Main Migration Logic ---
const migrateProductImages = async () => {
  console.log("Starting image migration script...");
  const publicBasePath = path.join(__dirname, "public");

  try {
    const [products] = await db.query(
      "SELECT id, slug, image, images FROM products"
    );
    console.log(`Found ${products.length} products to process.`);

    for (const product of products) {
      let hasChanged = false;
      console.log(`\nProcessing product ID: ${product.id}`);

      // --- 1. Process Main Image ---
      let newMainImagePath = product.image;
      if (product.image) {
        const oldFilename = path.basename(product.image);
        const sanitizedFilename = sanitizeFileName(oldFilename);

        if (oldFilename !== sanitizedFilename) {
          const oldFullPath = path.join(publicBasePath, product.image);
          const newFullPath = path.join(
            path.dirname(oldFullPath),
            sanitizedFilename
          );

          try {
            if (fs.existsSync(oldFullPath)) {
              fs.renameSync(oldFullPath, newFullPath);
              // Reconstruct the web path
              newMainImagePath = path
                .join(path.dirname(product.image), sanitizedFilename)
                .replace(/\\/g, "/");
              console.log(
                `  - Renamed main image: ${oldFilename} -> ${sanitizedFilename}`
              );
              hasChanged = true;
            } else {
              console.log(
                `  - WARNING: Main image file not found, skipping rename: ${oldFullPath}`
              );
            }
          } catch (err) {
            console.error(
              `  - ERROR renaming main image for product ${product.id}: ${err.message}`
            );
          }
        }
      }

      // --- 2. Process Gallery Images ---
      let currentGallery = [];
      let newGalleryPaths = [];
      try {
        if (product.images && product.images.length > 2) {
          // Basic check for valid JSON array
          currentGallery = JSON.parse(product.images);
        }
      } catch (e) {
        console.error(
          `  - ERROR parsing gallery JSON for product ${product.id}. Skipping gallery.`
        );
        currentGallery = [];
      }

      if (Array.isArray(currentGallery) && currentGallery.length > 0) {
        for (const imageUrl of currentGallery) {
          let newImageUrl = imageUrl; // Default to old url
          const oldFilename = path.basename(imageUrl);
          const sanitizedFilename = sanitizeFileName(oldFilename);

          if (oldFilename !== sanitizedFilename) {
            const oldFullPath = path.join(publicBasePath, imageUrl);
            const newFullPath = path.join(
              path.dirname(oldFullPath),
              sanitizedFilename
            );

            try {
              if (fs.existsSync(oldFullPath)) {
                fs.renameSync(oldFullPath, newFullPath);
                newImageUrl = path
                  .join(path.dirname(imageUrl), sanitizedFilename)
                  .replace(/\\/g, "/");
                console.log(
                  `  - Renamed gallery image: ${oldFilename} -> ${sanitizedFilename}`
                );
                if (!hasChanged) hasChanged = true;
              } else {
                console.log(
                  `  - WARNING: Gallery image file not found, skipping rename: ${oldFullPath}`
                );
              }
            } catch (err) {
              console.error(
                `  - ERROR renaming gallery image for product ${product.id}: ${err.message}`
              );
            }
          }
          newGalleryPaths.push(newImageUrl);
        }
      } else {
        newGalleryPaths = currentGallery;
      }

      // --- 3. Update database if any changes were made ---
      if (hasChanged) {
        try {
          await db.query(
            "UPDATE products SET image = ?, images = ? WHERE id = ?",
            [newMainImagePath, JSON.stringify(newGalleryPaths), product.id]
          );
          console.log(
            `  - SUCCESS: Updated database for product ID: ${product.id}`
          );
        } catch (dbErr) {
          console.error(
            `  - FATAL DB ERROR for product ID ${product.id}: ${dbErr.message}`
          );
        }
      } else {
        console.log("  - No changes needed for this product.");
      }
    }

    console.log("\n\nMigration script finished successfully!");
  } catch (error) {
    console.error("A critical error occurred during the migration:", error);
  } finally {
    if (db.end) {
      db.end();
      console.log("Database connection closed.");
    }
  }
};

// --- Run the migration ---
migrateProductImages();
