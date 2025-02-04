require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");

const https = require("https");
const fs = require("fs");

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Load OAuth & API Routes
const oauthRoutes = require("./routes/oauth");
const apiRoutes = require("./routes/api");

// Load SSL certificate
const options = {
  key: fs.readFileSync("/etc/ssl/private/selfsigned.key"), // Change this if using Certbot
  cert: fs.readFileSync("/etc/ssl/certs/selfsigned.crt")   // Change this if using Certbot
};

// Use HTTPS
https.createServer(options, app).listen(443, () => {
  console.log("Server running on HTTPS port 443");
});

app.use("/oauth", oauthRoutes);
app.use("/api", apiRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));