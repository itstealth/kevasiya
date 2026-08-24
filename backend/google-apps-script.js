/**
 * Google Apps Script for Kevasiya Website Form Submissions
 *
 * SETUP (fastest path — bound script, no Sheet ID needed):
 *   1. Create the new Google Sheet in the itstealth account.
 *   2. In that sheet: Extensions > Apps Script.
 *   3. Paste this whole file over the default Code.gs, then Save.
 *   4. Deploy > New deployment > type "Web app"
 *        - Execute as:       Me (the itstealth account)
 *        - Who has access:   Anyone
 *      Authorise when prompted.
 *   5. Copy the /exec URL into the BACKEND env as GOOGLE_APPS_SCRIPT_URL.
 *
 * Headers are created automatically on the first submission, so there is
 * nothing to set up by hand. You can also run setupSheet() once to create
 * the tab + headers up front.
 *
 * OPTIONAL (standalone script instead of bound): set a SHEET_ID script
 * property under Project Settings > Script Properties.
 */

// Tab name to write into. Override via Script Property SHEET_NAME.
const SHEET_NAME = getProp_("SHEET_NAME") || "website";

// Only needed for a STANDALONE script. Left blank for a bound script,
// which resolves the spreadsheet it lives in automatically.
const SHEET_ID = getProp_("SHEET_ID") || "";

// Column order. This MUST stay in sync with buildRow_() below.
const HEADERS = [
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

function getProp_(key) {
  try {
    return PropertiesService.getScriptProperties().getProperty(key);
  } catch (err) {
    return null;
  }
}

/** Resolves the target spreadsheet, bound or standalone. */
function getSpreadsheet_() {
  if (SHEET_ID) {
    return SpreadsheetApp.openById(SHEET_ID);
  }
  const active = SpreadsheetApp.getActiveSpreadsheet();
  if (!active) {
    throw new Error(
      "No spreadsheet found. Either bind this script to a Sheet " +
        "(Extensions > Apps Script) or set the SHEET_ID script property."
    );
  }
  return active;
}

/** Returns the target tab, creating it (with headers) if missing. */
function getOrCreateSheet_() {
  const spreadsheet = getSpreadsheet_();
  let sheet = spreadsheet.getSheetByName(SHEET_NAME);

  if (!sheet) {
    sheet = spreadsheet.insertSheet(SHEET_NAME);
  }
  if (sheet.getLastRow() === 0) {
    writeHeaders_(sheet);
  }
  return sheet;
}

/** Maps the incoming payload onto HEADERS order. */
function buildRow_(data) {
  return [
    new Date(), // Timestamp (when the row was written)
    data.firstName || "",
    data.lastName || "",
    data.email || "",
    data.phone || "",
    data.productDetails || "",
    data.occasion || "",
    data.numGifts || data.numGifts === 0 ? data.numGifts : "",
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
}

function jsonOut_(payload) {
  // NOTE: Apps Script web apps cannot set custom HTTP status codes.
  // Callers must branch on the `success` field, not on the status.
  return ContentService.createTextOutput(
    JSON.stringify(payload)
  ).setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  try {
    if (!e || !e.postData || !e.postData.contents) {
      throw new Error("Empty request body");
    }

    const data = JSON.parse(e.postData.contents);
    console.log("Received data:", data);

    const sheet = getOrCreateSheet_();
    sheet.appendRow(buildRow_(data));

    return jsonOut_({
      success: true,
      message: "Data successfully written to Google Sheets",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error processing request:", error);
    return jsonOut_({
      success: false,
      error: String((error && error.message) || error),
      timestamp: new Date().toISOString(),
    });
  }
}

function doGet(e) {
  // Health check. Visit the /exec URL in a browser to confirm the
  // deployment is live and pointed at the right spreadsheet.
  try {
    const spreadsheet = getSpreadsheet_();
    return jsonOut_({
      success: true,
      message: "Kevasiya Form Handler is running",
      spreadsheetName: spreadsheet.getName(),
      spreadsheetId: spreadsheet.getId(),
      sheetName: SHEET_NAME,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return jsonOut_({
      success: false,
      error: String((error && error.message) || error),
      timestamp: new Date().toISOString(),
    });
  }
}

/** Optional: run once from the editor to create the tab + headers up front. */
function setupSheet() {
  const sheet = getOrCreateSheet_();
  writeHeaders_(sheet);
  console.log("Sheet setup completed on tab: " + SHEET_NAME);
}

function writeHeaders_(sheet) {
  sheet.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS]);
  sheet
    .getRange(1, 1, 1, HEADERS.length)
    .setFontWeight("bold")
    .setHorizontalAlignment("center")
    .setBackground("#f0f0f0");
  sheet.autoResizeColumns(1, HEADERS.length);
  sheet.setFrozenRows(1);
}

/** Optional: run once from the editor to append a fake row end-to-end. */
function testAppend() {
  const sheet = getOrCreateSheet_();
  sheet.appendRow(
    buildRow_({
      firstName: "Test",
      lastName: "Lead",
      email: "test@example.com",
      phone: "9999999999",
      productDetails: "Corporate Gifting Inquiry",
      occasion: "Diwali",
      numGifts: 50,
      budget: "1000-2000",
      message: "Ignore - script test",
      utm_source: "manual-test",
      source: "apps-script-test",
      timestamp: new Date().toISOString(),
    })
  );
  console.log("Test row appended to: " + SHEET_NAME);
}
