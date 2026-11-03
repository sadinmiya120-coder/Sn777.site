const fs = require("fs");
const path = require("path");

console.log("[Instant User Online Status Patch] Starting patch...");

const targets = [
  "dist/assets/index-sn777-v12.js",
  "dist_backup/assets/index-sn777-v12.js",
  "original-index-sn777-v5.js",
  "public/assets/index-sn777-v12.js"
];

targets.forEach(filePath => {
  if (!fs.existsSync(filePath)) return;
  let code = fs.readFileSync(filePath, "utf8");
  let modified = false;

  // 1. Make Admin polling for /api/admin/all-users ultra-fast (every 2 seconds = 2000ms instead of 30s)
  if (code.includes('setInterval(()=>{fetch("/api/admin/all-users")')) {
    code = code.replace(
      /setInterval\(\(\)=>{fetch\("\/api\/admin\/all-users"\)/g,
      'setInterval(()=>{fetch("/api/admin/all-users")'
    );
  }

  // Ensure Admin poll interval is 2000ms
  code = code.replace(/3e4\)\},\[\]\)/g, '2e3)},[])');

  // 2. Client instant presence heartbeat on mount & Auth change
  // Replace heartbeat interval from 25000ms to 8000ms (8s) for ultra instant updates
  if (code.includes('E=setInterval(()=>{const u=gt.currentUser;if(u&&u.uid)_sendHeartbeat(u.uid,true)},25000)')) {
    code = code.replace(
      'E=setInterval(()=>{const u=gt.currentUser;if(u&&u.uid)_sendHeartbeat(u.uid,true)},25000)',
      'E=setInterval(()=>{const u=gt.currentUser;if(u&&u.uid)_sendHeartbeat(u.uid,true)},8000)'
    );
    modified = true;
  }

  // 3. Admin checkOnline window: allow up to 5 mins (300000ms) for active window
  if (code.includes('(now-ts)<180000')) {
    code = code.replace(/\(now-ts\)<180000/g, '(now-ts)<300000');
    modified = true;
  }

  if (modified || true) {
    fs.writeFileSync(filePath, code, "utf8");
    console.log(`[Instant User Online Status Patch] Processed ${path.basename(filePath)}`);
  }
});

console.log("[Instant User Online Status Patch] Completed successfully!");
