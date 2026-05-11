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

/**
 * Fetch channel emotes and badges.
 * Emotes: GET /helix/chat/emotes  (no extra scope)
 * Badges: GET /helix/chat/badges  (no extra scope)
 * Both return image URLs at 1x / 2x / 4x
 */
async function checkEmotesBadges(userToken, broadcasterId) {
  const headers = twitchHeaders(userToken);

  const [emotesRes, badgesRes] = await Promise.allSettled([
    axios.get('https://api.twitch.tv/helix/chat/emotes', {
      headers,
      params: { broadcaster_id: broadcasterId },
    }),
    axios.get('https://api.twitch.tv/helix/chat/badges', {
      headers,
      params: { broadcaster_id: broadcasterId },
    }),
  ]);

  const emotes = emotesRes.status === 'fulfilled'
    ? (emotesRes.value.data.data || []).map(e => ({
        id: e.id,
        name: e.name,
        tier: e.tier || null,
        type: e.emote_type,
        image1x: e.images?.url_1x || null,
        image2x: e.images?.url_2x || null,
        image4x: e.images?.url_4x || null,
      }))
    : [];

  // Badges: each set has multiple versions (1 month, 3 months etc.)
  const badges = badgesRes.status === 'fulfilled'
    ? (badgesRes.value.data.data || []).map(set => ({
        setId: set.set_id,
        versions: set.versions.map(v => ({
          id: v.id,
          title: v.title,
          description: v.description,
          image1x: v.image_url_1x,
          image2x: v.image_url_2x,
          image4x: v.image_url_4x,
        })),
      }))
    : [];

  // Group emotes by type
  const subEmotes  = emotes.filter(e => e.type === 'subscriptions');
  const bitsEmotes = emotes.filter(e => e.type === 'bitstier');
  const otherEmotes = emotes.filter(e => e.type !== 'subscriptions' && e.type !== 'bitstier');

  return {
    emotes: {
      total: emotes.length,
      subscription: subEmotes,
      bits: bitsEmotes,
      other: otherEmotes,
      hasAffiliate: emotes.length > 0,
    },
    badges: {
      total: badges.length,
      sets: badges,
    },
    emoteError:  emotesRes.status === 'rejected' ? emotesRes.reason?.message : null,
    badgeError:  badgesRes.status === 'rejected' ? badgesRes.reason?.message : null,
    checkedAt: new Date().toISOString(),
  };
}

/**
 * Fetch live stream status + channel info.
 * GET /helix/streams        — live status, viewer count, thumbnail
 * GET /helix/channels       — title, game, language, tags
 * No extra scope needed.
 */
async function checkStreamInfo(userToken, broadcasterId) {
  const headers = twitchHeaders(userToken);

  const [streamRes, channelRes] = await Promise.allSettled([
    axios.get('https://api.twitch.tv/helix/streams', {
      headers,
      params: { user_id: broadcasterId },
    }),
    axios.get('https://api.twitch.tv/helix/channels', {
      headers,
      params: { broadcaster_id: broadcasterId },
    }),
  ]);

  const streamData = streamRes.status === 'fulfilled' ? streamRes.value.data.data[0] || null : null;
  const channelData = channelRes.status === 'fulfilled' ? channelRes.value.data.data[0] || null : null;

  const isLive = !!streamData;
  let thumbnail = null;
  if (streamData?.thumbnail_url) {
    thumbnail = streamData.thumbnail_url.replace('{width}', '440').replace('{height}', '248');
  }

  const hasCustomProfileImg = channelData?.profile_image_url && !channelData.profile_image_url.includes('user-default-pictures');

  return {
    isLive,
    stream: isLive ? {
      title: streamData.title,
      gameName: streamData.game_name,
      viewerCount: streamData.viewer_count,
      startedAt: streamData.started_at,
      thumbnail,
      tags: streamData.tags || [],
    } : null,
    channel: channelData ? {
      title: channelData.title,
      gameName: channelData.game_name,
      language: channelData.broadcaster_language,
      tags: channelData.tags || [],
      isBrandedContent: channelData.is_branded_content || false,
      contentClassificationLabels: channelData.content_classification_labels || [],
    } : null,
    checkedAt: new Date().toISOString(),
  };
}

/**
 * Fetch stream schedule.
 * GET /helix/schedule — upcoming scheduled segments
 * No extra scope needed.
 */
async function checkSchedule(userToken, broadcasterId) {
  const headers = twitchHeaders(userToken);

  try {
    const res = await axios.get('https://api.twitch.tv/helix/schedule', {
      headers,
      params: { broadcaster_id: broadcasterId, first: 10 },
    });

    const data = res.data.data;
    const segments = (data?.segments || []).map(s => ({
      id: s.id,
      title: s.title,
      startTime: s.start_time,
      endTime: s.end_time,
      category: s.category?.name || null,
      isRecurring: s.is_recurring,
      isCanceled: s.canceled_until !== null,
    }));

    const upcoming = segments.filter(s => !s.isCanceled && new Date(s.startTime) > new Date());

    return {
      hasSchedule: true,
      vacation: data?.vacation || null,
      segments,
      upcoming,
      total: segments.length,
      checkedAt: new Date().toISOString(),
    };
  } catch (err) {
    if (err.response?.status === 404) {
      return {
        hasSchedule: false,
        vacation: null,
        segments: [],
        upcoming: [],
        total: 0,
        checkedAt: new Date().toISOString(),
      };
    }
    console.error('Schedule check error:', err.response?.data || err.message);
    return {
      hasSchedule: false,
      error: err.message,
      segments: [],
      upcoming: [],
      total: 0,
      checkedAt: new Date().toISOString(),
    };
  }
}

module.exports = { checkChatbots, checkGrowth, checkRaids, checkRoles, checkEmotesBadges, checkStreamInfo, checkSchedule };
