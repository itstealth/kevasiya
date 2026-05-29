/**
 * Google Apps Script for Kevasiya Website Form Submissions
 *
 * Instructions:
 * 1. Go to https://script.google.com/
 * 2. Create a new project
 * 3. Replace the default code with this code
 * 4. Deploy as a web app
 * 5. Set access to "Anyone, even anonymous"
 * 6. Copy the web app URL and add it to your backend .env file as GOOGLE_APPS_SCRIPT_URL
 */

// Replace this with your Google Sheet ID
const SHEET_ID = "1xMeAuqouZlaFUM3Y4zFBnL9wb8MJYwg4Aihr5ZJCCOU";
const SHEET_NAME = "website";

function doPost(e) {
  try {
    // Parse the incoming JSON data
    const data = JSON.parse(e.postData.contents);

    // Log the received data for debugging
    console.log("Received data:", data);

    // Get the active spreadsheet and sheet
    const spreadsheet = SpreadsheetApp.openById(SHEET_ID);
    const sheet = spreadsheet.getSheetByName(SHEET_NAME);

    if (!sheet) {
      throw new Error(`Sheet "${SHEET_NAME}" not found`);
    }

    // Prepare the row data
    const rowData = [
      new Date(), // Timestamp
      data.firstName || "",
      data.lastName || "",
      data.email || "",
      data.phone || "",
      data.productDetails || "",
      data.occasion || "",
      data.numGifts || "",
      data.budget || "",
      data.message || "",
      data.utm_source || "",
      data.utm_medium || "",
      data.utm_campaign || "",
      data.utm_term || "",
      data.utm_content || "",
      data.source || "website",
      data.timestamp || new Date().toISOString(),
    ];

    // Append the data to the sheet
    sheet.appendRow(rowData);

    // Return success response
    return ContentService.createTextOutput(
      JSON.stringify({
        success: true,
        message: "Data successfully written to Google Sheets",
        timestamp: new Date().toISOString(),
      })
    ).setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    console.error("Error processing request:", error);

    // Return error response
    return ContentService.createTextOutput(
      JSON.stringify({
        success: false,
        error: error.message,
        timestamp: new Date().toISOString(),
      })
    )
      .setMimeType(ContentService.MimeType.JSON)
      .setStatusCode(500);
  }
}

function doGet(e) {
  // Handle GET requests (for testing)
  return ContentService.createTextOutput(
    JSON.stringify({
      message: "Kevasiya Form Handler is running",
      timestamp: new Date().toISOString(),
      instructions: "Send POST requests with form data to this endpoint",
    })
  ).setMimeType(ContentService.MimeType.JSON);
}

/**
 * Setup function to create headers in the sheet
 * Run this once after creating your Google Sheet
 */
function setupSheet() {
  try {
    const spreadsheet = SpreadsheetApp.openById(SHEET_ID);
    const sheet = spreadsheet.getSheetByName(SHEET_NAME);

    if (!sheet) {
      // Create the sheet if it doesn't exist
      const newSheet = spreadsheet.insertSheet(SHEET_NAME);
      setupHeaders(newSheet);
    } else {
      setupHeaders(sheet);
    }

    console.log("Sheet setup completed successfully");
  } catch (error) {
    console.error("Error setting up sheet:", error);
  }
}

function setupHeaders(sheet) {
  // Define the headers
  const headers = [
    "Timestamp",
    "First Name",
    "Last Name",
    "Email",
    "Phone",
    "Product Details",
    "Occasion",
    "No. of Hampers/Gifts",
    "Budget",
    "Additional Information",
    "UTM Source",
    "UTM Medium",
    "UTM Campaign",
    "UTM Term",
    "UTM Content",
    "Source",
    "Submission Timestamp",
  ];

  // Set headers in the first row
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);

  // Format headers (make them bold and centered)
  sheet
    .getRange(1, 1, 1, headers.length)
    .setFontWeight("bold")
    .setHorizontalAlignment("center")
    .setBackground("#f0f0f0");

  // Auto-resize columns
  sheet.autoResizeColumns(1, headers.length);

  // Freeze the header row
  sheet.setFrozenRows(1);
}
