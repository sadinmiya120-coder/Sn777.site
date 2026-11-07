const fs = require('fs');
const path = require('path');

console.log('[Slot YL Patch] Starting comprehensive YL patch...');

const ylIcon = 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEj8JeDLF6v1JBh4Npct4Dsdz7UPTiEEnJxlAHblZcPZpLtuQMJJljKF9vWOIMODhEou7mmMdBWri2uB3uEkimDBJfazqhPtDroJQlJfCp6z0zqsVygR7l9TPpUe7i0BvXYOWlW68CzdiWzbqeOrSWA_WWuwU-llSAbB957mxKrL2B4jKU0WwzH4SzUleTUO/s360/provider-awcv2_yl.png';

const ylProviderItem = `{title:"YL",image:"${ylIcon}",category:"স্লট",isHot:!1}`;

const ylSlotGames = [
  `{title:"YL Fortune",image:"${ylIcon}",category:"YL",isHot:!1}`,
  `{title:"YL Deluxe",image:"${ylIcon}",category:"YL",isHot:!1}`
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

  // 1. Ensure YL provider folder in category "স্লট"
  const ylRegex = /\{title:"YL",image:"[^"]+",category:"স্লট",isHot:[^}]+\}/;
  if (ylRegex.test(code)) {
    code = code.replace(ylRegex, ylProviderItem);
    changed = true;
    console.log(`[Slot YL Patch] Verified/Updated YL slot folder in ${path.basename(filePath)}`);
  } else {
    const yggRegex = /\{title:"YGGDRASIL",image:"[^"]+",category:"স্লট",isHot:[^}]+\}/;
    if (yggRegex.test(code)) {
      code = code.replace(yggRegex, (match) => `${match},${ylProviderItem}`);
      changed = true;
      console.log(`[Slot YL Patch] Added YL slot folder after YGGDRASIL in ${path.basename(filePath)}`);
    } else {
      const rtRegex = /\{title:"RT",image:"[^"]+",category:"স্লট",isHot:[^}]+\}/;
      if (rtRegex.test(code)) {
        code = code.replace(rtRegex, (match) => `${match},${ylProviderItem}`);
        changed = true;
        console.log(`[Slot YL Patch] Added YL slot folder after RT in ${path.basename(filePath)}`);
      }
    }
  }

  // 2. Direct rules / folder click check for YL
  if (!code.includes('E==="YL"')) {
    if (code.includes('E==="YGGDRASIL")')) {
      code = code.replace(/E==="YGGDRASIL"\)/g, 'E==="YGGDRASIL"||E==="YL")');
      changed = true;
      console.log(`[Slot YL Patch] Added YL to provider rules check after YGGDRASIL in ${path.basename(filePath)}`);
    } else if (code.includes('E==="RT")')) {
      code = code.replace(/E==="RT"\)/g, 'E==="RT"||E==="YL")');
      changed = true;
      console.log(`[Slot YL Patch] Added YL to provider rules check after RT in ${path.basename(filePath)}`);
    }
  }

  // 3. Add YL games if not present
  if (!code.includes('category:"YL"')) {
    const yggGameRegex = /\{title:"Yggdrasil Fortune"[^}]+\}/;
    if (yggGameRegex.test(code)) {
      code = code.replace(yggGameRegex, match => `${match},${ylSlotGames.join(',')}`);
      changed = true;
      console.log(`[Slot YL Patch] Added YL slot games after YGGDRASIL in ${path.basename(filePath)}`);
    } else {
      const rtGameRegex = /\{title:"RT Fortune"[^}]+\}/;
      if (rtGameRegex.test(code)) {
        code = code.replace(rtGameRegex, match => `${match},${ylSlotGames.join(',')}`);
        changed = true;
        console.log(`[Slot YL Patch] Added YL slot games after RT in ${path.basename(filePath)}`);
      }
    }
  }

  if (changed) {
    fs.writeFileSync(filePath, code, 'utf8');
  }
});

// 4. Update Cache-busting version in HTML files
const newVersion = '20261101_slot_yl_v1';
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
    console.log(`[Slot YL Patch] Updated script version in ${path.basename(f)} to ${newVersion}`);
  }
});

// 5. Update Cache Name in Service Worker files
const newCacheName = 'sn777-v47';
const swFiles = [
  path.join(__dirname, 'sw.js'),
  path.join(__dirname, 'public/sw.js'),
  path.join(__dirname, 'dist/sw.js')
];

swFiles.forEach(f => {
  if (fs.existsSync(f)) {
    let content = fs.readFileSync(f, 'utf8');
    content = content.replace(/const CACHE_NAME = "sn777-v[0-9]+";/, `const CACHE_NAME = "${newCacheName}";`);
    if (f.endsWith('sw.js') && !content.includes(ylIcon)) {
      content = content.replace(/const CORE_ASSETS = \[/, `const CORE_ASSETS = [\n  "${ylIcon}",`);
    }
    fs.writeFileSync(f, content, 'utf8');
    console.log(`[Slot YL Patch] Updated cache name in ${f} to ${newCacheName}`);
  }
});

console.log('[Slot YL Patch] Completed successfully!');
