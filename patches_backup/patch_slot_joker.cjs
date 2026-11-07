const fs = require('fs');
const path = require('path');

console.log('[Slot JOKER Patch] Starting comprehensive JOKER patch...');

const jokerIcon = 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgWnAUN2AkaGKLD4Fp_zwVnEniKGXM9IfOk9tYOvJ6lOg7EndH5Z6uwiJjXsHowa3N7KS1Ge5G23bMWBkLGNEOeupK56-xzk-69XQwiXhQho1Ch4-gAB0PwFTPu4duICl5ykBm7m59KqNt0eI40mRqqrJFEa-NlqoEBT63mzgzYJ5uTNCj533ReJvVYlgxF/s120/provider-joker.png';

const jokerProviderItem = `{title:"JOKER",image:"${jokerIcon}",category:"স্লট",isHot:!1}`;

const jokerSlotGames = [
  `{title:"Joker Fortune",image:"${jokerIcon}",category:"JOKER",isHot:!1}`,
  `{title:"Joker Deluxe",image:"${jokerIcon}",category:"JOKER",isHot:!1}`
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

  // 1. Ensure JOKER provider folder in category "স্লট"
  const jokerRegex = /\{title:"JOKER",image:"[^"]+",category:"স্লট",isHot:[^}]+\}/;
  if (jokerRegex.test(code)) {
    code = code.replace(jokerRegex, jokerProviderItem);
    changed = true;
    console.log(`[Slot JOKER Patch] Verified/Updated JOKER slot folder in ${path.basename(filePath)}`);
  } else {
    const injoyRegex = /\{title:"INJOY",image:"[^"]+",category:"স্লট",isHot:[^}]+\}/;
    if (injoyRegex.test(code)) {
      code = code.replace(injoyRegex, (match) => `${match},${jokerProviderItem}`);
      changed = true;
      console.log(`[Slot JOKER Patch] Added JOKER slot folder after INJOY in ${path.basename(filePath)}`);
    } else {
      const cq9Regex = /\{title:"CQ9",image:"[^"]+",category:"স্লট",isHot:[^}]+\}/;
      if (cq9Regex.test(code)) {
        code = code.replace(cq9Regex, (match) => `${match},${jokerProviderItem}`);
        changed = true;
        console.log(`[Slot JOKER Patch] Added JOKER slot folder after CQ9 in ${path.basename(filePath)}`);
      }
    }
  }

  // 2. Direct rules / folder click check for JOKER
  if (!code.includes('E==="JOKER"')) {
    if (code.includes('E==="INJOY")')) {
      code = code.replace(/E==="INJOY"\)/g, 'E==="INJOY"||E==="JOKER")');
      changed = true;
      console.log(`[Slot JOKER Patch] Added JOKER to provider rules check after INJOY in ${path.basename(filePath)}`);
    } else if (code.includes('E==="CQ9")')) {
      code = code.replace(/E==="CQ9"\)/g, 'E==="CQ9"||E==="JOKER")');
      changed = true;
      console.log(`[Slot JOKER Patch] Added JOKER to provider rules check after CQ9 in ${path.basename(filePath)}`);
    }
  }

  // 3. Add JOKER games if not present
  if (!code.includes('category:"JOKER"')) {
    const injoyGameRegex = /\{title:"INJOY Fortune"[^}]+\}/;
    if (injoyGameRegex.test(code)) {
      code = code.replace(injoyGameRegex, match => `${match},${jokerSlotGames.join(',')}`);
      changed = true;
      console.log(`[Slot JOKER Patch] Added JOKER slot games after INJOY in ${path.basename(filePath)}`);
    } else {
      const cq9GameRegex = /\{title:"CQ9 Fortune"[^}]+\}/;
      if (cq9GameRegex.test(code)) {
        code = code.replace(cq9GameRegex, match => `${match},${jokerSlotGames.join(',')}`);
        changed = true;
        console.log(`[Slot JOKER Patch] Added JOKER slot games after CQ9 in ${path.basename(filePath)}`);
      }
    }
  }

  if (changed) {
    fs.writeFileSync(filePath, code, 'utf8');
  }
});

// 4. Update Cache-busting version in HTML files
const newVersion = '20261101_slot_joker_v1';
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
    console.log(`[Slot JOKER Patch] Updated script version in ${path.basename(f)} to ${newVersion}`);
  }
});

// 5. Update Cache Name in Service Worker files
const newCacheName = 'sn777-v50';
const swFiles = [
  path.join(__dirname, 'sw.js'),
  path.join(__dirname, 'public/sw.js'),
  path.join(__dirname, 'dist/sw.js')
];

swFiles.forEach(f => {
  if (fs.existsSync(f)) {
    let content = fs.readFileSync(f, 'utf8');
    content = content.replace(/const CACHE_NAME = "sn777-v[0-9]+";/, `const CACHE_NAME = "${newCacheName}";`);
    if (f.endsWith('sw.js') && !content.includes(jokerIcon)) {
      content = content.replace(/const CORE_ASSETS = \[/, `const CORE_ASSETS = [\n  "${jokerIcon}",`);
    }
    fs.writeFileSync(f, content, 'utf8');
    console.log(`[Slot JOKER Patch] Updated cache name in ${f} to ${newCacheName}`);
  }
});

console.log('[Slot JOKER Patch] Completed successfully!');
