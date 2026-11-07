const fs = require('fs');
const path = require('path');

console.log('[Slot BTG Patch] Starting comprehensive BTG patch...');

const btgIcon = 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgrjr_W8CnNZMOanMD1WWKt6GPXvAdf2V4c8-Pq3jATgdVTPNinDiLe6qmxAIG0SMaPH6lzcl4WxJlqifWYLyXoQomIKzVPX61LkxOBY7_IEfAvo9KXzVKMKCK6rDARPBeTnzxpkaYD3LnbSMXVDHyIHT0XUWKD-V18-mxhJQwHvT5QpqqzOuaiXcRkrRc1/s120/provider-awcv2_btg.png';

const btgProviderItem = `{title:"BTG",image:"${btgIcon}",category:"স্লট",isHot:!1}`;

const btgSlotGames = [
  `{title:"BTG Bonanza",image:"${btgIcon}",category:"BTG",isHot:!0}`,
  `{title:"BTG Extra Chilli",image:"${btgIcon}",category:"BTG",isHot:!1}`
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

  // 1. Ensure BTG provider folder in category "স্লট"
  const btgRegex = /\{title:"BTG",image:"[^"]+",category:"স্লট",isHot:[^}]+\}/;
  if (btgRegex.test(code)) {
    code = code.replace(btgRegex, btgProviderItem);
    changed = true;
    console.log(`[Slot BTG Patch] Verified/Updated BTG slot folder in ${path.basename(filePath)}`);
  } else {
    const acewinRegex = /\{title:"ACEWIN",image:"[^"]+",category:"স্লট",isHot:[^}]+\}/;
    if (acewinRegex.test(code)) {
      code = code.replace(acewinRegex, (match) => `${match},${btgProviderItem}`);
      changed = true;
      console.log(`[Slot BTG Patch] Added BTG slot folder after ACEWIN in ${path.basename(filePath)}`);
    } else {
      const rich88Regex = /\{title:"RICH88",image:"[^"]+",category:"স্লট",isHot:[^}]+\}/;
      if (rich88Regex.test(code)) {
        code = code.replace(rich88Regex, (match) => `${match},${btgProviderItem}`);
        changed = true;
        console.log(`[Slot BTG Patch] Added BTG slot folder after RICH88 in ${path.basename(filePath)}`);
      }
    }
  }

  // 2. Direct rules / folder click check for BTG
  if (!code.includes('E==="BTG"')) {
    if (code.includes('E==="ACEWIN")')) {
      code = code.replace(/E==="ACEWIN"\)/g, 'E==="ACEWIN"||E==="BTG")');
      changed = true;
      console.log(`[Slot BTG Patch] Added BTG to provider rules check after ACEWIN in ${path.basename(filePath)}`);
    } else if (code.includes('E==="RICH88")')) {
      code = code.replace(/E==="RICH88"\)/g, 'E==="RICH88"||E==="BTG")');
      changed = true;
      console.log(`[Slot BTG Patch] Added BTG to provider rules check after RICH88 in ${path.basename(filePath)}`);
    }
  }

  // 3. Add BTG games if not present
  if (!code.includes('category:"BTG"')) {
    const acewinGameRegex = /\{title:"Acewin Fortune"[^}]+\}/;
    if (acewinGameRegex.test(code)) {
      code = code.replace(acewinGameRegex, match => `${match},${btgSlotGames.join(',')}`);
      changed = true;
      console.log(`[Slot BTG Patch] Added BTG slot games after Acewin in ${path.basename(filePath)}`);
    } else {
      const rich88GameRegex = /\{title:"Rich88 Fortune"[^}]+\}/;
      if (rich88GameRegex.test(code)) {
        code = code.replace(rich88GameRegex, match => `${match},${btgSlotGames.join(',')}`);
        changed = true;
        console.log(`[Slot BTG Patch] Added BTG slot games after Rich88 in ${path.basename(filePath)}`);
      }
    }
  }

  if (changed) {
    fs.writeFileSync(filePath, code, 'utf8');
  }
});

// 4. Update Cache-busting version in HTML files
const newVersion = '20261030_slot_btg_v1';
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
    console.log(`[Slot BTG Patch] Updated script version in ${path.basename(f)} to ${newVersion}`);
  }
});

// 5. Update Cache Name in Service Worker files
const newCacheName = 'sn777-v30';
const swFiles = [
  path.join(__dirname, 'sw.js'),
  path.join(__dirname, 'public/sw.js'),
  path.join(__dirname, 'dist/sw.js')
];

swFiles.forEach(f => {
  if (fs.existsSync(f)) {
    let content = fs.readFileSync(f, 'utf8');
    content = content.replace(/const CACHE_NAME = "sn777-v[0-9]+";/, `const CACHE_NAME = "${newCacheName}";`);
    if (f.endsWith('sw.js') && !content.includes(btgIcon)) {
      content = content.replace(/const CORE_ASSETS = \[/, `const CORE_ASSETS = [\n  "${btgIcon}",`);
    }
    fs.writeFileSync(f, content, 'utf8');
    console.log(`[Slot BTG Patch] Updated cache name in ${f} to ${newCacheName}`);
  }
});

console.log('[Slot BTG Patch] Completed successfully!');
