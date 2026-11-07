const fs = require('fs');
const path = require('path');
const esbuild = require('esbuild');

console.log('[Arcade Games Patch] Starting hide patch...');

const targets = [
  path.join(__dirname, 'dist/assets/index-sn777-v12.js'),
  path.join(__dirname, 'dist_backup/assets/index-sn777-v12.js'),
  path.join(__dirname, 'original-index-sn777-v5.js'),
  path.join(__dirname, 'public/assets/index-sn777-v12.js'),
  path.join(__dirname, 'public/assets/index-sn777-v10.js'),
  path.join(__dirname, 'public/assets/index-sn777-v5.js')
];

const gamesToHideFromArcade = [
  "Boxing King",
  "Money Coming",
  "PP Money Time"
];

targets.forEach(filePath => {
  if (!fs.existsSync(filePath)) return;
  let code = fs.readFileSync(filePath, 'utf8');
  let changed = false;

  gamesToHideFromArcade.forEach(name => {
    // Regex matching item with category:"আর্কেড" specifically
    const escapedName = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const reg1 = new RegExp(`,\\{title:"${escapedName}",[^{}]*category:"আর্কেড"[^{}]*\\}`, "g");
    const reg2 = new RegExp(`\\{title:"${escapedName}",[^{}]*category:"আর্কেড"[^{}]*\\},?`, "g");
    if (reg1.test(code)) {
      code = code.replace(reg1, "");
      changed = true;
      console.log(`[Arcade Games Patch] Removed ${name} (category: আর্কেড) from ${path.basename(filePath)}`);
    } else if (reg2.test(code)) {
      code = code.replace(reg2, "");
      changed = true;
      console.log(`[Arcade Games Patch] Removed ${name} (category: আর্কেড) from ${path.basename(filePath)}`);
    }
  });

  if (changed) {
    // Clean up any double commas or leading/trailing commas in arrays if any
    code = code.replace(/,,+/g, ',');
    code = code.replace(/\[,/g, '[');
    code = code.replace(/,\]/g, ']');

    try {
      esbuild.transformSync(code, { loader: 'js' });
      fs.writeFileSync(filePath, code, 'utf8');
      console.log(`[Arcade Games Patch] Successfully patched and validated ${path.basename(filePath)}`);
    } catch (err) {
      console.error(`[Arcade Games Patch] Syntax error in ${path.basename(filePath)}:`, err.message);
    }
  }
});

console.log('[Arcade Games Patch] Completed successfully!');
