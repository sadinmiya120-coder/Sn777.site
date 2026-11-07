const fs = require('fs');
const path = require('path');

console.log('[Slot HACKSAW Hide Patch] Starting clean check...');

const jsTargets = [
  path.join(__dirname, 'dist/assets/index-sn777-v12.js'),
  path.join(__dirname, 'dist_backup/assets/index-sn777-v12.js'),
  path.join(__dirname, 'public/assets/index-sn777-v12.js'),
  path.join(__dirname, 'original-index-sn777-v5.js')
];

jsTargets.forEach(filePath => {
  if (!fs.existsSync(filePath)) return;
  
  let code = fs.readFileSync(filePath, 'utf8');
  let changed = false;

  const targetRegex = /\{title:"Hacksaw Fortune"[^}]+\},?/g;
  if (targetRegex.test(code)) {
    code = code.replace(targetRegex, '');
    code = code.replace(/,,/g, ',');
    changed = true;
    console.log(`[Slot HACKSAW Hide Patch] Removed Hacksaw Fortune in ${path.basename(filePath)}`);
  }

  if (changed) {
    fs.writeFileSync(filePath, code, 'utf8');
  }
});

console.log('[Slot HACKSAW Hide Patch] Completed cleanly!');
