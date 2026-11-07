const fs = require('fs');
const path = require('path');

console.log('[Slot YGGDRASIL Patch] Starting comprehensive YGGDRASIL patch...');

const yggdrasilIcon = 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhlhD5FLnEVzV-W_Jh6Y-nur4sSE1fsQfojS9YTeTCwlEN8llRIX0GmSeY0mVR3Zi6GvSLEMQxDRJ3olIbG8EtGkj6MFcEJR6JAXXA8I-4Au7xvbFY1g_Sm2YEyux9711HYLFvXdCKFcbZEiBS5mUh1gpLRUHEbc0S3SCHQVMZK5dxKoeuY2SbzaPMc0oJh/s120/provider-awcv2_yggdrasil%20(1).png';

const yggdrasilProviderItem = `{title:"YGGDRASIL",image:"${yggdrasilIcon}",category:"স্লট",isHot:!1}`;

const yggdrasilSlotGames = [
  `{title:"Yggdrasil Fortune",image:"${yggdrasilIcon}",category:"YGGDRASIL",isHot:!1}`,
  `{title:"Yggdrasil Deluxe",image:"${yggdrasilIcon}",category:"YGGDRASIL",isHot:!1}`
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

  // 1. Ensure YGGDRASIL provider folder in category "স্লট"
  const yggdrasilRegex = /\{title:"YGGDRASIL",image:"[^"]+",category:"স্লট",isHot:[^}]+\}/;
  if (yggdrasilRegex.test(code)) {
    code = code.replace(yggdrasilRegex, yggdrasilProviderItem);
    changed = true;
    console.log(`[Slot YGGDRASIL Patch] Verified/Updated YGGDRASIL slot folder in ${path.basename(filePath)}`);
  } else {
    const rtRegex = /\{title:"RT",image:"[^"]+",category:"স্লট",isHot:[^}]+\}/;
    if (rtRegex.test(code)) {
      code = code.replace(rtRegex, (match) => `${match},${yggdrasilProviderItem}`);
      changed = true;
      console.log(`[Slot YGGDRASIL Patch] Added YGGDRASIL slot folder after RT in ${path.basename(filePath)}`);
    } else {
      const relaxRegex = /\{title:"RELAX",image:"[^"]+",category:"স্লট",isHot:[^}]+\}/;
      if (relaxRegex.test(code)) {
        code = code.replace(relaxRegex, (match) => `${match},${yggdrasilProviderItem}`);
        changed = true;
        console.log(`[Slot YGGDRASIL Patch] Added YGGDRASIL slot folder after RELAX in ${path.basename(filePath)}`);
      }
    }
  }

  // 2. Direct rules / folder click check for YGGDRASIL
  if (!code.includes('E==="YGGDRASIL"')) {
    if (code.includes('E==="RT")')) {
      code = code.replace(/E==="RT"\)/g, 'E==="RT"||E==="YGGDRASIL")');
      changed = true;
      console.log(`[Slot YGGDRASIL Patch] Added YGGDRASIL to provider rules check after RT in ${path.basename(filePath)}`);
    } else if (code.includes('E==="RELAX")')) {
      code = code.replace(/E==="RELAX"\)/g, 'E==="RELAX"||E==="YGGDRASIL")');
      changed = true;
      console.log(`[Slot YGGDRASIL Patch] Added YGGDRASIL to provider rules check after RELAX in ${path.basename(filePath)}`);
    }
  }

  // 3. Add YGGDRASIL games if not present
  if (!code.includes('category:"YGGDRASIL"')) {
    const rtGameRegex = /\{title:"RT Fortune"[^}]+\}/;
    if (rtGameRegex.test(code)) {
      code = code.replace(rtGameRegex, match => `${match},${yggdrasilSlotGames.join(',')}`);
      changed = true;
      console.log(`[Slot YGGDRASIL Patch] Added YGGDRASIL slot games after RT in ${path.basename(filePath)}`);
    } else {
      const relaxGameRegex = /\{title:"Relax Fortune"[^}]+\}/;
      if (relaxGameRegex.test(code)) {
        code = code.replace(relaxGameRegex, match => `${match},${yggdrasilSlotGames.join(',')}`);
        changed = true;
        console.log(`[Slot YGGDRASIL Patch] Added YGGDRASIL slot games after RELAX in ${path.basename(filePath)}`);
      }
    }
  }

  if (changed) {
    fs.writeFileSync(filePath, code, 'utf8');
  }
});

// 4. Update Cache-busting version in HTML files
const newVersion = '20261101_slot_yggdrasil_v1';
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
    console.log(`[Slot YGGDRASIL Patch] Updated script version in ${path.basename(f)} to ${newVersion}`);
  }
});

// 5. Update Cache Name in Service Worker files
const newCacheName = 'sn777-v46';
const swFiles = [
  path.join(__dirname, 'sw.js'),
  path.join(__dirname, 'public/sw.js'),
  path.join(__dirname, 'dist/sw.js')
];

swFiles.forEach(f => {
  if (fs.existsSync(f)) {
    let content = fs.readFileSync(f, 'utf8');
    content = content.replace(/const CACHE_NAME = "sn777-v[0-9]+";/, `const CACHE_NAME = "${newCacheName}";`);
    if (f.endsWith('sw.js') && !content.includes(yggdrasilIcon)) {
      content = content.replace(/const CORE_ASSETS = \[/, `const CORE_ASSETS = [\n  "${yggdrasilIcon}",`);
    }
    fs.writeFileSync(f, content, 'utf8');
    console.log(`[Slot YGGDRASIL Patch] Updated cache name in ${f} to ${newCacheName}`);
  }
});

console.log('[Slot YGGDRASIL Patch] Completed successfully!');
