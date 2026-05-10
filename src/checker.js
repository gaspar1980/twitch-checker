const axios = require('axios');
const fs = require('fs');
const path = require('path');
const { KNOWN_BOTS } = require('./chatbots');

const HISTORY_FILE = path.join(__dirname, '../data/growth_history.json');

function loadHistory() {
  try {
    if (fs.existsSync(HISTORY_FILE)) {
      return JSON.parse(fs.readFileSync(HISTORY_FILE, 'utf8'));
    }
  } catch (_) {}
  return {};
}

function saveHistory(data) {
  const dir = path.dirname(HISTORY_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(HISTORY_FILE, JSON.stringify(data, null, 2));
}

const TWITCH_CLIENT_ID = process.env.TWITCH_CLIENT_ID;
const TWITCH_CLIENT_SECRET = process.env.TWITCH_CLIENT_SECRET;

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

function twitchHeaders(token) {
  return {
    'Authorization': `Bearer ${token}`,
    'Client-Id': TWITCH_CLIENT_ID,
  };
}

/**
 * Check if any known chatbot accounts are moderators of the channel.
 * Twitch API: GET /helix/moderation/moderators
 * Requires: moderation:read scope (user token)
 */
async function checkChatbots(userToken, broadcasterId) {
  const found = [];
  let cursor = null;

  try {
    do {
      const params = { broadcaster_id: broadcasterId, first: 100 };
      if (cursor) params.after = cursor;

      const res = await axios.get('https://api.twitch.tv/helix/moderation/moderators', {
        headers: twitchHeaders(userToken),
        params,
      });

      const mods = res.data.data || [];
      for (const mod of mods) {
        const login = mod.user_login.toLowerCase();
        if (KNOWN_BOTS.includes(login)) {
          found.push({
            name: mod.user_name,
            login: mod.user_login,
            type: 'moderator',
          });
        }
      }

      cursor = res.data.pagination?.cursor || null;
    } while (cursor);
  } catch (err) {
    console.error('Chatbot check error:', err.response?.data || err.message);
    throw new Error('無法取得版主列表，請確認授權範圍是否包含 moderation:read');
  }

  return {
    detected: found.length > 0,
    bots: found,
    checkedAt: new Date().toISOString(),
  };
}

/**
 * Check if the channel has active EventSub subscriptions.
 * Third-party alert services (Streamlabs Alerts, StreamElements Alerts, OWN3D, etc.)
 * subscribe to EventSub events (follow, subscribe, cheer, raid) to trigger alerts.
 *
 * We use app access token to query EventSub subscriptions for this broadcaster.
 * Requires app access token (client credentials) — no user scope needed.
 */
async function checkAlerts(broadcasterId) {
  const appToken = await getAppAccessToken();

  // Alert-relevant EventSub event types
  const alertEventTypes = [
    'channel.follow',
    'channel.subscribe',
    'channel.subscription.gift',
    'channel.subscription.message',
    'channel.cheer',
    'channel.raid',
    'channel.channel_points_custom_reward_redemption.add',
    'channel.hype_train.begin',
    'channel.hype_train.end',
  ];

  let allSubs = [];
  let cursor = null;

  try {
    do {
      const params = { user_id: broadcasterId, first: 100 };
      if (cursor) params.after = cursor;

      const res = await axios.get('https://api.twitch.tv/helix/eventsub/subscriptions', {
        headers: twitchHeaders(appToken),
        params,
      });

      allSubs = allSubs.concat(res.data.data || []);
      cursor = res.data.pagination?.cursor || null;
    } while (cursor);
  } catch (err) {
    console.error('EventSub check error:', err.response?.data || err.message);
    // EventSub subscriptions endpoint may not return results for all broadcasters
    // depending on who created them — return empty gracefully
    return {
      detected: false,
      subscriptions: [],
      note: '無法查詢 EventSub 訂閱（可能尚未有任何 alert 服務連接）',
      checkedAt: new Date().toISOString(),
    };
  }

  const alertSubs = allSubs.filter(sub =>
    alertEventTypes.includes(sub.type) && sub.status === 'enabled'
  );

  // Try to identify which service created the subscription from the transport callback URL
  const knownAlertServices = [
    { pattern: /streamlabs/i, name: 'Streamlabs Alerts' },
    { pattern: /streamelements/i, name: 'StreamElements Alerts' },
    { pattern: /own3d/i, name: 'OWN3D Alerts' },
    { pattern: /nightdev|nightbot/i, name: 'Nightbot' },
    { pattern: /mix-it-up|mixitup/i, name: 'Mix It Up' },
    { pattern: /warpworld|crowdcontrol/i, name: 'Crowd Control' },
    { pattern: /botrix/i, name: 'Botrix' },
  ];

  const detectedServices = new Set();
  const enrichedSubs = alertSubs.map(sub => {
    const callbackUrl = sub.transport?.callback || '';
    let serviceName = null;
    for (const svc of knownAlertServices) {
      if (svc.pattern.test(callbackUrl)) {
        serviceName = svc.name;
        detectedServices.add(svc.name);
        break;
      }
    }
    return {
      type: sub.type,
      status: sub.status,
      service: serviceName || '未知服務',
      createdAt: sub.created_at,
    };
  });

  return {
    detected: alertSubs.length > 0,
    subscriptions: enrichedSubs,
    services: [...detectedServices],
    total: alertSubs.length,
    checkedAt: new Date().toISOString(),
  };
}

/**
 * Fetch all moderators, editors, and VIPs for the channel.
 * Moderators: GET /helix/moderation/moderators  (requires moderation:read)
 * Editors:    GET /helix/channels/editors        (requires channel:read:editors)
 * VIPs:       GET /helix/channels/vips           (requires channel:read:vips)
 */
async function checkRoles(userToken, broadcasterId) {
  const headers = twitchHeaders(userToken);

  async function fetchAll(url, params) {
    const items = [];
    let cursor = null;
    do {
      const p = { ...params, first: 100 };
      if (cursor) p.after = cursor;
      const res = await axios.get(url, { headers, params: p });
      items.push(...(res.data.data || []));
      cursor = res.data.pagination?.cursor || null;
    } while (cursor);
    return items;
  }

  const [modsRaw, editorsRaw, vipsRaw] = await Promise.allSettled([
    fetchAll('https://api.twitch.tv/helix/moderation/moderators', { broadcaster_id: broadcasterId }),
    fetchAll('https://api.twitch.tv/helix/channels/editors', { broadcaster_id: broadcasterId }),
    fetchAll('https://api.twitch.tv/helix/channels/vips', { broadcaster_id: broadcasterId }),
  ]);

  const pick = (r, nameKey, loginKey) =>
    r.status === 'fulfilled'
      ? r.value.map(u => ({ displayName: u[nameKey], login: u[loginKey] }))
      : [];

  const mods    = pick(modsRaw,    'user_name',  'user_login');
  const editors = pick(editorsRaw, 'user_name',  'user_login');
  const vips    = pick(vipsRaw,    'user_name',  'user_login');

  return {
    moderators: mods,
    editors,
    vips,
    modError:    modsRaw.status    === 'rejected' ? modsRaw.reason?.message    : null,
    editorError: editorsRaw.status === 'rejected' ? editorsRaw.reason?.message : null,
    vipError:    vipsRaw.status    === 'rejected' ? vipsRaw.reason?.message    : null,
    checkedAt: new Date().toISOString(),
  };
}

/**
 * Fetch follower count and subscriber count, compare with stored history.
 * Requires: moderator:read:followers (for followers), channel:read:subscriptions (for subs)
 */
async function checkGrowth(userToken, broadcasterId) {
  const headers = twitchHeaders(userToken);

  // --- Followers ---
  let followerCount = null;
  try {
    const res = await axios.get('https://api.twitch.tv/helix/channels/followers', {
      headers,
      params: { broadcaster_id: broadcasterId, first: 1 },
    });
    followerCount = res.data.total ?? null;
  } catch (err) {
    console.error('Followers fetch error:', err.response?.data || err.message);
  }

  // --- Subscribers ---
  let subscriberCount = null;
  let subscriberPoints = null;
  try {
    const res = await axios.get('https://api.twitch.tv/helix/subscriptions', {
      headers,
      params: { broadcaster_id: broadcasterId, first: 1 },
    });
    subscriberCount = res.data.total ?? null;
    subscriberPoints = res.data.points ?? null;
  } catch (err) {
    // Non-affiliates get 403 — handle gracefully
    if (err.response?.status !== 403) {
      console.error('Subscribers fetch error:', err.response?.data || err.message);
    }
  }

  const now = new Date().toISOString();
  const history = loadHistory();
  const prev = history[broadcasterId];

  // Calculate deltas
  const followerDelta = (prev?.followerCount != null && followerCount != null)
    ? followerCount - prev.followerCount : null;
  const subDelta = (prev?.subscriberCount != null && subscriberCount != null)
    ? subscriberCount - prev.subscriberCount : null;

  // Build snapshots list (keep last 30)
  const snapshots = prev?.snapshots || [];
  snapshots.push({ ts: now, followerCount, subscriberCount, subscriberPoints });
  if (snapshots.length > 30) snapshots.splice(0, snapshots.length - 30);

  // Save updated history
  history[broadcasterId] = { followerCount, subscriberCount, subscriberPoints, lastChecked: now, snapshots };
  saveHistory(history);

  return {
    followerCount,
    followerDelta,
    subscriberCount,
    subscriberPoints,
    subDelta,
    lastChecked: now,
    previousChecked: prev?.lastChecked || null,
    snapshots,
  };
}


const RAID_FILE = path.join(__dirname, '../data/raid_history.json');

function loadRaids() {
  try {
    if (fs.existsSync(RAID_FILE)) {
      return JSON.parse(fs.readFileSync(RAID_FILE, 'utf8'));
    }
  } catch (_) {}
  return {};
}

/**
 * Return stored raid history for this broadcaster plus EventSub subscription status.
 */
async function checkRaids(broadcasterId) {
  const { ensureRaidSubscriptions } = require('./eventsub');

  // Register EventSub if not yet set up
  let subscriptionStatus = [];
  try {
    subscriptionStatus = await ensureRaidSubscriptions(broadcasterId);
  } catch (err) {
    console.error('ensureRaidSubscriptions error:', err.message);
  }

  const allRaids = loadRaids();
  const raids = allRaids[broadcasterId] || [];

  const incoming = raids.filter(r => r.direction === 'incoming');
  const outgoing = raids.filter(r => r.direction === 'outgoing');

  const totalViewersReceived = incoming.reduce((sum, r) => sum + (r.viewers || 0), 0);
  const totalViewersSent = outgoing.reduce((sum, r) => sum + (r.viewers || 0), 0);

  return {
    listening: subscriptionStatus.every(s => s.status !== 'error'),
    subscriptionStatus,
    raids,
    incoming,
    outgoing,
    totalViewersReceived,
    totalViewersSent,
    checkedAt: new Date().toISOString(),
  };
}

module.exports = { checkChatbots, checkGrowth, checkRaids, checkRoles };
