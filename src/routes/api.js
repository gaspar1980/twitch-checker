const express = require('express');
const { checkChatbots, checkGrowth, checkRaids, checkRoles, checkEmotesBadges } = require('../checker');
const router = express.Router();

function requireAuth(req, res, next) {
  if (!req.session.accessToken || !req.session.user) {
    return res.status(401).json({ error: '請先登入' });
  }
  next();
}

// GET /api/me — return current session user info
router.get('/me', requireAuth, (req, res) => {
  res.json({ user: req.session.user });
});

// GET /api/check — run all checks and return combined result
router.get('/check', requireAuth, async (req, res) => {
  const { accessToken, user } = req.session;

  try {
    const [chatbotResult, growthResult, raidResult, rolesResult, emotesResult] = await Promise.all([
      checkChatbots(accessToken, user.id),
      checkGrowth(accessToken, user.id),
      checkRaids(user.id),
      checkRoles(accessToken, user.id),
      checkEmotesBadges(accessToken, user.id),
    ]);

    res.json({
      user,
      chatbot: chatbotResult,
      growth: growthResult,
      raids: raidResult,
      roles: rolesResult,
      emotesBadges: emotesResult,
    });
  } catch (err) {
    console.error('Check error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// GET /api/check/chatbot — chatbot only
router.get('/check/chatbot', requireAuth, async (req, res) => {
  const { accessToken, user } = req.session;
  try {
    const result = await checkChatbots(accessToken, user.id);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/check/raids — raid history only
router.get('/check/raids', requireAuth, async (req, res) => {
  const { user } = req.session;
  try {
    const result = await checkRaids(user.id);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/check/growth — growth stats only
router.get('/check/growth', requireAuth, async (req, res) => {
  const { accessToken, user } = req.session;
  try {
    const result = await checkGrowth(accessToken, user.id);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/check/roles — moderators / editors / VIPs
router.get('/check/roles', requireAuth, async (req, res) => {
  const { accessToken, user } = req.session;
  try {
    const result = await checkRoles(accessToken, user.id);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


module.exports = router;
