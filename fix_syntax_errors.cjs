const fs = require('fs');
const path = require('path');

const jsTargets = [
  path.join(__dirname, 'dist/assets/index-sn777-v12.js'),
  path.join(__dirname, 'dist_backup/assets/index-sn777-v12.js'),
  path.join(__dirname, 'original-index-sn777-v5.js')
];

console.log('[Fix Syntax] Starting...');

jsTargets.forEach(filePath => {
  if (!fs.existsSync(filePath)) return;
  
  let code = fs.readFileSync(filePath, 'utf8');
  let originalCode = code;

  // Fix common syntax errors introduced by patching
  code = code.replace(/,,/g, ',');
  code = code.replace(/\{,/g, '{');
  code = code.replace(/,\}/g, '}');
  code = code.replace(/\[,/g, '[');
  code = code.replace(/,\]/g, ']');

  if (code !== originalCode) {
    fs.writeFileSync(filePath, code, 'utf8');
    console.log(`[Fix Syntax] Fixed errors in ${path.basename(filePath)}`);
  } else {
    console.log(`[Fix Syntax] No errors found in ${path.basename(filePath)}`);
  }
});

console.log('[Fix Syntax] Completed.');
