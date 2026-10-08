const fs = require("fs");

const files = [
  "dist/assets/index-sn777-v5.js",
  "dist_backup/assets/index-sn777-v5.js",
  "dist/assets/index-sn777-v6.js",
  "dist_backup/assets/index-sn777-v6.js"
];

for (const file of files) {
  if (!fs.existsSync(file)) continue;
  let code = fs.readFileSync(file, "utf8");
  let modified = false;

  // 1. Reduce withdrawal submit modal delay from 1200ms to instant (0ms)
  const oldWithdrawDelay = 'setTimeout(()=>{xe(!1),nt("উইথড্র রিকোয়েস্ট সফল"),De(!0)},1200)';
  const newWithdrawDelay = 'setTimeout(()=>{xe(!1),nt("উইথড্র রিকোয়েস্ট সফল"),De(!0)},0)';
  if (code.includes(oldWithdrawDelay)) {
    code = code.replaceAll(oldWithdrawDelay, newWithdrawDelay);
    modified = true;
    console.log(`[${file}] Reduced withdrawal submit delay to 0ms`);
  }

  // 2. Reduce deposit submission timeout from 3000ms to 0ms
  const oldDepDelay = 'setTimeout(()=>{try{window._sn777_dep_submitting=!1;xe(!1)}catch(e){}},3000)';
  const newDepDelay = 'setTimeout(()=>{try{window._sn777_dep_submitting=!1;xe(!1)}catch(e){}},0)';
  if (code.includes(oldDepDelay)) {
    code = code.replaceAll(oldDepDelay, newDepDelay);
    modified = true;
    console.log(`[${file}] Reduced deposit submit delay to 0ms`);
  }

  // 3. Accelerate auto-check pending interval from 5000ms to 2000ms
  const oldAutoTimer = 'setInterval(checkPendingAuto,5000)';
  const newAutoTimer = 'setInterval(checkPendingAuto,2000)';
  if (code.includes(oldAutoTimer)) {
    code = code.replaceAll(oldAutoTimer, newAutoTimer);
    modified = true;
    console.log(`[${file}] Accelerated pending deposit check to 2s`);
  }

  if (modified) {
    fs.writeFileSync(file, code, "utf8");
    console.log(`[${file}] Saved speed optimizations!`);
  }
}
