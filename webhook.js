const express = require("express");
const crypto = require("crypto");
const { exec } = require("child_process");

const app = express();
const PORT = 3001;
const SECRET = process.env.WEBHOOK_SECRET || "V3ryS3cretWebhookToken"; // Make sure this matches your GitHub webhook secret!

// Capture raw body for signature verification
app.use(
  express.json({
    verify: (req, res, buf) => {
      req.rawBody = buf;
    },
  })
);

function verifySignature(req) {
  const signature =
    req.headers["x-hub-signature-256"] || req.headers["x-hub-signature"];
  if (!signature) return false;

  const hmac = crypto.createHmac("sha256", SECRET);
  const digest = "sha256=" + hmac.update(req.rawBody).digest("hex");
  return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(digest));
}

app.post("/webhook", (req, res) => {
  if (!verifySignature(req)) {
    console.log("❌ Invalid signature.");
    return res.status(403).send("Invalid signature.");
  }

  const repoName = req.body.repository?.name;
  console.log(`✅ Valid webhook received for repo: ${repoName}`);

  if (repoName === "kevasiya-website" || repoName === "kevasiya") {
    exec(
      "/var/www/kevasiya.com/kevasiya.com/deploy_frontend.sh",
      (error, stdout, stderr) => {
        if (error) {
          console.error(`❌ Frontend error: ${error.message}`);
          return;
        }
        console.log(`✅ Frontend STDOUT: ${stdout}`);
        console.error(`⚠️ Frontend STDERR: ${stderr}`);
      }
    );
  } else if (repoName === "backend-kevasiya") {
    exec(
      "/var/www/kevasiya.com/kevasiya.com/deploy_backend.sh",
      (error, stdout, stderr) => {
        if (error) {
          console.error(`❌ Backend error: ${error.message}`);
          return;
        }
        console.log(`✅ Backend STDOUT: ${stdout}`);
        console.error(`⚠️ Backend STDERR: ${stderr}`);
      }
    );
  } else {
    console.log(`⚠️ Unknown repo: ${repoName}`);
  }

  res.status(200).send("Deploy started.");
});

app.listen(PORT, () => {
  console.log(`🚀 Webhook listener running on port ${PORT}`);
});
