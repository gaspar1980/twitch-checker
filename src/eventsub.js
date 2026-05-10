const axios = require('axios');

const TWITCH_CLIENT_ID = process.env.TWITCH_CLIENT_ID;
const TWITCH_CLIENT_SECRET = process.env.TWITCH_CLIENT_SECRET;
const EVENTSUB_SECRET = process.env.EVENTSUB_SECRET || 'twitch-checker-eventsub-secret-2024';
const PUBLIC_URL = process.env.PUBLIC_URL || 'http://localhost:3000';

async function getAppAccessToken() {
  const res = await axios.post('https://id.twitch.tv/oauth2/token', null, {
    params: {
      client_id: TWITCH_CLIENT_ID,
      client_secret: TWITCH_CLIENT_SECRET,
      grant_type: 'client_credentials',
    },
  });
  return res.data.access_token;
}

function appHeaders(token) {
  return {
    'Authorization': `Bearer ${token}`,
    'Client-Id': TWITCH_CLIENT_ID,
    'Content-Type': 'application/json',
  };
}

/**
 * Register both raid subscriptions (incoming + outgoing) for a broadcaster.
 * Skips if the subscription already exists.
 */
async function ensureRaidSubscriptions(broadcasterId) {
  const appToken = await getAppAccessToken();
  const callbackUrl = `${PUBLIC_URL}/webhook/twitch`;

  // List existing subscriptions for this user
  let existing = [];
  try {
    const res = await axios.get('https://api.twitch.tv/helix/eventsub/subscriptions', {
      headers: appHeaders(appToken),
      params: { user_id: broadcasterId },
    });
    existing = res.data.data || [];
  } catch (err) {
    console.error('Failed to list EventSub subscriptions:', err.response?.data || err.message);
  }

  const existingTypes = new Set(
    existing.filter(s => s.status === 'enabled' || s.status === 'webhook_callback_verification_pending')
            .map(s => `${s.type}:${s.condition.from_broadcaster_user_id || s.condition.to_broadcaster_user_id}`)
  );

  const subscriptions = [
    // Incoming raid: someone raids our channel
    {
      type: 'channel.raid',
      condition: { to_broadcaster_user_id: broadcasterId },
      key: `channel.raid:${broadcasterId}`,
    },
    // Outgoing raid: our channel raids someone
    {
      type: 'channel.raid',
      condition: { from_broadcaster_user_id: broadcasterId },
      key: `channel.raid:${broadcasterId}`,
    },
  ];

  const results = [];
  for (const sub of subscriptions) {
    const dirKey = sub.condition.to_broadcaster_user_id
      ? `channel.raid:to:${broadcasterId}`
      : `channel.raid:from:${broadcasterId}`;

    // Check more precisely by both type and direction
    const alreadyExists = existing.some(s => {
      if (s.type !== 'channel.raid') return false;
      if (sub.condition.to_broadcaster_user_id) {
        return s.condition.to_broadcaster_user_id === broadcasterId;
      }
      return s.condition.from_broadcaster_user_id === broadcasterId;
    });

    if (alreadyExists) {
      results.push({ type: sub.type, direction: sub.condition.to_broadcaster_user_id ? 'incoming' : 'outgoing', status: 'already_exists' });
      continue;
    }

    try {
      await axios.post('https://api.twitch.tv/helix/eventsub/subscriptions', {
        type: sub.type,
        version: '1',
        condition: sub.condition,
        transport: {
          method: 'webhook',
          callback: callbackUrl,
          secret: EVENTSUB_SECRET,
        },
      }, { headers: appHeaders(appToken) });

      results.push({ type: sub.type, direction: sub.condition.to_broadcaster_user_id ? 'incoming' : 'outgoing', status: 'created' });
    } catch (err) {
      const msg = err.response?.data?.message || err.message;
      console.error(`Failed to create EventSub ${sub.type}:`, msg);
      results.push({ type: sub.type, direction: sub.condition.to_broadcaster_user_id ? 'incoming' : 'outgoing', status: 'error', error: msg });
    }
  }

  return results;
}

module.exports = { ensureRaidSubscriptions };
