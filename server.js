require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const OAuth2Server = require("oauth2-server");
const bcrypt = require("bcryptjs");

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const Request = OAuth2Server.Request;
const Response = OAuth2Server.Response;

// Dummy user (replace with real DB authentication)
const users = [
  { id: 1, username: "admin", password: bcrypt.hashSync("password", 10) },
];

const model = {
  getClient: (clientId, clientSecret) => {
    if (clientId === "alexa-client" && clientSecret === "alexa-secret") {
      return { clientId, grants: ["authorization_code", "refresh_token"] };
    }
    return null;
  },
  getUser: async (username, password) => {
    const user = users.find((u) => u.username === username);
    if (user && bcrypt.compareSync(password, user.password)) return user;
    return null;
  },
  saveToken: async (token, client, user) => ({
    accessToken: token.accessToken,
    accessTokenExpiresAt: token.accessTokenExpiresAt,
    client,
    user,
  }),
  getAccessToken: async (accessToken) => ({
    accessToken,
    accessTokenExpiresAt: new Date(Date.now() + 60 * 60 * 1000),
    client: { clientId: "alexa-client" },
    user: users[0],
  }),
};

const oauth = new OAuth2Server({ model });

app.post("/oauth/token", async (req, res) => {
  const request = new Request(req);
  const response = new Response(res);
  try {
    const token = await oauth.token(request, response);
    res.json(token);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.get("/oauth/authorize", (req, res) => {
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

app.post("/oauth/authorize", async (req, res) => {
  const user = await model.getUser(req.body.username, req.body.password);
  if (!user) return res.status(401).send("Invalid credentials");

  const authCode = "AUTH_CODE_123"; // Generate a real authorization code
  res.redirect(`${req.body.redirect_uri}?code=${authCode}`);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`OAuth server running on port ${PORT}`));
