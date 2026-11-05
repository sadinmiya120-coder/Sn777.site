const fs = require('fs');
const path = require('path');

console.log('[Slot MICROSLOT Patch] Starting comprehensive MICROSLOT patch...');

const microslotIcon = 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEia7OZJkpobmczV044nOviwc4_MfjWuyuYd7XCglhlAMP0-PDadY8QKzMFHaGQ0yKJPfaOnKUBeBmAZw0w_2JDXigUDgjPXBb-9OAylFvrj82ehvEeWiFIGHsCIgs5NSexpaPdb7KusuxbBvUGNLvpSfwVwRPHhnJSQzUAFXzNMx9oyyz0txCziSRWeyoVu/s120/provider-awcv2_microslot.png';

const microslotProviderItem = `{title:"MICROSLOT",image:"${microslotIcon}",category:"স্লট",isHot:!1}`;

const microslotSlotGames = [
  `{title:"Microslot Fortune",image:"${microslotIcon}",category:"MICROSLOT",isHot:!1}`,
  `{title:"Microslot Deluxe",image:"${microslotIcon}",category:"MICROSLOT",isHot:!1}`
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

  // 1. Ensure MICROSLOT provider folder in category "স্লট"
  const msRegex = /\{title:"MICROSLOT",image:"[^"]+",category:"স্লট",isHot:[^}]+\}/;
  if (msRegex.test(code)) {
    code = code.replace(msRegex, microslotProviderItem);
    changed = true;
    console.log(`[Slot MICROSLOT Patch] Verified/Updated MICROSLOT slot folder in ${path.basename(filePath)}`);
  } else {
    const kmRegex = /\{title:"KM",image:"[^"]+",category:"স্লট",isHot:[^}]+\}/;
    if (kmRegex.test(code)) {
      code = code.replace(kmRegex, (match) => `${match},${microslotProviderItem}`);
      changed = true;
      console.log(`[Slot MICROSLOT Patch] Added MICROSLOT slot folder after KM in ${path.basename(filePath)}`);
    } else {
      const hacksawRegex = /\{title:"HACKSAW",image:"[^"]+",category:"স্লট",isHot:[^}]+\}/;
      if (hacksawRegex.test(code)) {
        code = code.replace(hacksawRegex, (match) => `${match},${microslotProviderItem}`);
        changed = true;
        console.log(`[Slot MICROSLOT Patch] Added MICROSLOT slot folder after HACKSAW in ${path.basename(filePath)}`);
      }
    }
  }

  // 2. Direct rules / folder click check for MICROSLOT
  if (!code.includes('E==="MICROSLOT"')) {
    if (code.includes('E==="KM")')) {
      code = code.replace(/E==="KM"\)/g, 'E==="KM"||E==="MICROSLOT")');
      changed = true;
      console.log(`[Slot MICROSLOT Patch] Added MICROSLOT to provider rules check after KM in ${path.basename(filePath)}`);
    } else if (code.includes('E==="HACKSAW")')) {
      code = code.replace(/E==="HACKSAW"\)/g, 'E==="HACKSAW"||E==="MICROSLOT")');
      changed = true;
      console.log(`[Slot MICROSLOT Patch] Added MICROSLOT to provider rules check after HACKSAW in ${path.basename(filePath)}`);
    }
  }

  // 3. Add MICROSLOT games if not present
  if (!code.includes('category:"MICROSLOT"')) {
    const kmGameRegex = /\{title:"Kingmaker Fortune"[^}]+\}/;
    if (kmGameRegex.test(code)) {
      code = code.replace(kmGameRegex, match => `${match},${microslotSlotGames.join(',')}`);
      changed = true;
      console.log(`[Slot MICROSLOT Patch] Added MICROSLOT slot games after KM in ${path.basename(filePath)}`);
    } else {
      const hacksawGameRegex = /\]+\}/;
      if (hacksawGameRegex.test(code)) {
        code = code.replace(hacksawGameRegex, match => `${match},${microslotSlotGames.join(',')}`);
        changed = true;
        console.log(`[Slot MICROSLOT Patch] Added MICROSLOT slot games after HACKSAW in ${path.basename(filePath)}`);
      }
    }
  }

  if (changed) {
    fs.writeFileSync(filePath, code, 'utf8');
  }
});

// 4. Update Cache-busting version in HTML files
const newVersion = '20261101_slot_microslot_v1';
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
    console.log(`[Slot MICROSLOT Patch] Updated script version in ${path.basename(f)} to ${newVersion}`);
  }
});

// 5. Update Cache Name in Service Worker files
const newCacheName = 'sn777-v36';
const swFiles = [
  path.join(__dirname, 'sw.js'),
  path.join(__dirname, 'public/sw.js'),
  path.join(__dirname, 'dist/sw.js')
];

swFiles.forEach(f => {
  if (fs.existsSync(f)) {
    let content = fs.readFileSync(f, 'utf8');
    content = content.replace(/const CACHE_NAME = "sn777-v[0-9]+";/, `const CACHE_NAME = "${newCacheName}";`);
    if (f.endsWith('sw.js') && !content.includes(microslotIcon)) {
      content = content.replace(/const CORE_ASSETS = \[/, `const CORE_ASSETS = [\n  "${microslotIcon}",`);
    }
    fs.writeFileSync(f, content, 'utf8');
    console.log(`[Slot MICROSLOT Patch] Updated cache name in ${f} to ${newCacheName}`);
  }
});

console.log('[Slot MICROSLOT Patch] Completed successfully!');
