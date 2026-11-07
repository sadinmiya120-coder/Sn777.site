const fs = require('fs');
const path = require('path');

console.log('[Slot MIMI Patch] Starting comprehensive MIMI patch...');

const mimiIcon = 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEiOjPfkNFlng0VPGXz-8UWHrvxRzFPi12H-Tkq_KTG2XqV-eVlGvTO_CcWAp782eo-T_8vnu-V2jXKOqTMq2wd6nKMyIMaK3WsjDgWwe_QPET6wbNCd0YBbY80hJHPFhHy3Xza0MRXF1Lsj7xX_gM0DOo3JzRIDniwhDvkhBBJ8VaPcRtBTTm19VU-Ceq_S/s120/provider-awcv2_mimi.png';

const mimiProviderItem = `{title:"MIMI",image:"${mimiIcon}",category:"স্লট",isHot:!1}`;

const mimiSlotGames = [
  `{title:"Mimi Fortune",image:"${mimiIcon}",category:"MIMI",isHot:!1}`,
  `{title:"Mimi Deluxe",image:"${mimiIcon}",category:"MIMI",isHot:!1}`
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

  // 1. Ensure MIMI provider folder in category "স্লট"
  const mimiRegex = /\{title:"MIMI",image:"[^"]+",category:"স্লট",isHot:[^}]+\}/;
  if (mimiRegex.test(code)) {
    code = code.replace(mimiRegex, mimiProviderItem);
    changed = true;
    console.log(`[Slot MIMI Patch] Verified/Updated MIMI slot folder in ${path.basename(filePath)}`);
  } else {
    const msRegex = /\{title:"MICROSLOT",image:"[^"]+",category:"স্লট",isHot:[^}]+\}/;
    if (msRegex.test(code)) {
      code = code.replace(msRegex, (match) => `${match},${mimiProviderItem}`);
      changed = true;
      console.log(`[Slot MIMI Patch] Added MIMI slot folder after MICROSLOT in ${path.basename(filePath)}`);
    } else {
      const kmRegex = /\{title:"KM",image:"[^"]+",category:"স্লট",isHot:[^}]+\}/;
      if (kmRegex.test(code)) {
        code = code.replace(kmRegex, (match) => `${match},${mimiProviderItem}`);
        changed = true;
        console.log(`[Slot MIMI Patch] Added MIMI slot folder after KM in ${path.basename(filePath)}`);
      }
    }
  }

  // 2. Direct rules / folder click check for MIMI
  if (!code.includes('E==="MIMI"')) {
    if (code.includes('E==="MICROSLOT")')) {
      code = code.replace(/E==="MICROSLOT"\)/g, 'E==="MICROSLOT"||E==="MIMI")');
      changed = true;
      console.log(`[Slot MIMI Patch] Added MIMI to provider rules check after MICROSLOT in ${path.basename(filePath)}`);
    } else if (code.includes('E==="KM")')) {
      code = code.replace(/E==="KM"\)/g, 'E==="KM"||E==="MIMI")');
      changed = true;
      console.log(`[Slot MIMI Patch] Added MIMI to provider rules check after KM in ${path.basename(filePath)}`);
    }
  }

  // 3. Add MIMI games if not present
  if (!code.includes('category:"MIMI"')) {
    const msGameRegex = /\{title:"Microslot Fortune"[^}]+\}/;
    if (msGameRegex.test(code)) {
      code = code.replace(msGameRegex, match => `${match},${mimiSlotGames.join(',')}`);
      changed = true;
      console.log(`[Slot MIMI Patch] Added MIMI slot games after MICROSLOT in ${path.basename(filePath)}`);
    } else {
      const kmGameRegex = /\{title:"Kingmaker Fortune"[^}]+\}/;
      if (kmGameRegex.test(code)) {
        code = code.replace(kmGameRegex, match => `${match},${mimiSlotGames.join(',')}`);
        changed = true;
        console.log(`[Slot MIMI Patch] Added MIMI slot games after KM in ${path.basename(filePath)}`);
      }
    }
  }

  if (changed) {
    fs.writeFileSync(filePath, code, 'utf8');
  }
});

// 4. Update Cache-busting version in HTML files
const newVersion = '20261101_slot_mimi_v1';
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
    console.log(`[Slot MIMI Patch] Updated script version in ${path.basename(f)} to ${newVersion}`);
  }
});

// 5. Update Cache Name in Service Worker files
const newCacheName = 'sn777-v37';
const swFiles = [
  path.join(__dirname, 'sw.js'),
  path.join(__dirname, 'public/sw.js'),
  path.join(__dirname, 'dist/sw.js')
];

swFiles.forEach(f => {
  if (fs.existsSync(f)) {
    let content = fs.readFileSync(f, 'utf8');
    content = content.replace(/const CACHE_NAME = "sn777-v[0-9]+";/, `const CACHE_NAME = "${newCacheName}";`);
    if (f.endsWith('sw.js') && !content.includes(mimiIcon)) {
      content = content.replace(/const CORE_ASSETS = \[/, `const CORE_ASSETS = [\n  "${mimiIcon}",`);
    }
    fs.writeFileSync(f, content, 'utf8');
    console.log(`[Slot MIMI Patch] Updated cache name in ${f} to ${newCacheName}`);
  }
});

console.log('[Slot MIMI Patch] Completed successfully!');
