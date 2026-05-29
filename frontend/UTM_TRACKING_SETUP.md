# UTM Tracking & Google Sheets Integration Setup Guide

This guide will help you set up UTM tracking for your Kevasiya website forms and integrate them with Google Sheets for lead tracking.

## 🎯 What This Implementation Does

1. **Captures UTM Parameters**: Automatically extracts UTM parameters from URLs (e.g., `/?utm_source=Google&utm_medium=cpc&utm_campaign=Stealth-Generic-Study-Abroad-2025`)
2. **Form Data Collection**: Collects name, email, phone, message, and UTM data from both forms:
   - Corporate Query Form (`/corporates`)
   - Contact Form (`/contact`)
3. **Database Storage**: Stores all data in your MySQL database
4. **Google Sheets Integration**: Automatically sends data to Google Sheets for lead tracking and analysis

## 📋 Prerequisites

- Google account with access to Google Sheets
- Google Apps Script access
- Your backend server running (currently on port 5001)

## 🚀 Step-by-Step Setup

### Step 1: Create Google Sheet

1. Go to [Google Sheets](https://sheets.google.com)
2. Create a new spreadsheet
3. Name it something like "Kevasiya Lead Tracking"
4. Copy the Sheet ID from the URL (the long string between `/d/` and `/edit`)

### Step 2: Set Up Google Apps Script

1. Go to [Google Apps Script](https://script.google.com)
2. Click "New Project"
3. Replace the default code with the content from `backend-kevasiya/google-apps-script.js`
4. **IMPORTANT**: Replace `YOUR_GOOGLE_SHEET_ID_HERE` with your actual Sheet ID
5. Save the project with a name like "Kevasiya Form Handler"

### Step 3: Deploy Google Apps Script

1. Click "Deploy" → "New deployment"
2. Choose "Web app" as the type
3. Set "Execute as" to your Google account
4. Set "Who has access" to "Anyone, even anonymous"
5. Click "Deploy"
6. Copy the Web App URL (it will look like: `https://script.google.com/macros/s/SCRIPT_ID/exec`)

### Step 4: Update Backend Environment

1. Open `backend-kevasiya/.env`
2. Replace the placeholder URL with your actual Google Apps Script URL:
   ```
   GOOGLE_APPS_SCRIPT_URL=https://script.google.com/macros/s/YOUR_ACTUAL_SCRIPT_ID/exec
   ```

### Step 5: Update Database Schema

1. Run the migration script to create the `contact_submissions` table:

   ```sql
   -- Connect to your MySQL database and run:
   USE kevasiya;

   -- Create contact_submissions table
   CREATE TABLE IF NOT EXISTS contact_submissions (
       id INT AUTO_INCREMENT PRIMARY KEY,
       first_name VARCHAR(255) NOT NULL,
       last_name VARCHAR(255),
       email VARCHAR(255),
       phone VARCHAR(20) NOT NULL,
       product_details TEXT,
       message TEXT,
       utm_source VARCHAR(255),
       utm_medium VARCHAR(255),
       utm_campaign VARCHAR(255),
       utm_term VARCHAR(255),
       utm_content VARCHAR(255),
       submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
   );

   -- Add indexes for better performance
   CREATE INDEX idx_contact_submissions_email ON contact_submissions(email);
   CREATE INDEX idx_contact_submissions_phone ON contact_submissions(phone);
   CREATE INDEX idx_contact_submissions_utm_campaign ON contact_submissions(utm_campaign);
   CREATE INDEX idx_contact_submissions_submitted_at ON contact_submissions(submitted_at);
   ```

### Step 6: Restart Backend Server

1. Stop your backend server (Ctrl+C)
2. Start it again: `node server.js`
3. The server will now handle UTM parameters and send data to Google Sheets

## 🧪 Testing the Integration

### Test UTM Tracking

1. Visit your website with UTM parameters:

   ```
   https://yourwebsite.com/contact?utm_source=Google&utm_medium=cpc&utm_campaign=Test-Campaign
   ```

2. Fill out and submit the contact form

3. Check your Google Sheet - you should see a new row with:
   - Form data (name, email, phone, message)
   - UTM parameters (source, medium, campaign)
   - Timestamp

### Test Different Forms

- **Corporate Form**: `/corporates` page
- **Contact Form**: `/contact` page
- Both should capture UTM parameters and send data to Google Sheets

## 📊 Google Sheets Structure

Your sheet will have these columns:

| Column               | Description                    | Example                           |
| -------------------- | ------------------------------ | --------------------------------- |
| Timestamp            | When data was written to sheet | 2025-01-15 10:30:00               |
| First Name           | User's first name              | John                              |
| Last Name            | User's last name               | Doe                               |
| Email                | User's email                   | john@example.com                  |
| Phone                | User's phone number            | 9876543210                        |
| Product Details      | Product inquiry details        | Corporate Gifting Inquiry         |
| Message              | User's message                 | I need corporate gifts            |
| UTM Source           | Traffic source                 | Google                            |
| UTM Medium           | Marketing medium               | cpc                               |
| UTM Campaign         | Campaign name                  | Stealth-Generic-Study-Abroad-2025 |
| UTM Term             | Keywords                       | corporate gifts                   |
| UTM Content          | Ad content                     | banner_ad_1                       |
| Source               | Form source                    | website                           |
| Submission Timestamp | When form was submitted        | 2025-01-15T10:30:00.000Z          |

## 🔧 Troubleshooting

### Common Issues

1. **"GOOGLE_APPS_SCRIPT_URL not configured"**

   - Check your `.env` file has the correct URL
   - Restart the backend server after updating `.env`

2. **"Sheet not found" error**

   - Verify the Sheet ID in your Google Apps Script
   - Make sure the sheet name is "Form Submissions"

3. **Data not appearing in Google Sheets**

   - Check the Google Apps Script logs
   - Verify the script is deployed as a web app
   - Check that access is set to "Anyone, even anonymous"

4. **UTM parameters not captured**
   - Ensure you're using the correct URL format
   - Check browser console for JavaScript errors
   - Verify the forms are using the updated code

### Debugging Steps

1. **Check Backend Logs**: Look for Google Sheets API responses
2. **Check Google Apps Script Logs**: View execution logs in the Apps Script editor
3. **Test with Simple UTM**: Use basic parameters first: `?utm_source=test&utm_medium=test`

## 📈 Advanced Features

### Custom UTM Parameters

You can add custom UTM parameters by modifying the `extractUTMParams()` function in `src/lib/utils.ts`:

```typescript
// Add custom parameters
const customKeys = ["custom_param", "another_param"];
customKeys.forEach((key) => {
  const value = urlParams.get(key);
  if (value) {
    utmParams[key] = value;
  }
});
```

### Multiple Google Sheets

To send data to multiple sheets, modify the `sendToGoogleSheets` function in `server.js`:

```javascript
// Send to multiple sheets
await Promise.all([
  sendToGoogleSheets(data, "SHEET_URL_1"),
  sendToGoogleSheets(data, "SHEET_URL_2"),
]);
```

## 🎉 Success!

Once everything is set up, you'll have:

✅ **Automatic UTM tracking** from any URL with UTM parameters  
✅ **Form data collection** from both corporate and contact forms  
✅ **Real-time data** flowing to Google Sheets  
✅ **Database backup** of all submissions  
✅ **Lead tracking** for marketing campaigns

Your marketing team can now track which campaigns, sources, and mediums are driving the most leads!

## 📞 Support

If you encounter issues:

1. Check the troubleshooting section above
2. Review backend server logs
3. Check Google Apps Script execution logs
4. Verify all environment variables are set correctly
