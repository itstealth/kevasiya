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
 *   F  Occasion                  occasion
 *   G  No. of Hampers/Gifts      numGifts
 *   H  Budget                    budget
 *   I  Additional Information    message
 *   J  UTM Source                utm_source
 *   K  UTM Medium                utm_medium
 *   L  UTM Campaign              utm_campaign
 *   M  UTM Term                  utm_term
 *   N  UTM Content               utm_content
 *   O  Source                    source        (defaults to "website")
 *   P  Submission Timestamp      timestamp     (ISO string from the backend)
 *
 * 16 columns, A through P.
 */

// Reference only - no actual code to run.
console.log(
  "Headers are created automatically by google-apps-script.js. " +
    "See the comment above for the expected column order."
);
