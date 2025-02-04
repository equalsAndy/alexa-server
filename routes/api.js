const express = require("express");
const router = express.Router();

// Dummy endpoint for Alexa to get devices
router.get("/devices", (req, res) => {
  res.json([
    { id: 1, name: "Living Room Light", state: "on" },
    { id: 2, name: "TV Volume", level: 50 },
  ]);
});

// Control devices
router.post("/devices/:id", (req, res) => {
  const { id } = req.params;
  const { action } = req.body;

  res.json({ success: true, message: `Device ${id} ${action}` });
});

module.exports = router;