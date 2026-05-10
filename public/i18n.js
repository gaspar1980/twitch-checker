// i18n — zh-TW / en / ja
const TRANSLATIONS = {
  'zh-TW': {
    site: { title: 'Twitch 頻道檢查工具', logo: 'Twitch 頻道檢查工具' },
    lang: { 'zh-TW': '繁中', en: 'EN', ja: '日本語' },
    hero: {
      h1: '一鍵掌握你的頻道狀態',
      sub: '登入授權後，自動檢查 Chatbot、Alerts、成長數據、Raid 記錄與社群連結，幫助你確認頻道設定是否完整。',
      loginBtn: '使用 Twitch 帳號登入授權',
      privacyNote: '僅讀取頻道所需資訊，不會儲存你的帳號密碼或 Token。',
    },
    features: {
      title: '包含 6 大功能',
      chatbot: { title: 'Chatbot 聊天機器人', desc: '偵測頻道版主列表中是否有 Nightbot、StreamElements、Moobot、Fossabot 等 20+ 種常見機器人帳號。', tags: ['Nightbot', 'StreamElements', 'Moobot', 'Fossabot', '+16 種'] },
      alerts:  { title: 'Twitch 官方通知設定', desc: 'Twitch 內建的通知功能，直接在創作者儀表板啟用，不需第三方工具，提供追蹤、訂閱、Bits、Raid 等事件通知。', tags: ['官方內建', '追蹤通知', '訂閱通知', 'Bits / Raid'] },
      growth:  { title: '追蹤與訂閱成長', desc: '顯示目前追蹤數與訂閱數，並與上次查詢比較成長變化，累積查詢後產生趨勢圖。', tags: ['追蹤者人數', '訂閱者人數', '趨勢圖表'] },
      raids:   { title: 'Raid 記錄', desc: '透過 Webhook 即時監聽進來與出去的 Raid，記錄突擊頻道名稱、觀眾人數與時間。', tags: ['進來的 Raid', '出去的 Raid', '觀眾統計'] },
      panels:  { title: 'Panel 社群連結', desc: '掃描頻道所有 Panel，自動辨識並列出 Twitter/X、YouTube、Discord、Instagram 等社群媒體連結。', tags: ['Twitter/X', 'YouTube', 'Discord', '+12 平台'] },
      roles:        { title: '頻道角色清單', desc: '列出頻道所有版主（Mod）、編輯（Editor）與 VIP 帳號，一覽頻道人員權限分配。', tags: ['版主 Mod', '編輯 Editor', 'VIP'] },
      emotesBadges: { title: 'Emote 與 Badge', desc: '顯示頻道自訂表情符號和徽章，含圖片預覽，確認是否已設定訂閱 Emote 和頻道 Badge。', tags: ['訂閱 Emote', '頻道 Badge', 'Bits Emote'] },
    },
    steps: {
      title: '如何使用',
      s1: { title: '點擊登入', desc: '使用 Twitch 帳號授權，僅需一次。' },
      s2: { title: '自動檢查', desc: '授權後立即對你的頻道執行全部檢查。' },
      s3: { title: '查看結果', desc: '各功能卡片顯示狀態，並附上安裝教學。' },
    },
    footer: { note: '本工具為第三方工具，與 Twitch 官方無關。' },
    errors: { auth_failed: '登入失敗，請重試。', no_code: '授權過程發生錯誤，請重試。', access_denied: '你取消了授權。', default: '發生錯誤：' },
    dashboard: { title: '頻道檢查報告', startBtn: '開始檢查', recheckBtn: '重新檢查', checkingBtn: '檢查中...', loading: '正在檢查頻道設定，請稍候...', logout: '登出', error: '發生錯誤：' },
    cards: {
      chatbot: { title: 'Chatbot 聊天機器人', desc: '檢查頻道版主列表中是否有已知的聊天機器人帳號' },
      alerts:  { title: 'Twitch 通知（Alerts by Twitch）', desc: 'Twitch 官方內建的通知功能，直接在創作者儀表板設定，無需第三方工具', goSetup: '前往設定 ↗' },
      growth:  { title: '追蹤與訂閱成長', desc: '顯示目前追蹤數、訂閱數，以及與上次查詢相比的變化' },
      raids:   { title: 'Raid 記錄', desc: '透過 EventSub 監聽進來與出去的 Raid，儲存歷史記錄' },
      panels:  { title: '頻道 Panel 社群連結', desc: '掃描頻道 Panels 中的社群媒體連結（Twitter/X、YouTube、Discord 等）' },
      roles:        { title: '頻道角色清單', desc: '列出頻道所有版主（Mod）、編輯（Editor）與 VIP，一覽頻道人員權限分配', goSetup: '管理角色 ↗' },
      emotesBadges: { title: 'Emote 與 Badge', desc: '顯示頻道自訂表情符號和徽章圖片' },
    },
    status: { ok: '已設定 ✓', notDetected: '未偵測到', unknown: '無法檢查', updated: '已更新 ✓', listening: '監聽中 ✓', failed: '訂閱失敗', unavailable: '無法存取' },
    chatbot: {
      detected: '偵測到 <strong>{count}</strong> 個已知機器人帳號：',
      notDetected: '目前版主列表中未偵測到已知的聊天機器人。',
      hint: '如果機器人未被設為版主，或不在偵測清單中，則無法偵測到。',
      modRole: '版主身份',
    },
    alerts: {
      intro: 'Twitch 通知是 Twitch <strong>官方內建</strong>功能，直接在創作者儀表板設定，無需安裝任何第三方服務。通知可強調觀眾的互動行為（追蹤、訂閱、Bits、Raid 等），讓頻道更有活力。',
      officialBtn: '📖 查看官方設定教學',
      events: { follower: '新追蹤者', subscribe: '新訂閱', gift: '贈送訂閱', bits: 'Bits 歡呼', raid: 'Raid 突擊', hype: 'Hype Train' },
    },
    growth: {
      firstCheck: '首次查詢，下次重新檢查即可看到成長變化',
      prevCheck: '上次查詢：{date}',
      followers: '追蹤者', subscribers: '訂閱者',
      subPoints: '訂閱點數：{pts}', noAffiliate: '需達 Affiliate 才能開啟訂閱', notAvailable: '無法取得',
      firstQuery: '首次查詢', noChange: '— 無變化',
      trend: '追蹤數趨勢（最近 {count} 次查詢）',
    },
    raids: {
      incoming: '進來 Raid', outgoing: '出去 Raid',
      badgeNew: '新建立', badgeExists: '已存在', badgeErr: '錯誤',
      summaryIn: '收到的 Raid', summaryOut: '發出的 Raid',
      viewers: '共 {count} 位觀眾',
      noRecords: '目前尚無 Raid 記錄。EventSub 已開始監聽，之後的 Raid 會自動記錄在這裡。',
      recentRecords: '最近 {count} 筆記錄：',
      showMore: '顯示最近 20 筆，共 {count} 筆記錄',
      dirIn: '📥 進來', dirOut: '📤 出去', viewerCount: '{count} 人',
    },
    panels: {
      found: '在 <strong>{total}</strong> 個 Panel 中找到 <strong>{count}</strong> 個社群連結：',
      notFound: '在 {count} 個 Panel 中未找到已知社群媒體連結。',
      hint: 'Panel 的連結欄位需填入完整 https:// 網址才能被偵測到。',
      unavailable: '無法查詢 Panel 資訊。',
      linksCount: '{count} 個連結 ✓',
    },
    roles: {
      moderators: '版主（Moderator）', editors: '頻道編輯（Editor）', vips: 'VIP',
      modDesc: '擁有管理聊天室、封禁用戶等權限',
      editorDesc: '可編輯頻道資訊、管理直播標題與分類',
      vipDesc: '聊天室特殊徽章，無版主管理權限',
      empty: '目前沒有{role}',
      errorFetch: '無法取得資料（授權不足）',
      totalCount: '共 {count} 人',
      manageUrl: 'https://dashboard.twitch.tv/u/{login}/community/roles',
      manageBtn: '前往頻道後台管理 ↗',
    },
    emotesBadges: {
      emotesTitle: '自訂 Emote', badgesTitle: '頻道 Badge',
      subEmotes: '訂閱 Emote', bitsEmotes: 'Bits Emote', otherEmotes: '其他 Emote',
      noEmotes: '尚未設定任何 Emote（需達 Affiliate 才能新增）',
      noBadges: '尚未設定頻道 Badge',
      totalEmotes: '共 {count} 個 Emote',
      totalBadges: '共 {count} 組 Badge',
      noAffiliate: '尚未達到 Affiliate，無法新增自訂 Emote',
      tier: '訂閱方案 {tier}',
      badgeSetSub: '訂閱者徽章', badgeSetBits: 'Bits 徽章', badgeSetOther: '其他徽章',
      manageEmoteUrl: 'https://dashboard.twitch.tv/u/{login}/viewer-rewards/emotes',
      manageEmoteBtn: '管理 Emote ↗',
    },
    howto: {
      prefix: '📖 ',
      chatbot: {
        title: '如何安裝 Chatbot？',
        sections: [
          { name: 'Nightbot（推薦）', steps: ['前往 nightbot.tv 並登入 Twitch 帳號', '點選「Join Channel」讓 Nightbot 加入你的頻道', '在「Moderators」頁面確認 Nightbot 已被設為版主', '回到 Nightbot 後台即可設定指令與自動回應'] },
          { name: 'StreamElements', steps: ['前往 streamelements.com 登入 Twitch', '進入「Chatbot」>「Join Channel」', '在 Twitch 頻道聊天室輸入 /mod streamelements 給予版主權限', '在後台設定指令、計時器、排行榜等功能'] },
          { name: 'Moobot', steps: ['前往 moo.bot 登入 Twitch 帳號', '按照引導讓 Moobot 加入你的頻道', '在聊天室輸入 /mod moobot 給予版主權限'] },
        ],
      },
      alerts: {
        title: '如何設定 Twitch 官方通知？',
        sections: [
          { name: '在創作者儀表板設定', steps: ['登入 Twitch，點選右上角頭像，選擇「創作者儀表板」', '在左側選單找到「串流管理工具」>「通知」', '點選「管理通知」進入設定頁面', '開啟你想要的通知類型（追蹤、訂閱、Bits、Raid 等）', '自訂每種通知的文字、顯示時間與動畫效果', '點選「儲存」完成設定'] },
          { name: '在 OBS 中加入通知覆蓋層', steps: ['完成創作者儀表板設定後，複製通知的 Widget URL', '在 OBS 新增一個「瀏覽器來源（Browser Source）」', '貼上 Widget URL，調整寬度與高度', '將來源移動到螢幕上你希望顯示通知的位置', '開始直播後，通知將在對應事件發生時自動顯示'] },
          { name: '可自訂的通知內容', steps: ['通知文字：自訂顯示的訊息模板（如「{name} 追蹤了頻道！」）', '持續時間：通知在畫面上停留的秒數', '測試通知：設定頁面中可以即時預覽通知效果', '排隊設定：多個通知同時觸發時的處理方式'] },
        ],
      },
      growth: {
        title: '如何增加追蹤與訂閱？',
        sections: [
          { name: '提升追蹤者', steps: ['保持固定的直播時間表，讓觀眾知道何時能找到你', '在直播結束時提醒觀眾追蹤，不要追訂互追', '在 Twitter/X、TikTok、Instagram 分享直播剪輯', '與其他實況主互 Raid 擴大曝光'] },
          { name: '達成 Affiliate（訂閱解鎖）', steps: ['在 30 天內累積 500 分鐘直播時間', '在 30 天內至少直播 7 天', '平均同時在線觀眾達 3 人', '達成 50 位追蹤者'] },
          { name: '增加訂閱數', steps: ['建立頻道獨特的訂閱福利（表情符號、徽章、專屬指令）', '在直播中定期感謝訂閱者，給予特別待遇', '舉辦限時訂閱優惠活動（Hype Train、Sub-a-thon）'] },
        ],
      },
      raids: {
        title: '如何發動 Raid？',
        sections: [
          { name: '發動 Raid', steps: ['在聊天室輸入 /raid [頻道名稱]（例如 /raid ninja）', '系統會開始 90 秒倒數，期間可以取消', '倒數結束後，你的觀眾會自動轉移到目標頻道', '也可以在 Twitch 直播管理後台的「Raid」按鈕操作'] },
          { name: '設定 Raid 篩選', steps: ['進入 Twitch 創作者後台 > 設定 > 頻道', '在「Raid」區塊可設定哪些頻道可以突擊你', '可選擇「允許全部」、「僅限追蹤」或「僅限朋友」'] },
          { name: '建立 Raid 社群', steps: ['加入 Twitch 社群 Discord，認識志同道合的實況主', '直播結束前告知觀眾你要 Raid 誰，解釋原因', '被 Raid 時在聊天室歡迎來訪觀眾，有助留客'] },
        ],
      },
      panels: {
        title: '如何新增 Panel 社群連結？',
        sections: [
          { name: '新增 Panel', steps: ['進入你的 Twitch 頻道頁面，確認已登入', '捲動到頻道說明區域，點選「+」新增 Panel', '選擇「Add a Text or Image Panel」', '填入標題（如「追蹤我們」）並在連結欄位貼上社群 URL', '點「Submit」儲存'] },
          { name: '建議新增的社群連結', steps: ['Twitter/X：分享直播資訊與動態', 'Discord：建立粉絲社群聊天室', 'YouTube：上傳直播精華影片', 'Instagram / TikTok：短影片擴大觸及', 'Linktree：將所有連結集中在一個頁面'] },
        ],
      },
    },
  },

  'en': {
    site: { title: 'Twitch Channel Checker', logo: 'Twitch Channel Checker' },
    lang: { 'zh-TW': '繁中', en: 'EN', ja: '日本語' },
    hero: {
      h1: 'Check Your Channel Setup in One Click',
      sub: 'After authorizing with Twitch, automatically check Chatbot, Alerts, growth stats, Raid history, and social links — all in one place.',
      loginBtn: 'Login with Twitch',
      privacyNote: 'We only read the necessary channel info. Your password and tokens are never stored.',
    },
    features: {
      title: '6 Features Included',
      chatbot: { title: 'Chatbot Detection', desc: 'Detect if known bots like Nightbot, StreamElements, Moobot, or Fossabot are moderators in your channel.', tags: ['Nightbot', 'StreamElements', 'Moobot', 'Fossabot', '+16 more'] },
      alerts:  { title: 'Twitch Official Alerts', desc: "Twitch's built-in alert system, configurable directly in the Creator Dashboard — no third-party tools needed.", tags: ['Official', 'Follow Alerts', 'Sub Alerts', 'Bits / Raid'] },
      growth:  { title: 'Follower & Sub Growth', desc: 'View your current follower and subscriber counts, compare with last check, and track trends over time.', tags: ['Follower Count', 'Sub Count', 'Trend Chart'] },
      raids:   { title: 'Raid History', desc: 'Listen for incoming and outgoing raids via Webhook and log the channel name, viewer count, and time.', tags: ['Incoming Raids', 'Outgoing Raids', 'Viewer Stats'] },
      panels:  { title: 'Panel Social Links', desc: 'Scan all channel panels and identify Twitter/X, YouTube, Discord, Instagram, and other social media links.', tags: ['Twitter/X', 'YouTube', 'Discord', '+12 platforms'] },
      roles:        { title: 'Channel Roles', desc: 'List all Moderators, Editors, and VIPs — get a full overview of who has what permissions in your channel.', tags: ['Moderators', 'Editors', 'VIPs'] },
      emotesBadges: { title: 'Emotes & Badges', desc: 'Preview your custom channel emotes and badges with images — check if your sub emotes and channel badges are set up.', tags: ['Sub Emotes', 'Channel Badges', 'Bits Emotes'] },
    },
    steps: {
      title: 'How It Works',
      s1: { title: 'Login', desc: 'Authorize with your Twitch account — only once.' },
      s2: { title: 'Auto Check', desc: 'All checks run automatically right after login.' },
      s3: { title: 'View Results', desc: 'Each card shows status and includes a setup guide.' },
    },
    footer: { note: 'This is a third-party tool and is not affiliated with Twitch.' },
    errors: { auth_failed: 'Login failed. Please try again.', no_code: 'Authorization error. Please try again.', access_denied: 'You cancelled the authorization.', default: 'Error: ' },
    dashboard: { title: 'Channel Report', startBtn: 'Start Check', recheckBtn: 'Re-check', checkingBtn: 'Checking...', loading: 'Checking your channel settings, please wait...', logout: 'Logout', error: 'Error: ' },
    cards: {
      chatbot: { title: 'Chatbot', desc: 'Check if known chatbot accounts are moderators in your channel' },
      alerts:  { title: 'Twitch Alerts (by Twitch)', desc: "Twitch's official built-in alert system — configure it directly in the Creator Dashboard", goSetup: 'Setup Guide ↗' },
      growth:  { title: 'Follower & Sub Growth', desc: 'View current counts and compare changes since last check' },
      raids:   { title: 'Raid History', desc: 'Listen for incoming and outgoing raids via EventSub and store history' },
      panels:  { title: 'Panel Social Links', desc: 'Scan channel panels for social media links (Twitter/X, YouTube, Discord, etc.)' },
      roles:        { title: 'Channel Roles', desc: 'View all Moderators, Editors, and VIPs in your channel', goSetup: 'Manage Roles ↗' },
      emotesBadges: { title: 'Emotes & Badges', desc: 'Preview your custom emotes and badges with images' },
    },
    status: { ok: 'Detected ✓', notDetected: 'Not Detected', unknown: 'Unavailable', updated: 'Updated ✓', listening: 'Listening ✓', failed: 'Sub Failed', unavailable: 'Unavailable' },
    chatbot: {
      detected: 'Detected <strong>{count}</strong> known bot account(s):',
      notDetected: 'No known chatbots detected in the moderator list.',
      hint: "If the bot isn't a moderator or isn't in our detection list, it may not be found.",
      modRole: 'Moderator',
    },
    alerts: {
      intro: 'Twitch Alerts is an <strong>official built-in feature</strong> configurable directly in the Creator Dashboard — no third-party services needed. Alerts highlight audience interactions (follows, subs, Bits, raids, etc.) to energize your stream.',
      officialBtn: '📖 View Official Setup Guide',
      events: { follower: 'New Follower', subscribe: 'New Sub', gift: 'Gift Sub', bits: 'Bits Cheer', raid: 'Raid', hype: 'Hype Train' },
    },
    growth: {
      firstCheck: 'First check — re-check later to see growth changes',
      prevCheck: 'Last check: {date}',
      followers: 'Followers', subscribers: 'Subscribers',
      subPoints: 'Sub Points: {pts}', noAffiliate: 'Requires Affiliate status', notAvailable: 'Unavailable',
      firstQuery: 'First check', noChange: '— No change',
      trend: 'Follower trend (last {count} checks)',
    },
    raids: {
      incoming: 'Incoming Raid', outgoing: 'Outgoing Raid',
      badgeNew: 'Created', badgeExists: 'Active', badgeErr: 'Error',
      summaryIn: 'Raids Received', summaryOut: 'Raids Sent',
      viewers: '{count} total viewers',
      noRecords: 'No raid history yet. EventSub is now listening — future raids will be logged here.',
      recentRecords: 'Last {count} records:',
      showMore: 'Showing latest 20 of {count} total',
      dirIn: '📥 Incoming', dirOut: '📤 Outgoing', viewerCount: '{count} viewers',
    },
    panels: {
      found: 'Found <strong>{count}</strong> social links across <strong>{total}</strong> panels:',
      notFound: 'No known social links found in {count} panel(s).',
      hint: 'Panel links must include a full https:// URL to be detected.',
      unavailable: 'Unable to retrieve panel info.',
      linksCount: '{count} links ✓',
    },
    roles: {
      moderators: 'Moderators', editors: 'Channel Editors', vips: 'VIPs',
      modDesc: 'Can manage chat, timeout/ban users, and more',
      editorDesc: 'Can edit channel info, stream title, and category',
      vipDesc: 'Special chat badge; no moderation permissions',
      empty: 'No {role} yet',
      errorFetch: 'Unable to fetch (insufficient permissions)',
      totalCount: '{count} total',
      manageUrl: 'https://dashboard.twitch.tv/u/{login}/community/roles',
      manageBtn: 'Manage in Creator Dashboard ↗',
    },
    emotesBadges: {
      emotesTitle: 'Custom Emotes', badgesTitle: 'Channel Badges',
      subEmotes: 'Sub Emotes', bitsEmotes: 'Bits Emotes', otherEmotes: 'Other Emotes',
      noEmotes: 'No emotes set up yet (requires Affiliate status)',
      noBadges: 'No channel badges set up yet',
      totalEmotes: '{count} emote(s)',
      totalBadges: '{count} badge set(s)',
      noAffiliate: 'Not yet Affiliate — custom emotes are unavailable',
      tier: 'Sub Tier {tier}',
      badgeSetSub: 'Subscriber Badge', badgeSetBits: 'Bits Badge', badgeSetOther: 'Other Badge',
      manageEmoteUrl: 'https://dashboard.twitch.tv/u/{login}/viewer-rewards/emotes',
      manageEmoteBtn: 'Manage Emotes ↗',
    },
    howto: {
      prefix: '📖 ',
      chatbot: {
        title: 'How to Install a Chatbot?',
        sections: [
          { name: 'Nightbot (Recommended)', steps: ['Go to nightbot.tv and log in with Twitch', 'Click "Join Channel" to add Nightbot to your channel', 'Confirm Nightbot has moderator status in the Moderators page', 'Return to the dashboard to set up commands and auto-responses'] },
          { name: 'StreamElements', steps: ['Go to streamelements.com and log in with Twitch', 'Navigate to "Chatbot" > "Join Channel"', 'Type /mod streamelements in your Twitch chat to grant mod status', 'Configure commands, timers, and leaderboards in the dashboard'] },
          { name: 'Moobot', steps: ['Go to moo.bot and log in with Twitch', 'Follow the prompts to add Moobot to your channel', 'Type /mod moobot in chat to grant mod status'] },
        ],
      },
      alerts: {
        title: 'How to Set Up Twitch Alerts?',
        sections: [
          { name: 'Configure in Creator Dashboard', steps: ['Log in to Twitch, click your avatar → "Creator Dashboard"', 'Find "Stream Manager" > "Alerts" in the left sidebar', 'Click "Manage Alerts" to open settings', 'Enable the alert types you want (follow, sub, Bits, raid, etc.)', 'Customize the text, duration, and animation for each alert', 'Click "Save"'] },
          { name: 'Add Overlay in OBS', steps: ['After configuring, copy the Alert Widget URL', 'In OBS, add a new "Browser Source"', 'Paste the Widget URL and set width/height', 'Position the source where you want alerts to appear', 'Alerts will show automatically during your stream'] },
          { name: 'Customizable Options', steps: ['Alert text: customize the message template (e.g., "{name} just followed!")', 'Duration: how long the alert stays on screen', 'Test alert: preview instantly from the settings page', 'Queue: how simultaneous alerts are handled'] },
        ],
      },
      growth: {
        title: 'How to Grow Your Channel?',
        sections: [
          { name: 'Grow Followers', steps: ['Keep a consistent stream schedule', 'Remind viewers to follow at the end of streams', 'Share clips on Twitter/X, TikTok, and Instagram', 'Raid other streamers to expand your reach'] },
          { name: 'Reach Affiliate (unlock subs)', steps: ['Stream at least 500 minutes within 30 days', 'Stream on at least 7 different days within 30 days', 'Average 3 concurrent viewers', 'Reach 50 followers'] },
          { name: 'Grow Subscriptions', steps: ['Create unique sub perks (emotes, badges, exclusive commands)', 'Regularly thank subscribers and give them special recognition', 'Run limited-time sub events (Hype Train, Sub-a-thon)'] },
        ],
      },
      raids: {
        title: 'How to Raid?',
        sections: [
          { name: 'Start a Raid', steps: ['Type /raid [channel name] in chat (e.g., /raid ninja)', 'A 90-second countdown begins — you can cancel during this time', 'After countdown, your viewers are transferred to the target channel', 'You can also use the "Raid" button in Stream Manager'] },
          { name: 'Configure Raid Settings', steps: ['Go to Creator Dashboard > Settings > Channel', 'In the "Raids" section, set who can raid your channel', 'Options: "Allow all", "Followers only", or "Friends only"'] },
          { name: 'Build a Raid Community', steps: ['Join Twitch community Discords to connect with other streamers', 'Tell viewers who you are raiding before ending your stream', 'Welcome incoming raiders in chat to help retain new viewers'] },
        ],
      },
      panels: {
        title: 'How to Add Panel Social Links?',
        sections: [
          { name: 'Add a Panel', steps: ['Go to your Twitch channel page while logged in', 'Scroll to the panels area and click "+" to add a panel', 'Select "Add a Text or Image Panel"', 'Enter a title and paste your social URL in the link field', 'Click "Submit" to save'] },
          { name: 'Recommended Social Links', steps: ['Twitter/X: share stream updates', 'Discord: build a fan community', 'YouTube: upload stream highlights', 'Instagram / TikTok: short videos to grow your reach', 'Linktree: combine all links into one page'] },
        ],
      },
    },
  },

  'ja': {
    site: { title: 'Twitchチャンネルチェッカー', logo: 'Twitchチャンネルチェッカー' },
    lang: { 'zh-TW': '繁中', en: 'EN', ja: '日本語' },
    hero: {
      h1: 'ワンクリックでチャンネル状態を確認',
      sub: 'Twitchで認証後、Chatbot・アラート・成長データ・Raid履歴・SNSリンクを自動チェックし、チャンネル設定を確認します。',
      loginBtn: 'Twitchアカウントでログイン',
      privacyNote: '必要なチャンネル情報のみ取得します。パスワードやトークンは保存しません。',
    },
    features: {
      title: '6つの主な機能',
      chatbot: { title: 'Chatbot検出', desc: 'Nightbot・StreamElements・Moobot・Fossabotなど20種以上のChatbotがモデレーターに登録されているか確認します。', tags: ['Nightbot', 'StreamElements', 'Moobot', 'Fossabot', '+16種'] },
      alerts:  { title: 'Twitch公式アラート設定', desc: 'Twitchの公式アラート機能。クリエイターダッシュボードから直接設定でき、サードパーティ製ツール不要です。', tags: ['公式機能', 'フォロー通知', 'サブ通知', 'Bits / Raid'] },
      growth:  { title: 'フォロワー＆サブ成長', desc: '現在のフォロワー数・サブ数を表示し、前回との差分を確認。履歴が蓄積されるとトレンドチャートを生成します。', tags: ['フォロワー数', 'サブ数', 'トレンドグラフ'] },
      raids:   { title: 'Raid履歴', desc: 'WebhookでRaid入退を監視し、チャンネル名・視聴者数・時刻を記録します。', tags: ['受信Raid', '送信Raid', '視聴者統計'] },
      panels:  { title: 'パネルSNSリンク', desc: 'チャンネルのパネルをスキャンし、Twitter/X・YouTube・Discord・Instagramなどを自動検出します。', tags: ['Twitter/X', 'YouTube', 'Discord', '+12プラットフォーム'] },
      roles:        { title: 'チャンネルロール', desc: '全モデレーター・エディター・VIPを一覧表示し、チャンネルの権限管理を把握できます。', tags: ['モデレーター', 'エディター', 'VIP'] },
      emotesBadges: { title: 'EmoteとBadge', desc: 'チャンネルのカスタムEmoteとBadgeを画像プレビューつきで表示します。', tags: ['サブEmote', 'チャンネルBadge', 'Bits Emote'] },
    },
    steps: {
      title: '使い方',
      s1: { title: 'ログイン', desc: 'Twitchアカウントで認証します（1回のみ）。' },
      s2: { title: '自動チェック', desc: '認証後すぐに全項目を自動チェックします。' },
      s3: { title: '結果を確認', desc: '各カードに状態とセットアップガイドが表示されます。' },
    },
    footer: { note: 'これはサードパーティツールであり、Twitchとは無関係です。' },
    errors: { auth_failed: 'ログインに失敗しました。再試行してください。', no_code: '認証エラーが発生しました。再試行してください。', access_denied: '認証をキャンセルしました。', default: 'エラー：' },
    dashboard: { title: 'チャンネルレポート', startBtn: 'チェック開始', recheckBtn: '再チェック', checkingBtn: 'チェック中...', loading: 'チャンネル設定を確認中です。しばらくお待ちください...', logout: 'ログアウト', error: 'エラー：' },
    cards: {
      chatbot: { title: 'Chatbot', desc: 'チャンネルのモデレーターに既知のChatbotアカウントが含まれているか確認します' },
      alerts:  { title: 'Twitchアラート（Alerts by Twitch）', desc: 'Twitchの公式内蔵アラート機能。クリエイターダッシュボードから設定できます', goSetup: '設定ページへ ↗' },
      growth:  { title: 'フォロワー＆サブ成長', desc: '現在の数値を表示し、前回チェックからの変化を比較します' },
      raids:   { title: 'Raid履歴', desc: 'EventSubでRaidを監視し、履歴を保存します' },
      panels:  { title: 'パネルSNSリンク', desc: 'パネルのSNSリンク（Twitter/X、YouTube、Discordなど）をスキャンします' },
      roles:        { title: 'チャンネルロール', desc: 'モデレーター・エディター・VIPを一覧表示します', goSetup: 'ロール管理 ↗' },
      emotesBadges: { title: 'EmoteとBadge', desc: 'カスタムEmoteとBadgeを画像プレビューつきで表示します' },
    },
    status: { ok: '設定済み ✓', notDetected: '未検出', unknown: '確認不可', updated: '更新済み ✓', listening: '監視中 ✓', failed: 'サブ失敗', unavailable: '利用不可' },
    chatbot: {
      detected: '<strong>{count}</strong>件のChatbotアカウントを検出しました：',
      notDetected: 'モデレーターリストに既知のChatbotは見つかりませんでした。',
      hint: 'Chatbotがモデレーターでない場合、または検出リストにない場合は検出できないことがあります。',
      modRole: 'モデレーター',
    },
    alerts: {
      intro: 'Twitchアラートは<strong>公式の内蔵機能</strong>で、クリエイターダッシュボードから直接設定できます。サードパーティサービスは不要です。フォロー・サブ・Bits・Raidなどのアクションを通知し、配信をより盛り上げます。',
      officialBtn: '📖 公式セットアップガイドを見る',
      events: { follower: '新フォロワー', subscribe: '新サブ', gift: 'ギフトサブ', bits: 'Bits応援', raid: 'Raid', hype: 'Hype Train' },
    },
    growth: {
      firstCheck: '初回チェック — 再チェック後に成長の変化が表示されます',
      prevCheck: '前回チェック：{date}',
      followers: 'フォロワー', subscribers: 'サブスクライバー',
      subPoints: 'サブポイント：{pts}', noAffiliate: 'Affiliate以上が必要です', notAvailable: '取得不可',
      firstQuery: '初回チェック', noChange: '— 変化なし',
      trend: 'フォロワー推移（直近{count}回のチェック）',
    },
    raids: {
      incoming: '受信Raid', outgoing: '送信Raid',
      badgeNew: '新規作成', badgeExists: '作成済み', badgeErr: 'エラー',
      summaryIn: '受信Raid', summaryOut: '送信Raid',
      viewers: '合計{count}人の視聴者',
      noRecords: 'Raid履歴はまだありません。EventSubが監視を開始しました。今後のRaidは自動的に記録されます。',
      recentRecords: '直近{count}件の記録：',
      showMore: '最新20件を表示中（合計{count}件）',
      dirIn: '📥 受信', dirOut: '📤 送信', viewerCount: '{count}人',
    },
    panels: {
      found: '<strong>{total}</strong>個のパネルから<strong>{count}</strong>件のSNSリンクを発見：',
      notFound: '{count}個のパネルに既知のSNSリンクは見つかりませんでした。',
      hint: 'パネルのリンク欄に完全なhttps:// URLを入力する必要があります。',
      unavailable: 'パネル情報を取得できません。',
      linksCount: '{count}件のリンク ✓',
    },
    roles: {
      moderators: 'モデレーター', editors: 'チャンネルエディター', vips: 'VIP',
      modDesc: 'チャット管理・ユーザーBANなどの権限を持ちます',
      editorDesc: 'チャンネル情報・配信タイトル・カテゴリを編集できます',
      vipDesc: 'チャット内特別バッジ付き（モデレーター権限なし）',
      empty: '{role}はいません',
      errorFetch: '取得できません（権限不足）',
      totalCount: '合計{count}人',
      manageUrl: 'https://dashboard.twitch.tv/u/{login}/community/roles',
      manageBtn: 'クリエイターダッシュボードで管理 ↗',
    },
    emotesBadges: {
      emotesTitle: 'カスタムEmote', badgesTitle: 'チャンネルBadge',
      subEmotes: 'サブEmote', bitsEmotes: 'Bits Emote', otherEmotes: 'その他のEmote',
      noEmotes: 'Emoteはまだ設定されていません（Affiliate以上が必要）',
      noBadges: 'チャンネルBadgeはまだ設定されていません',
      totalEmotes: '{count}個のEmote',
      totalBadges: '{count}セットのBadge',
      noAffiliate: 'Affiliateに未到達 — カスタムEmoteは利用できません',
      tier: 'サブTier {tier}',
      badgeSetSub: 'サブスクライバーバッジ', badgeSetBits: 'Bitsバッジ', badgeSetOther: 'その他バッジ',
      manageEmoteUrl: 'https://dashboard.twitch.tv/u/{login}/viewer-rewards/emotes',
      manageEmoteBtn: 'Emoteを管理 ↗',
    },
    howto: {
      prefix: '📖 ',
      chatbot: {
        title: 'Chatbotのインストール方法',
        sections: [
          { name: 'Nightbot（推奨）', steps: ['nightbot.tvにアクセスし、Twitchでログイン', '「Join Channel」をクリックしてNightbotをチャンネルに追加', 'Moderatorsページでモデレーター権限を確認', 'ダッシュボードでコマンドや自動返信を設定'] },
          { name: 'StreamElements', steps: ['streamelements.comにアクセスし、Twitchでログイン', '「Chatbot」>「Join Channel」へ移動', 'Twitchチャット内で /mod streamelements と入力してモデレーター権限を付与', 'ダッシュボードでコマンド・タイマー・リーダーボードを設定'] },
          { name: 'Moobot', steps: ['moo.botにアクセスし、Twitchでログイン', '案内に従ってMoobotをチャンネルに追加', 'チャット内で /mod moobot と入力してモデレーター権限を付与'] },
        ],
      },
      alerts: {
        title: 'Twitch公式アラートの設定方法',
        sections: [
          { name: 'クリエイターダッシュボードで設定', steps: ['Twitchにログインし、アバター → 「クリエイターダッシュボード」を選択', '左メニューから「ストリームマネージャー」>「アラート」へ', '「アラートを管理」をクリック', '有効にしたいアラートタイプを選択（フォロー・サブ・Bits・Raidなど）', 'テキスト・表示時間・アニメーションをカスタマイズ', '「保存」をクリックして完了'] },
          { name: 'OBSにオーバーレイを追加', steps: ['設定完了後、ダッシュボードからWidget URLをコピー', 'OBSで「ブラウザソース（Browser Source）」を新規追加', 'Widget URLを貼り付け、幅と高さを設定', 'アラートを表示したい位置にソースを移動', '配信開始後、イベント発生時に自動で表示されます'] },
          { name: 'カスタマイズ可能な項目', steps: ['アラートテキスト：メッセージテンプレートを自由編集', '表示時間：アラートを画面に表示する秒数', 'テストアラート：設定ページから即時プレビュー可能', 'キュー設定：複数アラートが同時発生した場合の処理'] },
        ],
      },
      growth: {
        title: 'チャンネルを成長させるには？',
        sections: [
          { name: 'フォロワーを増やす', steps: ['定期的な配信スケジュールを維持する', '配信終了時にフォローを促す（互フォローは避ける）', 'Twitter/X・TikTok・Instagramで配信クリップを共有する', '他のストリーマーとRaidし合い露出を拡大する'] },
          { name: 'Affiliateになる（サブスクライブ解放）', steps: ['30日以内に合計500分以上配信する', '30日以内に少なくとも7日間配信する', '平均同時視聴者数3人以上を維持する', '50フォロワーを達成する'] },
          { name: 'サブスクライバーを増やす', steps: ['独自のサブ特典を作成（エモート・バッジ・専用コマンドなど）', '配信中にサブスクライバーへ定期的に感謝し、特別扱いする', '期間限定サブイベントを開催する（Hype Train・Sub-a-thonなど）'] },
        ],
      },
      raids: {
        title: 'Raidの方法',
        sections: [
          { name: 'Raidを開始する', steps: ['チャットで /raid [チャンネル名] と入力（例：/raid ninja）', '90秒のカウントダウンが始まります（この間はキャンセル可能）', 'カウントダウン終了後、視聴者が対象チャンネルへ移動します', 'ストリームマネージャーの「Raid」ボタンからも操作可能'] },
          { name: 'Raid設定を行う', steps: ['クリエイターダッシュボード > 設定 > チャンネルへ移動', '「Raid」セクションで受け入れるRaidの対象を設定', '「全員許可」「フォロワーのみ」「友人のみ」から選択'] },
          { name: 'Raidコミュニティを作る', steps: ['TwitchコミュニティのDiscordに参加し、他ストリーマーと繋がる', '配信終了前にRaid先を視聴者に伝える', 'Raidされた際はチャットで来訪者を歓迎し、定着を促す'] },
        ],
      },
      panels: {
        title: 'パネルにSNSリンクを追加する方法',
        sections: [
          { name: 'パネルを追加する', steps: ['ログイン状態でTwitchチャンネルページへ移動', 'パネルエリアまでスクロールし、「+」をクリック', '「Add a Text or Image Panel」を選択', 'タイトルを入力し、リンク欄にSNSのURLを貼り付け', '「Submit」をクリックして保存'] },
          { name: '追加を推奨するSNSリンク', steps: ['Twitter/X：配信情報や近況を発信', 'Discord：ファンコミュニティのチャットルームを作成', 'YouTube：配信ハイライト動画をアップロード', 'Instagram / TikTok：ショート動画でリーチを拡大', 'Linktree：全てのリンクを1ページにまとめる'] },
        ],
      },
    },
  },
};

// ── Public API ──────────────────────────────────────────────────────
const LANGS = ['zh-TW', 'en', 'ja'];
const DEFAULT_LANG = 'zh-TW';

function getLang() {
  const stored = localStorage.getItem('lang');
  return LANGS.includes(stored) ? stored : DEFAULT_LANG;
}

function setLang(lang) {
  if (LANGS.includes(lang)) localStorage.setItem('lang', lang);
}

/** Get translation by dot-path key with optional {var} interpolation */
function t(key, vars) {
  const lang = getLang();
  const parts = key.split('.');
  let val = TRANSLATIONS[lang];
  for (const p of parts) {
    if (val == null) break;
    val = val[p];
  }
  if (val == null) {
    // Fallback to zh-TW
    val = TRANSLATIONS[DEFAULT_LANG];
    for (const p of parts) { if (val == null) break; val = val[p]; }
  }
  if (val == null) return key;
  let str = String(val);
  if (vars) {
    for (const [k, v] of Object.entries(vars)) {
      str = str.replaceAll(`{${k}}`, v);
    }
  }
  return str;
}

/** Get howto sections for a feature */
function tHowto(feature) {
  const lang = getLang();
  return (TRANSLATIONS[lang]?.howto?.[feature]) || (TRANSLATIONS[DEFAULT_LANG]?.howto?.[feature]);
}

/** Render language switcher HTML */
function langSwitcherHTML() {
  const cur = getLang();
  return LANGS.map(l =>
    `<button class="lang-btn${l === cur ? ' active' : ''}" onclick="switchLang('${l}')">${TRANSLATIONS[l].lang[l]}</button>`
  ).join('');
}

function switchLang(lang) {
  setLang(lang);
  if (typeof onLangChange === 'function') onLangChange(lang);
}
