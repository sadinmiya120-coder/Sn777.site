const fs = require('fs');
const path = require('path');

const targets = [
  'dist/assets/index-sn777-v12.js',
  'dist_backup/assets/index-sn777-v12.js',
  'original-index-sn777-v5.js',
  'public/assets/index-sn777-v12.js'
];

targets.forEach(filePath => {
  if (!fs.existsSync(filePath)) return;
  let code = fs.readFileSync(filePath, 'utf8');
  let originalCode = code;

  // Fix logoUrl ternary
  code = code.replace(/logoUrl\s+o\.jsx/g, 'logoUrl ? o.jsx');
  
  // Fix the install guide blocks
  // They were: ]}) ? ] : [
  // They should be: ])] : [
  // Wait, no. If they are in children: [...]
  // It's likely: children:[block1, block2, isIOS ? [ios1, ios2] : [android1, android2]]
  // Looking at the grep, it was closing a block with ]})
  // So it's probably children:[ios1, ios2, ios3] ? ] : [android1, android2]
  // This means the 'isIOS ?' was removed from the START of the array.
  // I will try to restore a valid structure.
  code = code.replace(/\)\}\)\s*\]\s*:\s*\[/g, ')] : [');
  code = code.replace(/\]\}\)\s+o\.jsxs/g, '])] : [o.jsxs'); // Restore the missing parts

  // Let's use a very specific string match for the install guide corruption
  // We found ']}) ? ] : [' and replaced it with ']})'. Now we have ']}) o.jsxs'
  code = code.replace(/\)\}\)\s+o\.jsxs\("div",\{className:"bg-blue-950\/40/g, ')] : [o.jsxs("div", {className:"bg-blue-950/40');
  
  // And we need the '?' at the beginning of the first block
  // This is harder. But usually it's after a comma.
  
  // Actually, I'll just use a very simple fix for the missing ? before identifiers
  code = code.replace(/([a-zA-Z0-9_\].)])\s+(o\.jsx|o\.jsxs)/g, '$1 ? $2');

  if (code !== originalCode) {
    fs.writeFileSync(filePath, code, 'utf8');
    console.log(`[Final Fix] Repaired ${path.basename(filePath)}`);
  }
});
