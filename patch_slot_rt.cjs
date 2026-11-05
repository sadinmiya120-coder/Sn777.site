const fs = require('fs');
const path = require('path');

console.log('[Slot RT Patch] Starting comprehensive RT patch...');

const rtIcon = 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEh2n5QNawOpHuLmigSWWQdSmhMkClSGb1-7ruO7XvbLsucwwX3MNYWFcqNqXDqCe-At4jpPQgenbgZfS4R5t7yoVk0ZeQy-wnpzMG9Vzx3LTba-7UJETScExv2WuMfr0bkiwCFEVjbXPhqeWVBbHQ56vFt5rDx2qDF_zJzVS1fzeQqd_bqFpGB076uHbpJz/s120/provider-awcv2_rt.png';

const rtProviderItem = `{title:"RT",image:"${rtIcon}",category:"স্লট",isHot:!1}`;

const rtSlotGames = [
  `{title:"RT Fortune",image:"${rtIcon}",category:"RT",isHot:!1}`,
  `{title:"RT Deluxe",image:"${rtIcon}",category:"RT",isHot:!1}`
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

  // 1. Ensure RT provider folder in category "স্লট"
  const rtRegex = /\{title:"RT",image:"[^"]+",category:"স্লট",isHot:[^}]+\}/;
  if (rtRegex.test(code)) {
    code = code.replace(rtRegex, rtProviderItem);
    changed = true;
    console.log(`[Slot RT Patch] Verified/Updated RT slot folder in ${path.basename(filePath)}`);
  } else {
    const relaxRegex = /\{title:"RELAX",image:"[^"]+",category:"স্লট",isHot:[^}]+\}/;
    if (relaxRegex.test(code)) {
      code = code.replace(relaxRegex, (match) => `${match},${rtProviderItem}`);
      changed = true;
      console.log(`[Slot RT Patch] Added RT slot folder after RELAX in ${path.basename(filePath)}`);
    } else {
      const ptRegex = /\{title:"PT",image:"[^"]+",category:"স্লট",isHot:[^}]+\}/;
      if (ptRegex.test(code)) {
        code = code.replace(ptRegex, (match) => `${match},${rtProviderItem}`);
        changed = true;
        console.log(`[Slot RT Patch] Added RT slot folder after PT in ${path.basename(filePath)}`);
      }
    }
  }

  // 2. Direct rules / folder click check for RT
  if (!code.includes('E==="RT"')) {
    if (code.includes('E==="RELAX")')) {
      code = code.replace(/E==="RELAX"\)/g, 'E==="RELAX"||E==="RT")');
      changed = true;
      console.log(`[Slot RT Patch] Added RT to provider rules check after RELAX in ${path.basename(filePath)}`);
    } else if (code.includes('E==="PT")')) {
      code = code.replace(/E==="PT"\)/g, 'E==="PT"||E==="RT")');
      changed = true;
      console.log(`[Slot RT Patch] Added RT to provider rules check after PT in ${path.basename(filePath)}`);
    }
  }

  // 3. Add RT games if not present
  if (!code.includes('category:"RT"')) {
    const relaxGameRegex = /\{title:"Relax Fortune"[^}]+\}/;
    if (relaxGameRegex.test(code)) {
      code = code.replace(relaxGameRegex, match => `${match},${rtSlotGames.join(',')}`);
      changed = true;
      console.log(`[Slot RT Patch] Added RT slot games after RELAX in ${path.basename(filePath)}`);
    } else {
      const ptGameRegex = /\{title:"PT Fortune"[^}]+\}/;
      if (ptGameRegex.test(code)) {
        code = code.replace(ptGameRegex, match => `${match},${rtSlotGames.join(',')}`);
        changed = true;
        console.log(`[Slot RT Patch] Added RT slot games after PT in ${path.basename(filePath)}`);
      }
    }
  }

  if (changed) {
    fs.writeFileSync(filePath, code, 'utf8');
  }
});

// 4. Update Cache-busting version in HTML files
const newVersion = '20261101_slot_rt_v1';
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
    console.log(`[Slot RT Patch] Updated script version in ${path.basename(f)} to ${newVersion}`);
  }
});

// 5. Update Cache Name in Service Worker files
const newCacheName = 'sn777-v45';
const swFiles = [
  path.join(__dirname, 'sw.js'),
  path.join(__dirname, 'public/sw.js'),
  path.join(__dirname, 'dist/sw.js')
];

swFiles.forEach(f => {
  if (fs.existsSync(f)) {
    let content = fs.readFileSync(f, 'utf8');
    content = content.replace(/const CACHE_NAME = "sn777-v[0-9]+";/, `const CACHE_NAME = "${newCacheName}";`);
    if (f.endsWith('sw.js') && !content.includes(rtIcon)) {
      content = content.replace(/const CORE_ASSETS = \[/, `const CORE_ASSETS = [\n  "${rtIcon}",`);
    }
    fs.writeFileSync(f, content, 'utf8');
    console.log(`[Slot RT Patch] Updated cache name in ${f} to ${newCacheName}`);
  }
});

console.log('[Slot RT Patch] Completed successfully!');
