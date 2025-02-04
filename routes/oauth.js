require("dotenv").config();
const express = require("express");
const router = express.Router();

// Load mock users from .env
const users = [
  { username: process.env.MOCK_USER_1, password: process.env.MOCK_PASS_1 },
  { username: process.env.MOCK_USER_2, password: process.env.MOCK_PASS_2 },
];

// Render login form
router.get("/authorize", (req, res) => {
  res.send(`
    <form method="post" action="/oauth/authorize">
      <input type="hidden" name="response_type" value="code" />
      <input type="hidden" name="client_id" value="alexa-client" />
      <input type="hidden" name="redirect_uri" value="YOUR_ALEXA_REDIRECT_URL" />
      <input type="text" name="username" placeholder="Username" required />
      <input type="password" name="password" placeholder="Password" required />
      <button type="submit">Authorize</button>
    </form>
  `);
});

router.post("/token", (req, res) => {
    const { grant_type, code, client_id, client_secret } = req.body;
  
    // Verify client credentials
    if (client_id !== process.env.OAUTH_CLIENT_ID || client_secret !== process.env.OAUTH_CLIENT_SECRET) {
      return res.status(401).json({ error: "Invalid client credentials" });
    }
  
    // Only support authorization_code for now
    if (grant_type !== "authorization_code") {
      return res.status(400).json({ error: "Unsupported grant type" });
    }
  
    // Check if the auth code is valid
    if (code !== "AUTH_CODE_123") {
      return res.status(400).json({ error: "Invalid authorization code" });
    }
  
    // Generate a fake access token
    const accessToken = "FAKE_ACCESS_TOKEN_456";
    const expiresIn = 3600; // 1 hour expiration
  
    res.json({
      access_token: accessToken,
      token_type: "bearer",
      expires_in: expiresIn
    });
  });

// Handle login
router.post("/authorize", (req, res) => {
    const { username, password, client_id, redirect_uri } = req.body;
  
    // Validate user credentials
    const user = users.find(u => u.username === username && u.password === password);
    if (!user) {
      return res.status(401).send("Invalid credentials. Try again.");
    }
  
    // Generate a fake authorization code
    const authCode = "AUTH_CODE_123";
  
    // Redirect to the proper Alexa Redirect URI
    if (!redirect_uri) {
      return res.status(400).send("Missing redirect URI.");
    }
  
    res.redirect(`${redirect_uri}?code=${authCode}`);
  });

module.exports = router;