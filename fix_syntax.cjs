const fs = require('fs');
const path = require('path');

console.log('[Fix Syntax Patch] Starting thorough fix...');

const jsTargets = [
  path.join(__dirname, 'dist/assets/index-sn777-v12.js'),
  path.join(__dirname, 'dist_backup/assets/index-sn777-v12.js'),
  path.join(__dirname, 'original-index-sn777-v5.js'),
  path.join(__dirname, 'public/assets/index-sn777-v12.js')
];

jsTargets.forEach(filePath => {
  if (!fs.existsSync(filePath)) return;
  let code = fs.readFileSync(filePath, 'utf8');
  let modified = false;

  // Pattern 1: if(condition missing closing paren){
  const badPattern = /if\(E==="JILI"\|\|E==="FC"\|\|E==="PP"\|\|E==="PP_SLOT"\|\|E==="PG"\|\|E==="JDB"\|\|E==="COMBO"\|\|E==="LETSGO"\|\|E==="MONOPOLY"\|\|E==="MG"\|\|E==="YELLOWBAT"\|\|E==="FASTSPIN"\|\|E==="SG"\|\|E==="NEXTSPIN"\|\|E==="LUCKY365"\|\|E==="FIVEG"\|\|E==="RICH88"\{/;
  if (badPattern.test(code)) {
    code = code.replace(badPattern, match => match.replace('RICH88"{', 'RICH88"){'));
    modified = true;
    console.log(`[Fix Syntax Patch] Fixed Pattern 1 in ${path.basename(filePath)}`);
  }

  // Generic fallback: E==="RICH88"{
  if (code.includes('E==="RICH88"{')) {
    code = code.replace('E==="RICH88"{', 'E==="RICH88"){');
    modified = true;
    console.log(`[Fix Syntax Patch] Fixed Pattern Generic in ${path.basename(filePath)}`);
  }

  if (modified) {
    fs.writeFileSync(filePath, code, 'utf8');
  }
});

console.log('[Fix Syntax Patch] Thorough fix completed!');
