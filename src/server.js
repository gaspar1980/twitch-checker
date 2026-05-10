require('dotenv').config();
const express = require('express');
const session = require('express-session');
const path = require('path');
const authRoutes = require('./routes/auth');
const apiRoutes = require('./routes/api');
const webhookRoutes = require('./routes/webhook');

const app = express();
const PORT = process.env.PORT || 3000;

// Webhook must be mounted BEFORE express.json() — it uses its own raw body parser
app.use('/webhook/twitch', webhookRoutes);

app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

const isProduction = process.env.NODE_ENV === 'production';
app.set('trust proxy', 1); // Railway sits behind a proxy
app.use(session({
  secret: process.env.SESSION_SECRET || 'twitch-checker-secret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: isProduction,  // HTTPS only in production
    maxAge: 1000 * 60 * 60,
  },
}));

app.use('/auth', authRoutes);
app.use('/api', apiRoutes);

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

app.get('/dashboard', (req, res) => {
  if (!req.session.accessToken) {
    return res.redirect('/');
  }
  res.sendFile(path.join(__dirname, '../public/dashboard.html'));
});

app.listen(PORT, () => {
  console.log(`Twitch Checker running on http://localhost:${PORT}`);
});
