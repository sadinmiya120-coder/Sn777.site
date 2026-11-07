const fs = require('fs');
const path = require('path');

console.log('[Slot P8 Patch] Starting comprehensive P8 patch...');

const p8Icon = 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEh1m0wgG-ZGneXWcuHimcm-czygs4LONqxWLdeWu_0mXtZapx4dm8Z-kE7MdkmeP1YZVtjB7Tz197jTwhoB5XxMfbBMqzcbACPfFxskRSDN-YsDFlJf85PsI9q8QL6WrqZ_NNVhQw1dLyCO0-N8tt8pW1i9uQjSp1p1hGQHteN-GoEe4FP5TWbnoo1Yf02e/s120/provider-awcv2_play8.png';

const p8ProviderItem = `{title:"P8",image:"${p8Icon}",category:"স্লট",isHot:!1}`;

const p8SlotGames = [
  `{title:"P8 Fortune",image:"${p8Icon}",category:"P8",isHot:!1}`,
  `{title:"P8 Deluxe",image:"${p8Icon}",category:"P8",isHot:!1}`
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

  // 1. Ensure P8 provider folder in category "স্লট"
  const p8Regex = /\{title:"P8",image:"[^"]+",category:"স্লট",isHot:[^}]+\}/;
  if (p8Regex.test(code)) {
    code = code.replace(p8Regex, p8ProviderItem);
    changed = true;
    console.log(`[Slot P8 Patch] Verified/Updated P8 slot folder in ${path.basename(filePath)}`);
  } else {
    const octoplayRegex = /\{title:"OCTOPLAY",image:"[^"]+",category:"স্লট",isHot:[^}]+\}/;
    if (octoplayRegex.test(code)) {
      code = code.replace(octoplayRegex, (match) => `${match},${p8ProviderItem}`);
      changed = true;
      console.log(`[Slot P8 Patch] Added P8 slot folder after OCTOPLAY in ${path.basename(filePath)}`);
    } else {
      const nlcRegex = /\{title:"NLC",image:"[^"]+",category:"স্লট",isHot:[^}]+\}/;
      if (nlcRegex.test(code)) {
        code = code.replace(nlcRegex, (match) => `${match},${p8ProviderItem}`);
        changed = true;
        console.log(`[Slot P8 Patch] Added P8 slot folder after NLC in ${path.basename(filePath)}`);
      }
    }
  }

  // 2. Direct rules / folder click check for P8
  if (!code.includes('E==="P8"')) {
    if (code.includes('E==="OCTOPLAY")')) {
      code = code.replace(/E==="OCTOPLAY"\)/g, 'E==="OCTOPLAY"||E==="P8")');
      changed = true;
      console.log(`[Slot P8 Patch] Added P8 to provider rules check after OCTOPLAY in ${path.basename(filePath)}`);
    } else if (code.includes('E==="NLC")')) {
      code = code.replace(/E==="NLC"\)/g, 'E==="NLC"||E==="P8")');
      changed = true;
      console.log(`[Slot P8 Patch] Added P8 to provider rules check after NLC in ${path.basename(filePath)}`);
    }
  }

  // 3. Add P8 games if not present
  if (!code.includes('category:"P8"')) {
    const octoplayGameRegex = /\{title:"Octoplay Fortune"[^}]+\}/;
    if (octoplayGameRegex.test(code)) {
      code = code.replace(octoplayGameRegex, match => `${match},${p8SlotGames.join(',')}`);
      changed = true;
      console.log(`[Slot P8 Patch] Added P8 slot games after OCTOPLAY in ${path.basename(filePath)}`);
    } else {
      const nlcGameRegex = /\{title:"NLC Fortune"[^}]+\}/;
      if (nlcGameRegex.test(code)) {
        code = code.replace(nlcGameRegex, match => `${match},${p8SlotGames.join(',')}`);
        changed = true;
        console.log(`[Slot P8 Patch] Added P8 slot games after NLC in ${path.basename(filePath)}`);
      }
    }
  }

  if (changed) {
    fs.writeFileSync(filePath, code, 'utf8');
  }
});

// 4. Update Cache-busting version in HTML files
const newVersion = '20261101_slot_p8_v1';
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
    console.log(`[Slot P8 Patch] Updated script version in ${path.basename(f)} to ${newVersion}`);
  }
});

// 5. Update Cache Name in Service Worker files
const newCacheName = 'sn777-v41';
const swFiles = [
  path.join(__dirname, 'sw.js'),
  path.join(__dirname, 'public/sw.js'),
  path.join(__dirname, 'dist/sw.js')
];

swFiles.forEach(f => {
  if (fs.existsSync(f)) {
    let content = fs.readFileSync(f, 'utf8');
    content = content.replace(/const CACHE_NAME = "sn777-v[0-9]+";/, `const CACHE_NAME = "${newCacheName}";`);
    if (f.endsWith('sw.js') && !content.includes(p8Icon)) {
      content = content.replace(/const CORE_ASSETS = \[/, `const CORE_ASSETS = [\n  "${p8Icon}",`);
    }
    fs.writeFileSync(f, content, 'utf8');
    console.log(`[Slot P8 Patch] Updated cache name in ${f} to ${newCacheName}`);
  }
});

console.log('[Slot P8 Patch] Completed successfully!');
