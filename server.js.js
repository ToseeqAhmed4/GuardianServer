const express = require('express');
const fetch = require('node-fetch');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

// Replace with your Google Geolocation API key
const GOOGLE_API_KEY = "YOUR_GOOGLE_API_KEY";

// Device token for security
const DEVICE_TOKEN = "123456";

// Root endpoint to test server
app.get('/', (req, res) => {
  res.send('Guardian Server is running on cloud!');
});

// Geolocation endpoint for ESP32
app.post('/geolocate', async (req, res) => {
  try {
    const token = req.headers['x-device-token'];
    if (token !== DEVICE_TOKEN) {
      return res.status(401).json({ error: "Unauthorized device" });
    }

    const response = await fetch(
      `https://www.googleapis.com/geolocation/v1/geolocate?key=${GOOGLE_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(req.body)
      }
    );

    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// Use environment port for cloud hosting
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Guardian Server running on port ${PORT}`);
});
