const express = require("express");
const OAuth2Server = require("oauth2-server");

const router = express.Router();
const Request = OAuth2Server.Request;
const Response = OAuth2Server.Response;

const oauth = new OAuth2Server({
  model: require("../models/oauthModel"), // Your OAuth logic
});

router.post("/token", async (req, res) => {
  const request = new Request(req);
  const response = new Response(res);
  try {
    const token = await oauth.token(request, response);
    res.json(token);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;