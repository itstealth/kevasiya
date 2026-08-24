/**
 * Google Sheet Headers Reference — Kevasiya website form submissions
 *
 * You normally do NOT need to do anything manually: google-apps-script.js
 * writes these headers automatically on the first submission, and you can
 * also run its setupSheet() function once from the Apps Script editor.
 *
 * This file exists only as a reference for the expected column order.
 * If you change it here, change HEADERS and buildRow_() in
 * google-apps-script.js to match, or columns will silently misalign.
 *
 * Tab name: "website"
 *
 *   A  Timestamp                 (added by the script, not the form)
 *   B  First Name                firstName
 *   C  Last Name                 lastName
 *   D  Email                     email
 *   E  Phone                     phone
 *   F  Product Details           productDetails
 *   G  Occasion                  occasion
 *   H  No. of Hampers/Gifts      numGifts
 *   I  Budget                    budget
 *   J  Additional Information    message
 *   K  UTM Source                utm_source
 *   L  UTM Medium                utm_medium
 *   M  UTM Campaign              utm_campaign
 *   N  UTM Term                  utm_term
 *   O  UTM Content               utm_content
 *   P  Source                    source        (defaults to "website")
 *   Q  Submission Timestamp      timestamp     (ISO string from the backend)
 *
 * 17 columns, A through Q.
 */

// Reference only - no actual code to run.
console.log(
  "Headers are created automatically by google-apps-script.js. " +
    "See the comment above for the expected column order."
);
