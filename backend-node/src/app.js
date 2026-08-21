require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const authRoutes = require('./routes/authRoutes');
const placeRoutes = require('./routes/placeRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const adminRoutes = require('./routes/adminRoutes');
const moderationRoutes = require('./routes/moderationRoutes');

const app = express();

app.use(cors({ origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173', credentials: true }));
app.use(express.json());

// Serve uploaded photos statically, e.g. GET /uploads/<filename>
app.use('/uploads', express.static(path.join(process.cwd(), process.env.UPLOAD_DIR || 'uploads')));

app.use('/api/auth', authRoutes);
app.use('/api/places', placeRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/moderation', moderationRoutes);

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

// ---- 404 + centralized error handling ----
app.use((req, res) => res.status(404).json({ status: 404, message: 'Route not found' }));

app.use((err, req, res, next) => {
  console.error(err);
  if (err.message && err.message.includes('Only JPEG')) {
    return res.status(400).json({ status: 400, message: err.message });
  }
  res.status(500).json({ status: 500, message: 'Something went wrong: ' + err.message });
});

module.exports = app;
