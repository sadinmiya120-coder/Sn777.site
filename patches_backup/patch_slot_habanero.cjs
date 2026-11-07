const fs = require('fs');
const path = require('path');

console.log('[Slot HABANERO Patch] Starting comprehensive HABANERO patch...');

const habaneroIcon = 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEiFQy0O8xcTpMnlEPFmmw9Xzxw15x2iAit7sA2sPjiCKlbV5lF_pbLakYqnbnKfBgoSjirTNm560QqI8-gfpOEbPV3eO-BDJDPQSDu5j5m5eALSo5Icqc9Zxx1bw6etcAgQ8-S50_GYnlbtAHuKPP9apP8ZOPnjhVtX8mW5aTPpiMQzbA5Mc3xAsEMZoJTh/s120/provider-awcv2_habanero.png';

const habaneroProviderItem = `{title:"HABANERO",image:"${habaneroIcon}",category:"স্লট",isHot:!1}`;

const habaneroSlotGames = [
  `{title:"Habanero Fortune",image:"${habaneroIcon}",category:"HABANERO",isHot:!1}`,
  `{title:"Habanero Deluxe",image:"${habaneroIcon}",category:"HABANERO",isHot:!1}`
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

  // 1. Ensure HABANERO provider folder in category "স্লট"
  const habaneroRegex = /\{title:"HABANERO",image:"[^"]+",category:"স্লট",isHot:[^}]+\}/;
  if (habaneroRegex.test(code)) {
    code = code.replace(habaneroRegex, habaneroProviderItem);
    changed = true;
    console.log(`[Slot HABANERO Patch] Verified/Updated HABANERO slot folder in ${path.basename(filePath)}`);
  } else {
    const wmRegex = /\{title:"WORLDMATCH",image:"[^"]+",category:"স্লট",isHot:[^}]+\}/;
    if (wmRegex.test(code)) {
      code = code.replace(wmRegex, (match) => `${match},${habaneroProviderItem}`);
      changed = true;
      console.log(`[Slot HABANERO Patch] Added HABANERO slot folder after WORLDMATCH in ${path.basename(filePath)}`);
    } else {
      const mahaRegex = /\{title:"MAHA",image:"[^"]+",category:"স্লট",isHot:[^}]+\}/;
      if (mahaRegex.test(code)) {
        code = code.replace(mahaRegex, (match) => `${match},${habaneroProviderItem}`);
        changed = true;
        console.log(`[Slot HABANERO Patch] Added HABANERO slot folder after MAHA in ${path.basename(filePath)}`);
      }
    }
  }

  // 2. Direct rules / folder click check for HABANERO
  if (!code.includes('E==="HABANERO"')) {
    if (code.includes('E==="WORLDMATCH")')) {
      code = code.replace(/E==="WORLDMATCH"\)/g, 'E==="WORLDMATCH"||E==="HABANERO")');
      changed = true;
      console.log(`[Slot HABANERO Patch] Added HABANERO to provider rules check after WORLDMATCH in ${path.basename(filePath)}`);
    } else if (code.includes('E==="MAHA")')) {
      code = code.replace(/E==="MAHA"\)/g, 'E==="MAHA"||E==="HABANERO")');
      changed = true;
      console.log(`[Slot HABANERO Patch] Added HABANERO to provider rules check after MAHA in ${path.basename(filePath)}`);
    }
  }

  // 3. Add HABANERO games if not present
  if (!code.includes('category:"HABANERO"')) {
    const wmGameRegex = /\{title:"Worldmatch Fortune"[^}]+\}/;
    if (wmGameRegex.test(code)) {
      code = code.replace(wmGameRegex, match => `${match},${habaneroSlotGames.join(',')}`);
      changed = true;
      console.log(`[Slot HABANERO Patch] Added HABANERO slot games after WORLDMATCH in ${path.basename(filePath)}`);
    } else {
      const mahaGameRegex = /\{title:"MAHA Fortune"[^}]+\}/;
      if (mahaGameRegex.test(code)) {
        code = code.replace(mahaGameRegex, match => `${match},${habaneroSlotGames.join(',')}`);
        changed = true;
        console.log(`[Slot HABANERO Patch] Added HABANERO slot games after MAHA in ${path.basename(filePath)}`);
      }
    }
  }

  if (changed) {
    fs.writeFileSync(filePath, code, 'utf8');
  }
});

// 4. Update Cache-busting version in HTML files
const newVersion = '20261101_slot_habanero_v1';
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
    console.log(`[Slot HABANERO Patch] Updated script version in ${path.basename(f)} to ${newVersion}`);
  }
});

// 5. Update Cache Name in Service Worker files
const newCacheName = 'sn777-v54';
const swFiles = [
  path.join(__dirname, 'sw.js'),
  path.join(__dirname, 'public/sw.js'),
  path.join(__dirname, 'dist/sw.js')
];

swFiles.forEach(f => {
  if (fs.existsSync(f)) {
    let content = fs.readFileSync(f, 'utf8');
    content = content.replace(/const CACHE_NAME = "sn777-v[0-9]+";/, `const CACHE_NAME = "${newCacheName}";`);
    if (f.endsWith('sw.js') && !content.includes(habaneroIcon)) {
      content = content.replace(/const CORE_ASSETS = \[/, `const CORE_ASSETS = [\n  "${habaneroIcon}",`);
    }
    fs.writeFileSync(f, content, 'utf8');
    console.log(`[Slot HABANERO Patch] Updated cache name in ${f} to ${newCacheName}`);
  }
});

console.log('[Slot HABANERO Patch] Completed successfully!');
