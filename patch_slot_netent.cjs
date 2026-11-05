const fs = require('fs');
const path = require('path');

console.log('[Slot NETENT Patch] Starting comprehensive NETENT patch...');

const netentIcon = 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhANqkpuqcVUHUBEvexRpkT4OdUZS9FDyUgDiS9QnTRP2Y_Yx4f-XQ2rYqP_2adkP5A52hAXQ4pZyUFFTXLsAEdloa0DLZjAkXr3YM9R4Hw4ERBvYCAszw-8Jmghr6KnCe5y57Kgx0I8EDsull6gvPGhPQPMX46uvmTu0p288B-YEvpN-dFYR-2PDx0wx4J/s360/provider-awcv2_netent.png';

const netentProviderItem = `{title:"NETENT",image:"${netentIcon}",category:"স্লট",isHot:!1}`;

const netentSlotGames = [
  `{title:"Netent Starburst",image:"${netentIcon}",category:"NETENT",isHot:!1}`,
  `{title:"Netent Gonzo",image:"${netentIcon}",category:"NETENT",isHot:!1}`
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

  // 1. Ensure NETENT provider folder in category "স্লট"
  const netentRegex = /\{title:"NETENT",image:"[^"]+",category:"স্লট",isHot:[^}]+\}/;
  if (netentRegex.test(code)) {
    code = code.replace(netentRegex, netentProviderItem);
    changed = true;
    console.log(`[Slot NETENT Patch] Verified/Updated NETENT slot folder in ${path.basename(filePath)}`);
  } else {
    const mimiRegex = /\{title:"MIMI",image:"[^"]+",category:"স্লট",isHot:[^}]+\}/;
    if (mimiRegex.test(code)) {
      code = code.replace(mimiRegex, (match) => `${match},${netentProviderItem}`);
      changed = true;
      console.log(`[Slot NETENT Patch] Added NETENT slot folder after MIMI in ${path.basename(filePath)}`);
    } else {
      const msRegex = /\{title:"MICROSLOT",image:"[^"]+",category:"স্লট",isHot:[^}]+\}/;
      if (msRegex.test(code)) {
        code = code.replace(msRegex, (match) => `${match},${netentProviderItem}`);
        changed = true;
        console.log(`[Slot NETENT Patch] Added NETENT slot folder after MICROSLOT in ${path.basename(filePath)}`);
      }
    }
  }

  // 2. Direct rules / folder click check for NETENT
  if (!code.includes('E==="NETENT"')) {
    if (code.includes('E==="MIMI")')) {
      code = code.replace(/E==="MIMI"\)/g, 'E==="MIMI"||E==="NETENT")');
      changed = true;
      console.log(`[Slot NETENT Patch] Added NETENT to provider rules check after MIMI in ${path.basename(filePath)}`);
    } else if (code.includes('E==="MICROSLOT")')) {
      code = code.replace(/E==="MICROSLOT"\)/g, 'E==="MICROSLOT"||E==="NETENT")');
      changed = true;
      console.log(`[Slot NETENT Patch] Added NETENT to provider rules check after MICROSLOT in ${path.basename(filePath)}`);
    }
  }

  // 3. Add NETENT games if not present
  if (!code.includes('category:"NETENT"')) {
    const mimiGameRegex = /\{title:"Mimi Fortune"[^}]+\}/;
    if (mimiGameRegex.test(code)) {
      code = code.replace(mimiGameRegex, match => `${match},${netentSlotGames.join(',')}`);
      changed = true;
      console.log(`[Slot NETENT Patch] Added NETENT slot games after MIMI in ${path.basename(filePath)}`);
    } else {
      const msGameRegex = /\{title:"Microslot Fortune"[^}]+\}/;
      if (msGameRegex.test(code)) {
        code = code.replace(msGameRegex, match => `${match},${netentSlotGames.join(',')}`);
        changed = true;
        console.log(`[Slot NETENT Patch] Added NETENT slot games after MICROSLOT in ${path.basename(filePath)}`);
      }
    }
  }

  if (changed) {
    fs.writeFileSync(filePath, code, 'utf8');
  }
});

// 4. Update Cache-busting version in HTML files
const newVersion = '20261101_slot_netent_v1';
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
    console.log(`[Slot NETENT Patch] Updated script version in ${path.basename(f)} to ${newVersion}`);
  }
});

// 5. Update Cache Name in Service Worker files
const newCacheName = 'sn777-v38';
const swFiles = [
  path.join(__dirname, 'sw.js'),
  path.join(__dirname, 'public/sw.js'),
  path.join(__dirname, 'dist/sw.js')
];

swFiles.forEach(f => {
  if (fs.existsSync(f)) {
    let content = fs.readFileSync(f, 'utf8');
    content = content.replace(/const CACHE_NAME = "sn777-v[0-9]+";/, `const CACHE_NAME = "${newCacheName}";`);
    if (f.endsWith('sw.js') && !content.includes(netentIcon)) {
      content = content.replace(/const CORE_ASSETS = \[/, `const CORE_ASSETS = [\n  "${netentIcon}",`);
    }
    fs.writeFileSync(f, content, 'utf8');
    console.log(`[Slot NETENT Patch] Updated cache name in ${f} to ${newCacheName}`);
  }
});

console.log('[Slot NETENT Patch] Completed successfully!');
