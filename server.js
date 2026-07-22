const express = require('express');
const path = require('path');
const app = express();

const PORT = 3000;
const OPENWEATHER_API_KEY = process.env.OPENWEATHER_API_KEY || '81add4ae89f6279d37e5ef23b3e9c5b3';

app.use(express.static(__dirname));

app.get('/api/weather', async (req, res) => {
  try {
    const { q, lat, lon, units = 'metric', lang = 'sv' } = req.query;
    let url = '';
    if (lat !== undefined && lon !== undefined && lat !== '' && lon !== '') {
      url = `https://api.openweathermap.org/data/2.5/weather?lat=${encodeURIComponent(lat)}&lon=${encodeURIComponent(lon)}&appid=${OPENWEATHER_API_KEY}&units=${encodeURIComponent(units)}&lang=${encodeURIComponent(lang)}`;
    } else if (q) {
      url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(q)}&appid=${OPENWEATHER_API_KEY}&units=${encodeURIComponent(units)}&lang=${encodeURIComponent(lang)}`;
    } else {
      return res.status(400).json({ error: 'Missing query parameters q or lat/lon' });
    }

    const apiRes = await fetch(url);
    const data = await apiRes.json();
    return res.status(apiRes.status).json(data);
  } catch (err) {
    console.error('Weather API Proxy Error:', err);
    return res.status(500).json({ error: 'Failed to fetch weather data' });
  }
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on port ${PORT}`);
});

