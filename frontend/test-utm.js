/**
 * Test script for UTM parameter extraction
 * Run this to test the UTM extraction logic
 */

// Mock the extractUTMParams function for testing
function extractUTMParams(url) {
  const urlParams = new URLSearchParams(url.split("?")[1] || "");
  const utmParams = {};

  // Extract UTM parameters
  const utmKeys = [
    "utm_source",
    "utm_medium",
    "utm_campaign",
    "utm_term",
    "utm_content",
  ];

  utmKeys.forEach((key) => {
    const value = urlParams.get(key);
    if (value) {
      utmParams[key] = value;
    }
  });

  return utmParams;
}

// Test cases
const testUrls = [
  "https://kevasiya.com/contact?utm_source=Google&utm_medium=cpc&utm_campaign=Stealth-Generic-Study-Abroad-2025",
  "https://kevasiya.com/corporates?utm_source=Facebook&utm_medium=social&utm_campaign=Corporate-Gifting-2025",
  "https://kevasiya.com/contact?utm_source=LinkedIn&utm_medium=social&utm_campaign=B2B-Outreach&utm_term=corporate+gifts",
  "https://kevasiya.com/contact",
  "https://kevasiya.com/contact?utm_source=Google&utm_medium=cpc&utm_campaign=Test&utm_content=banner_ad_1&utm_term=corporate+gifts",
];

console.log("🧪 Testing UTM Parameter Extraction\n");

testUrls.forEach((url, index) => {
  console.log(`Test ${index + 1}: ${url}`);
  const utmParams = extractUTMParams(url);

  if (Object.keys(utmParams).length === 0) {
    console.log("   Result: No UTM parameters found");
  } else {
    console.log("   Result:");
    Object.entries(utmParams).forEach(([key, value]) => {
      console.log(`     ${key}: ${value}`);
    });
  }
  console.log("");
});

console.log("✅ UTM extraction test completed!");
console.log("\n📝 Next steps:");
console.log("1. Set up Google Apps Script following the guide");
console.log("2. Update your backend .env file");
console.log("3. Run the database migration");
console.log("4. Test with real forms on your website");
