const fs = require('fs');
const path = require('path');

console.log('[PP Patch] Starting PP provider icon fix...');

// 1. Assets sync
const srcImg = path.join(__dirname, 'src/assets/images/provider_pp.png');
const distDir = path.join(__dirname, 'dist/assets');
const distBackupDir = path.join(__dirname, 'dist_backup/assets');
const publicDir = path.join(__dirname, 'public/assets');

if (!fs.existsSync(distDir)) fs.mkdirSync(distDir, { recursive: true });
if (!fs.existsSync(distBackupDir)) fs.mkdirSync(distBackupDir, { recursive: true });
if (!fs.existsSync(publicDir)) fs.mkdirSync(publicDir, { recursive: true });

if (fs.existsSync(srcImg)) {
  fs.copyFileSync(srcImg, path.join(distDir, 'provider_pp.png'));
  fs.copyFileSync(srcImg, path.join(distBackupDir, 'provider_pp.png'));
  fs.copyFileSync(srcImg, path.join(publicDir, 'provider_pp.png'));
  console.log('[PP Patch] Copied icon assets.');
}

// 2. Targets for JS bundle patches
const targets = [
  path.join(__dirname, 'dist_backup/assets/index-sn777-v10.js'),
  path.join(__dirname, 'dist/assets/index-sn777-v10.js')
];

const ppSlotItem = `{title:"PP",image:"/assets/provider_pp.png",category:"স্লট",isHot:!0}`;

targets.forEach(filePath => {
  if (!fs.existsSync(filePath)) return;
  let code = fs.readFileSync(filePath, 'utf8');

  // Ensure PP is in category "স্লট"
  if (!code.includes('category:"স্লট",isHot:!0},{title:"PP"')) {
    // Look for where FC is added, or just after PT if it exists
    const ptRegex = /\{title:"PT",image:"\/assets\/provider_pt\.png",category:"স্লট",isHot:!0\}/;
    if (ptRegex.test(code)) {
      code = code.replace(ptRegex, (match) => `${match},${ppSlotItem}`);
      console.log(`[PP Patch] Added PP in category স্লট after PT in ${path.basename(filePath)}`);
    } else {
      // Fallback: look for "FC"
      const fcRegex = /\{title:"FC",image:"[^"]+",category:"স্লট",isHot:!0\}/;
      if (fcRegex.test(code)) {
        code = code.replace(fcRegex, (match) => `${match},${ppSlotItem}`);
        console.log(`[PP Patch] Added PP in category স্লট after FC in ${path.basename(filePath)}`);
      }
    }
  }

  fs.writeFileSync(filePath, code, 'utf8');
});

console.log('[PP Patch] Finished successfully!');
