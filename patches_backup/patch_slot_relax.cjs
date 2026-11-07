const fs = require('fs');
const path = require('path');

console.log('[Slot RELAX Patch] Starting comprehensive RELAX patch...');

const relaxIcon = 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEiVgAI2oDPNT31ndE7-qpIHfNZKIb_pc0FCm9YUzTQwGt-gf4WsEUtub1oC025VtwzZ2PUFSPwAxRcSqtON5BOr5hkH51F-S8JeR4ZR4ZWh77gGBsGXlR9TuLsVzoDeompZP69VC6m5YIeydpeNfzlZY7VCZc6gChBFf0v_DSA_n6qInxgnXy4Z8zluRhlB/s120/provider-awcv2_relax.png';

const relaxProviderItem = `{title:"RELAX",image:"${relaxIcon}",category:"স্লট",isHot:!1}`;

const relaxSlotGames = [
  `{title:"Relax Fortune",image:"${relaxIcon}",category:"RELAX",isHot:!1}`,
  `{title:"Relax Deluxe",image:"${relaxIcon}",category:"RELAX",isHot:!1}`
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

  // 1. Ensure RELAX provider folder in category "স্লট"
  const relaxRegex = /\{title:"RELAX",image:"[^"]+",category:"স্লট",isHot:[^}]+\}/;
  if (relaxRegex.test(code)) {
    code = code.replace(relaxRegex, relaxProviderItem);
    changed = true;
    console.log(`[Slot RELAX Patch] Verified/Updated RELAX slot folder in ${path.basename(filePath)}`);
  } else {
    const ptRegex = /\{title:"PT",image:"[^"]+",category:"স্লট",isHot:[^}]+\}/;
    if (ptRegex.test(code)) {
      code = code.replace(ptRegex, (match) => `${match},${relaxProviderItem}`);
      changed = true;
      console.log(`[Slot RELAX Patch] Added RELAX slot folder after PT in ${path.basename(filePath)}`);
    } else {
      const playstarRegex = /\{title:"PLAYSTAR",image:"[^"]+",category:"স্লট",isHot:[^}]+\}/;
      if (playstarRegex.test(code)) {
        code = code.replace(playstarRegex, (match) => `${match},${relaxProviderItem}`);
        changed = true;
        console.log(`[Slot RELAX Patch] Added RELAX slot folder after PLAYSTAR in ${path.basename(filePath)}`);
      }
    }
  }

  // 2. Direct rules / folder click check for RELAX
  if (!code.includes('E==="RELAX"')) {
    if (code.includes('E==="PT")')) {
      code = code.replace(/E==="PT"\)/g, 'E==="PT"||E==="RELAX")');
      changed = true;
      console.log(`[Slot RELAX Patch] Added RELAX to provider rules check after PT in ${path.basename(filePath)}`);
    } else if (code.includes('E==="PLAYSTAR")')) {
      code = code.replace(/E==="PLAYSTAR"\)/g, 'E==="PLAYSTAR"||E==="RELAX")');
      changed = true;
      console.log(`[Slot RELAX Patch] Added RELAX to provider rules check after PLAYSTAR in ${path.basename(filePath)}`);
    }
  }

  // 3. Add RELAX games if not present
  if (!code.includes('category:"RELAX"')) {
    const ptGameRegex = /\{title:"PT Fortune"[^}]+\}/;
    if (ptGameRegex.test(code)) {
      code = code.replace(ptGameRegex, match => `${match},${relaxSlotGames.join(',')}`);
      changed = true;
      console.log(`[Slot RELAX Patch] Added RELAX slot games after PT in ${path.basename(filePath)}`);
    } else {
      const playstarGameRegex = /\{title:"Playstar Fortune"[^}]+\}/;
      if (playstarGameRegex.test(code)) {
        code = code.replace(playstarGameRegex, match => `${match},${relaxSlotGames.join(',')}`);
        changed = true;
        console.log(`[Slot RELAX Patch] Added RELAX slot games after PLAYSTAR in ${path.basename(filePath)}`);
      }
    }
  }

  if (changed) {
    fs.writeFileSync(filePath, code, 'utf8');
  }
});

// 4. Update Cache-busting version in HTML files
const newVersion = '20261101_slot_relax_v1';
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
    console.log(`[Slot RELAX Patch] Updated script version in ${path.basename(f)} to ${newVersion}`);
  }
});

// 5. Update Cache Name in Service Worker files
const newCacheName = 'sn777-v44';
const swFiles = [
  path.join(__dirname, 'sw.js'),
  path.join(__dirname, 'public/sw.js'),
  path.join(__dirname, 'dist/sw.js')
];

swFiles.forEach(f => {
  if (fs.existsSync(f)) {
    let content = fs.readFileSync(f, 'utf8');
    content = content.replace(/const CACHE_NAME = "sn777-v[0-9]+";/, `const CACHE_NAME = "${newCacheName}";`);
    if (f.endsWith('sw.js') && !content.includes(relaxIcon)) {
      content = content.replace(/const CORE_ASSETS = \[/, `const CORE_ASSETS = [\n  "${relaxIcon}",`);
    }
    fs.writeFileSync(f, content, 'utf8');
    console.log(`[Slot RELAX Patch] Updated cache name in ${f} to ${newCacheName}`);
  }
});

console.log('[Slot RELAX Patch] Completed successfully!');
