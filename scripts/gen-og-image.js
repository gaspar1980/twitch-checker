// Generate a simple 1200x630 PNG for Open Graph sharing
// Run: node scripts/gen-og-image.js
// Outputs: public/og-image.png

const fs = require('fs');
const path = require('path');

// Create a minimal BMP-like PNG using only built-in Node.js
// We'll create the simplest possible valid PNG: purple background with embedded text
// For a proper image, use a tool like Figma or Canva to create public/og-image.png

// Alternatively, generate a simple HTML file that can be screenshot:
const html = `<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"/><style>
* { margin:0; padding:0; box-sizing:border-box; }
body { width:1200px; height:630px; background:#0e0e10; display:flex; flex-direction:column; align-items:center; justify-content:center; font-family:Inter,Segoe UI,sans-serif; }
.logo { width:120px; height:120px; background:#9147ff; border-radius:24px; display:flex; align-items:center; justify-content:center; margin-bottom:32px; }
.logo svg { width:72px; height:72px; }
h1 { color:#efeff1; font-size:52px; font-weight:800; margin-bottom:16px; }
p { color:#adadb8; font-size:26px; max-width:800px; text-align:center; line-height:1.5; }
.url { color:#9147ff; font-size:22px; margin-top:32px; font-weight:600; }
</style></head>
<body>
  <div class="logo">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white">
      <path d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714z"/>
    </svg>
  </div>
  <h1>Twitch Channel Checker</h1>
  <p>Check your Chatbot, Alerts, Growth, Raids, Emotes, Schedule & Channel Roles</p>
  <div class="url">twitch-checker-production.up.railway.app</div>
</body>
</html>`;

fs.writeFileSync(path.join(__dirname, '../public/og-image.html'), html);
console.log('Generated public/og-image.html');
console.log('To create a PNG: open og-image.html in a browser, screenshot at 1200x630, save as public/og-image.png');
