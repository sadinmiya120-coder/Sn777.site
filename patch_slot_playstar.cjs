const fs = require('fs');
const path = require('path');

console.log('[Slot PLAYSTAR Patch] Starting comprehensive PLAYSTAR patch...');

const playstarIcon = 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjascepBoqSjzBs9Rrj-8LZb2hd_3N7cG1S8gYDUvt91GmjoIb3JZs25_vkhv7cfehHPt46rAdAZkKKyaOSpA01H6iUSnvIlKhyphenhyphen6tWxmf9saobm_ORlmRzoEZa5tNKaKTzBVV2DdHwqRkugdwHN7nUwjNe4Lx5NDxovS_tx2xWUaEreh9-Z10tkh7rhgBb7/s120/provider-awcv2_playstar.png';

const playstarProviderItem = `{title:"PLAYSTAR",image:"${playstarIcon}",category:"স্লট",isHot:!1}`;

const playstarSlotGames = [
  `{title:"Playstar Fortune",image:"${playstarIcon}",category:"PLAYSTAR",isHot:!1}`,
  `{title:"Playstar Deluxe",image:"${playstarIcon}",category:"PLAYSTAR",isHot:!1}`
];

const jsTargets = [
  path.join(__dirname, 'dist/assets/index-sn777-v12.js'),
  path.join(__dirname, 'dist_backup/assets/index-sn777-v12.js'),
  path.join(__dirname, 'original-index-sn777-v5.js')
];

jsTargets.forEach(filePath => {
  if (!fs.existsSync(filePath)) return;
  let code = fs.readFileSync(filePath, 'utf8');
  let changed = false;

  // 1. Ensure PLAYSTAR provider folder in category "স্লট"
  const playstarRegex = /\{title:"PLAYSTAR",image:"[^"]+",category:"স্লট",isHot:[^}]+\}/;
  if (playstarRegex.test(code)) {
    code = code.replace(playstarRegex, playstarProviderItem);
    changed = true;
    console.log(`[Slot PLAYSTAR Patch] Verified/Updated PLAYSTAR slot folder in ${path.basename(filePath)}`);
  } else {
    const p8Regex = /\{title:"P8",image:"[^"]+",category:"স্লট",isHot:[^}]+\}/;
    if (p8Regex.test(code)) {
      code = code.replace(p8Regex, (match) => `${match},${playstarProviderItem}`);
      changed = true;
      console.log(`[Slot PLAYSTAR Patch] Added PLAYSTAR slot folder after P8 in ${path.basename(filePath)}`);
    } else {
      const octoplayRegex = /\{title:"OCTOPLAY",image:"[^"]+",category:"স্লট",isHot:[^}]+\}/;
      if (octoplayRegex.test(code)) {
        code = code.replace(octoplayRegex, (match) => `${match},${playstarProviderItem}`);
        changed = true;
        console.log(`[Slot PLAYSTAR Patch] Added PLAYSTAR slot folder after OCTOPLAY in ${path.basename(filePath)}`);
      }
    }
  }

  // 2. Direct rules / folder click check for PLAYSTAR
  if (!code.includes('E==="PLAYSTAR"')) {
    if (code.includes('E==="P8")')) {
      code = code.replace(/E==="P8"\)/g, 'E==="P8"||E==="PLAYSTAR")');
      changed = true;
      console.log(`[Slot PLAYSTAR Patch] Added PLAYSTAR to provider rules check after P8 in ${path.basename(filePath)}`);
    } else if (code.includes('E==="OCTOPLAY")')) {
      code = code.replace(/E==="OCTOPLAY"\)/g, 'E==="OCTOPLAY"||E==="PLAYSTAR")');
      changed = true;
      console.log(`[Slot PLAYSTAR Patch] Added PLAYSTAR to provider rules check after OCTOPLAY in ${path.basename(filePath)}`);
    }
  }

  // 3. Add PLAYSTAR games if not present
  if (!code.includes('category:"PLAYSTAR"')) {
    const p8GameRegex = /\{title:"P8 Fortune"[^}]+\}/;
    if (p8GameRegex.test(code)) {
      code = code.replace(p8GameRegex, match => `${match},${playstarSlotGames.join(',')}`);
      changed = true;
      console.log(`[Slot PLAYSTAR Patch] Added PLAYSTAR slot games after P8 in ${path.basename(filePath)}`);
    } else {
      const octoplayGameRegex = /\{title:"Octoplay Fortune"[^}]+\}/;
      if (octoplayGameRegex.test(code)) {
        code = code.replace(octoplayGameRegex, match => `${match},${playstarSlotGames.join(',')}`);
        changed = true;
        console.log(`[Slot PLAYSTAR Patch] Added PLAYSTAR slot games after OCTOPLAY in ${path.basename(filePath)}`);
      }
    }
  }

  if (changed) {
    fs.writeFileSync(filePath, code, 'utf8');
  }
});

// 4. Update Cache-busting version in HTML files
const newVersion = '20261101_slot_playstar_v1';
const htmlFiles = [
  path.join(__dirname, 'index.html'),
  path.join(__dirname, 'dist/index.html'),
  path.join(__dirname, 'dist_backup/index.html')
];

htmlFiles.forEach(f => {
  if (fs.existsSync(f)) {
    let content = fs.readFileSync(f, 'utf8');
    content = content.replace(/index-sn777-v12\.js\?v=[a-zA-Z0-9_-]+/g, `index-sn777-v12.js?v=${newVersion}`);
    content = content.replace(/var APP_VER = "[^"]+";/, `var APP_VER = "${newVersion}";`);
    fs.writeFileSync(f, content, 'utf8');
    console.log(`[Slot PLAYSTAR Patch] Updated script version in ${path.basename(f)} to ${newVersion}`);
  }
});

// 5. Update Cache Name in Service Worker files
const newCacheName = 'sn777-v42';
const swFiles = [
  path.join(__dirname, 'sw.js'),
  path.join(__dirname, 'public/sw.js'),
  path.join(__dirname, 'dist/sw.js')
];

swFiles.forEach(f => {
  if (fs.existsSync(f)) {
    let content = fs.readFileSync(f, 'utf8');
    content = content.replace(/const CACHE_NAME = "sn777-v[0-9]+";/, `const CACHE_NAME = "${newCacheName}";`);
    if (f.endsWith('sw.js') && !content.includes(playstarIcon)) {
      content = content.replace(/const CORE_ASSETS = \[/, `const CORE_ASSETS = [\n  "${playstarIcon}",`);
    }
    fs.writeFileSync(f, content, 'utf8');
    console.log(`[Slot PLAYSTAR Patch] Updated cache name in ${f} to ${newCacheName}`);
  }
});

console.log('[Slot PLAYSTAR Patch] Completed successfully!');
