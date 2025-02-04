const express = require("express");
const OAuth2Server = require("oauth2-server");

const router = express.Router();
const Request = OAuth2Server.Request;
const Response = OAuth2Server.Response;

const oauth = new OAuth2Server({
  model: require("../models/oauthModel"), // Your OAuth logic
});


router.get("/authorize", (req, res) => {
  res.send(`
    <form method="post" action="/oauth/authorize">
      <input type="hidden" name="response_type" value="code" />
      <input type="hidden" name="client_id" value="alexa-client" />
      <input type="hidden" name="redirect_uri" value="YOUR_ALEXA_REDIRECT_URL" />
      <input type="text" name="username" placeholder="Username" />
      <input type="password" name="password" placeholder="Password" />
      <button type="submit">Authorize</button>
    </form>
  `);
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