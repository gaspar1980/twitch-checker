const express = require('express');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

const router = express.Router();

const EVENTSUB_SECRET = process.env.EVENTSUB_SECRET || 'twitch-checker-eventsub-secret-2024';
const RAID_FILE = path.join(__dirname, '../../data/raid_history.json');

function loadRaids() {
  try {
    if (fs.existsSync(RAID_FILE)) {
      return JSON.parse(fs.readFileSync(RAID_FILE, 'utf8'));
    }
  } catch (_) {}
  return {};
}

function saveRaids(data) {
  const dir = path.dirname(RAID_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(RAID_FILE, JSON.stringify(data, null, 2));
}

function verifySignature(req) {
  const msgId = req.headers['twitch-eventsub-message-id'] || '';
  const msgTs = req.headers['twitch-eventsub-message-timestamp'] || '';
  const sig = req.headers['twitch-eventsub-message-signature'] || '';
  const hmac = 'sha256=' + crypto
    .createHmac('sha256', EVENTSUB_SECRET)
    .update(msgId + msgTs + req.rawBody)
    .digest('hex');
  return crypto.timingSafeEqual(Buffer.from(hmac), Buffer.from(sig));
}

// Twitch sends JSON, but we need rawBody for signature verification.
// server.js mounts this router BEFORE express.json(), using this raw middleware.
router.use(express.raw({ type: 'application/json' }), (req, res, next) => {
  req.rawBody = req.body;
  try {
    req.body = JSON.parse(req.rawBody);
  } catch (_) {
    req.body = {};
  }
  next();
});

router.post('/', (req, res) => {
  // Verify Twitch signature
  try {
    if (!verifySignature(req)) {
      return res.status(403).send('Forbidden');
    }
  } catch (_) {
    return res.status(403).send('Forbidden');
  }

  const msgType = req.headers['twitch-eventsub-message-type'];

  // Step 1: challenge verification when creating subscription
  if (msgType === 'webhook_callback_verification') {
    return res.status(200).send(req.body.challenge);
  }

  // Step 2: revocation notification
  if (msgType === 'revocation') {
    console.log('EventSub revocation:', req.body.subscription?.type);
    return res.status(204).send();
  }

  // Step 3: actual event
  if (msgType === 'notification') {
    const subType = req.body.subscription?.type;
    const event = req.body.event;

    if (subType === 'channel.raid' && event) {
      const raids = loadRaids();

      // Determine direction from the event payload
      // incoming raid: to_broadcaster_user_id = our channel
      // outgoing raid: from_broadcaster_user_id = our channel
      const broadcasterId = event.to_broadcaster_user_id || event.from_broadcaster_user_id;

      if (!raids[broadcasterId]) raids[broadcasterId] = [];

      const direction = event.to_broadcaster_user_id ? 'incoming' : 'outgoing';

      raids[broadcasterId].unshift({
        direction,
        from: {
          id: event.from_broadcaster_user_id,
          login: event.from_broadcaster_user_login,
          displayName: event.from_broadcaster_user_name,
        },
        to: {
          id: event.to_broadcaster_user_id,
          login: event.to_broadcaster_user_login,
          displayName: event.to_broadcaster_user_name,
        },
        viewers: event.viewers,
        occurredAt: new Date().toISOString(),
      });

      // Keep last 100 raids per channel
      if (raids[broadcasterId].length > 100) raids[broadcasterId].splice(100);

      saveRaids(raids);
      console.log(`Raid ${direction} saved for broadcaster ${broadcasterId} (${event.viewers} viewers)`);
    }

    return res.status(204).send();
  }

  res.status(204).send();
});

module.exports = router;
