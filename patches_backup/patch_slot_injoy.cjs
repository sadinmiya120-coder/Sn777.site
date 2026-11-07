const fs = require('fs');
const path = require('path');

console.log('[Slot INJOY Patch] Starting comprehensive INJOY patch...');

const injoyIcon = 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEiXywSCiayNskxzeYcpEyJbh1ZHc-_xH5snhIhSs7ZMQEBf5f0EtgvhJiYiHACIE7f-Adnd6HxA8IHJiOgtOQtiMnsQPC9PrAo9S0neBK9UL8SIx-BqVi24iHHTVNxm-EwP6IrcPG_-vXW5R-2ynYjUgnbIywBGqT_kpdBk2ef1z5zxEPZPXQGBqeLzx2bh/s120/provider-jdbinjoy.png';

const injoyProviderItem = `{title:"INJOY",image:"${injoyIcon}",category:"স্লট",isHot:!1}`;

const injoySlotGames = [
  `{title:"INJOY Fortune",image:"${injoyIcon}",category:"INJOY",isHot:!1}`,
  `{title:"INJOY Deluxe",image:"${injoyIcon}",category:"INJOY",isHot:!1}`
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

  // 1. Ensure INJOY provider folder in category "স্লট"
  const injoyRegex = /\{title:"INJOY",image:"[^"]+",category:"স্লট",isHot:[^}]+\}/;
  if (injoyRegex.test(code)) {
    code = code.replace(injoyRegex, injoyProviderItem);
    changed = true;
    console.log(`[Slot INJOY Patch] Verified/Updated INJOY slot folder in ${path.basename(filePath)}`);
  } else {
    const cq9Regex = /\{title:"CQ9",image:"[^"]+",category:"স্লট",isHot:[^}]+\}/;
    if (cq9Regex.test(code)) {
      code = code.replace(cq9Regex, (match) => `${match},${injoyProviderItem}`);
      changed = true;
      console.log(`[Slot INJOY Patch] Added INJOY slot folder after CQ9 in ${path.basename(filePath)}`);
    } else {
      const ylRegex = /\{title:"YL",image:"[^"]+",category:"স্লট",isHot:[^}]+\}/;
      if (ylRegex.test(code)) {
        code = code.replace(ylRegex, (match) => `${match},${injoyProviderItem}`);
        changed = true;
        console.log(`[Slot INJOY Patch] Added INJOY slot folder after YL in ${path.basename(filePath)}`);
      }
    }
  }

  // 2. Direct rules / folder click check for INJOY
  if (!code.includes('E==="INJOY"')) {
    if (code.includes('E==="CQ9")')) {
      code = code.replace(/E==="CQ9"\)/g, 'E==="CQ9"||E==="INJOY")');
      changed = true;
      console.log(`[Slot INJOY Patch] Added INJOY to provider rules check after CQ9 in ${path.basename(filePath)}`);
    } else if (code.includes('E==="YL")')) {
      code = code.replace(/E==="YL"\)/g, 'E==="YL"||E==="INJOY")');
      changed = true;
      console.log(`[Slot INJOY Patch] Added INJOY to provider rules check after YL in ${path.basename(filePath)}`);
    }
  }

  // 3. Add INJOY games if not present
  if (!code.includes('category:"INJOY"')) {
    const cq9GameRegex = /\{title:"CQ9 Fortune"[^}]+\}/;
    if (cq9GameRegex.test(code)) {
      code = code.replace(cq9GameRegex, match => `${match},${injoySlotGames.join(',')}`);
      changed = true;
      console.log(`[Slot INJOY Patch] Added INJOY slot games after CQ9 in ${path.basename(filePath)}`);
    } else {
      const ylGameRegex = /\{title:"YL Fortune"[^}]+\}/;
      if (ylGameRegex.test(code)) {
        code = code.replace(ylGameRegex, match => `${match},${injoySlotGames.join(',')}`);
        changed = true;
        console.log(`[Slot INJOY Patch] Added INJOY slot games after YL in ${path.basename(filePath)}`);
      }
    }
  }

  if (changed) {
    fs.writeFileSync(filePath, code, 'utf8');
  }
});

// 4. Update Cache-busting version in HTML files
const newVersion = '20261101_slot_injoy_v1';
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
    console.log(`[Slot INJOY Patch] Updated script version in ${path.basename(f)} to ${newVersion}`);
  }
});

// 5. Update Cache Name in Service Worker files
const newCacheName = 'sn777-v49';
const swFiles = [
  path.join(__dirname, 'sw.js'),
  path.join(__dirname, 'public/sw.js'),
  path.join(__dirname, 'dist/sw.js')
];

swFiles.forEach(f => {
  if (fs.existsSync(f)) {
    let content = fs.readFileSync(f, 'utf8');
    content = content.replace(/const CACHE_NAME = "sn777-v[0-9]+";/, `const CACHE_NAME = "${newCacheName}";`);
    if (f.endsWith('sw.js') && !content.includes(injoyIcon)) {
      content = content.replace(/const CORE_ASSETS = \[/, `const CORE_ASSETS = [\n  "${injoyIcon}",`);
    }
    fs.writeFileSync(f, content, 'utf8');
    console.log(`[Slot INJOY Patch] Updated cache name in ${f} to ${newCacheName}`);
  }
});

console.log('[Slot INJOY Patch] Completed successfully!');
