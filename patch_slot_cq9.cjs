const fs = require('fs');
const path = require('path');

console.log('[Slot CQ9 Patch] Starting comprehensive CQ9 patch...');

const cq9Icon = 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgQozXn0t75E-0d0jRZaiTYl4VLb2bhH9I3VZrrVoC_Qla_GTuX7Yit-tXcPkRR-M4136rCpUEE8aWnrpS8QI9teRuAzwsZEjP4HusDxgYy09AB9cDsDc3DTl5NvuouPJfbpaUQ3iUnc7q3vHgS1yWL0guKBSxPfdfPurcDv8FR4kQPpaBZUZWe8-qpQSoV/s120/provider-cq9.png';

const cq9ProviderItem = `{title:"CQ9",image:"${cq9Icon}",category:"স্লট",isHot:!1}`;

const cq9SlotGames = [
  `{title:"CQ9 Fortune",image:"${cq9Icon}",category:"CQ9",isHot:!1}`,
  `{title:"CQ9 Deluxe",image:"${cq9Icon}",category:"CQ9",isHot:!1}`
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

  // 1. Ensure CQ9 provider folder in category "স্লট"
  const cq9Regex = /\{title:"CQ9",image:"[^"]+",category:"স্লট",isHot:[^}]+\}/;
  if (cq9Regex.test(code)) {
    code = code.replace(cq9Regex, cq9ProviderItem);
    changed = true;
    console.log(`[Slot CQ9 Patch] Verified/Updated CQ9 slot folder in ${path.basename(filePath)}`);
  } else {
    const ylRegex = /\{title:"YL",image:"[^"]+",category:"স্লট",isHot:[^}]+\}/;
    if (ylRegex.test(code)) {
      code = code.replace(ylRegex, (match) => `${match},${cq9ProviderItem}`);
      changed = true;
      console.log(`[Slot CQ9 Patch] Added CQ9 slot folder after YL in ${path.basename(filePath)}`);
    } else {
      const yggRegex = /\{title:"YGGDRASIL",image:"[^"]+",category:"স্লট",isHot:[^}]+\}/;
      if (yggRegex.test(code)) {
        code = code.replace(yggRegex, (match) => `${match},${cq9ProviderItem}`);
        changed = true;
        console.log(`[Slot CQ9 Patch] Added CQ9 slot folder after YGGDRASIL in ${path.basename(filePath)}`);
      }
    }
  }

  // 2. Direct rules / folder click check for CQ9
  if (!code.includes('E==="CQ9"')) {
    if (code.includes('E==="YL")')) {
      code = code.replace(/E==="YL"\)/g, 'E==="YL"||E==="CQ9")');
      changed = true;
      console.log(`[Slot CQ9 Patch] Added CQ9 to provider rules check after YL in ${path.basename(filePath)}`);
    } else if (code.includes('E==="YGGDRASIL")')) {
      code = code.replace(/E==="YGGDRASIL"\)/g, 'E==="YGGDRASIL"||E==="CQ9")');
      changed = true;
      console.log(`[Slot CQ9 Patch] Added CQ9 to provider rules check after YGGDRASIL in ${path.basename(filePath)}`);
    }
  }

  // 3. Add CQ9 games if not present
  if (!code.includes('category:"CQ9"')) {
    const ylGameRegex = /\{title:"YL Fortune"[^}]+\}/;
    if (ylGameRegex.test(code)) {
      code = code.replace(ylGameRegex, match => `${match},${cq9SlotGames.join(',')}`);
      changed = true;
      console.log(`[Slot CQ9 Patch] Added CQ9 slot games after YL in ${path.basename(filePath)}`);
    } else {
      const yggGameRegex = /\{title:"Yggdrasil Fortune"[^}]+\}/;
      if (yggGameRegex.test(code)) {
        code = code.replace(yggGameRegex, match => `${match},${cq9SlotGames.join(',')}`);
        changed = true;
        console.log(`[Slot CQ9 Patch] Added CQ9 slot games after YGGDRASIL in ${path.basename(filePath)}`);
      }
    }
  }

  if (changed) {
    fs.writeFileSync(filePath, code, 'utf8');
  }
});

// 4. Update Cache-busting version in HTML files
const newVersion = '20261101_slot_cq9_v1';
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
    console.log(`[Slot CQ9 Patch] Updated script version in ${path.basename(f)} to ${newVersion}`);
  }
});

// 5. Update Cache Name in Service Worker files
const newCacheName = 'sn777-v48';
const swFiles = [
  path.join(__dirname, 'sw.js'),
  path.join(__dirname, 'public/sw.js'),
  path.join(__dirname, 'dist/sw.js')
];

swFiles.forEach(f => {
  if (fs.existsSync(f)) {
    let content = fs.readFileSync(f, 'utf8');
    content = content.replace(/const CACHE_NAME = "sn777-v[0-9]+";/, `const CACHE_NAME = "${newCacheName}";`);
    if (f.endsWith('sw.js') && !content.includes(cq9Icon)) {
      content = content.replace(/const CORE_ASSETS = \[/, `const CORE_ASSETS = [\n  "${cq9Icon}",`);
    }
    fs.writeFileSync(f, content, 'utf8');
    console.log(`[Slot CQ9 Patch] Updated cache name in ${f} to ${newCacheName}`);
  }
});

console.log('[Slot CQ9 Patch] Completed successfully!');
