const fs = require('fs');
const path = require('path');
const esbuild = require('esbuild');

console.log('[Lottery Games Patch] Starting hide patch...');

const targets = [
  path.join(__dirname, 'dist/assets/index-sn777-v12.js'),
  path.join(__dirname, 'dist_backup/assets/index-sn777-v12.js'),
  path.join(__dirname, 'original-index-sn777-v5.js'),
  path.join(__dirname, 'public/assets/index-sn777-v12.js'),
  path.join(__dirname, 'public/assets/index-sn777-v10.js'),
  path.join(__dirname, 'public/assets/index-sn777-v5.js')
];

const gamesToHideFromLottery = [
  "Mega Wheel",
  "PP Mega Wheel",
  "PP Sweet Bonanza",
  "PP Treasure Island"
];

targets.forEach(filePath => {
  if (!fs.existsSync(filePath)) return;
  let code = fs.readFileSync(filePath, 'utf8');
  let changed = false;

  gamesToHideFromLottery.forEach(name => {
    const escapedName = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const reg1 = new RegExp(`,\\{title:"${escapedName}",[^{}]*category:"লটারি"[^{}]*\\}`, "g");
    const reg2 = new RegExp(`\\{title:"${escapedName}",[^{}]*category:"লটারি"[^{}]*\\},?`, "g");
    if (reg1.test(code)) {
      code = code.replace(reg1, "");
      changed = true;
      console.log(`[Lottery Games Patch] Removed ${name} (category: লটারি) from ${path.basename(filePath)}`);
    } else if (reg2.test(code)) {
      code = code.replace(reg2, "");
      changed = true;
      console.log(`[Lottery Games Patch] Removed ${name} (category: লটারি) from ${path.basename(filePath)}`);
    }
  });

  if (changed) {
    code = code.replace(/,+/g, ',');
    code = code.replace(/\[,/g, '[');
    code = code.replace(/,\]/g, ']');

    try {
      esbuild.transformSync(code, { loader: 'js' });
      fs.writeFileSync(filePath, code, 'utf8');
      console.log(`[Lottery Games Patch] Successfully patched and validated ${path.basename(filePath)}`);
    } catch (err) {
      console.error(`[Lottery Games Patch] Syntax error in ${path.basename(filePath)}:`, err.message);
    }
  }
});

console.log('[Lottery Games Patch] Completed successfully!');
