const express = require('express');
const axios = require('axios');
const router = express.Router();

const TWITCH_CLIENT_ID = process.env.TWITCH_CLIENT_ID;
const TWITCH_CLIENT_SECRET = process.env.TWITCH_CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI || 'http://localhost:3000/auth/callback';

// Scopes needed:
// - channel:read:subscriptions  → EventSub subscription info (alerts check)
// - moderation:read             → check who is moderator (bot accounts are often mods)
// - channel:read:editors        → extra context
// - user:read:email             → basic user info
const SCOPES = [
  'user:read:email',
  'moderation:read',
  'channel:read:subscriptions',
  'moderator:read:followers',
  'channel:read:editors',
  'channel:read:vips',
  'channel:read:goals',
].join(' ');

router.get('/login', (req, res) => {
  const params = new URLSearchParams({
    client_id: TWITCH_CLIENT_ID,
    redirect_uri: REDIRECT_URI,
    response_type: 'code',
    scope: SCOPES,
    force_verify: 'true',
  });
  res.redirect(`https://id.twitch.tv/oauth2/authorize?${params}`);
});

router.get('/callback', async (req, res) => {
  const { code, error } = req.query;

  if (error) {
    return res.redirect('/?error=' + encodeURIComponent(error));
  }

  if (!code) {
    return res.redirect('/?error=no_code');
  }

  try {
    const tokenRes = await axios.post('https://id.twitch.tv/oauth2/token', null, {
      params: {
        client_id: TWITCH_CLIENT_ID,
        client_secret: TWITCH_CLIENT_SECRET,
        code,
        grant_type: 'authorization_code',
        redirect_uri: REDIRECT_URI,
      },
    });

    const { access_token, refresh_token } = tokenRes.data;

    // Fetch user info
    const userRes = await axios.get('https://api.twitch.tv/helix/users', {
      headers: {
        'Authorization': `Bearer ${access_token}`,
        'Client-Id': TWITCH_CLIENT_ID,
      },
    });

    const user = userRes.data.data[0];

    req.session.accessToken = access_token;
    req.session.refreshToken = refresh_token;
    req.session.user = {
      id: user.id,
      login: user.login,
      displayName: user.display_name,
      profileImage: user.profile_image_url,
    };

    res.redirect('/dashboard');
  } catch (err) {
    console.error('OAuth callback error:', err.response?.data || err.message);
    res.redirect('/?error=auth_failed');
  }
});

router.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/');
  });
});

module.exports = router;
