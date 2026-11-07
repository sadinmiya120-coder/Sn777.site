const fs = require('fs');
const path = require('path');

console.log('[Slot MAHA Patch] Starting comprehensive MAHA patch...');

const mahaIcon = 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhLJTIGCWvaayYU1G1WV7JcagKSQhHXhq-4c1L8fKWzwX1oSC-Iehx3cZGJi9AnjHvPTjyuGSZ4qMLI1DTV7LmxISHwRHzrOpbShINyCvuMvvQu_lPSaPlYMq9XRXAM7-DC4Ci_-TzMOdGAufxx1iPH7OkS4pGZLIuKKma30ge8xDqyrbnPcjzkgxtDODDQ/s360/provider-maha.png';

const mahaProviderItem = `{title:"MAHA",image:"${mahaIcon}",category:"স্লট",isHot:!1}`;

const mahaSlotGames = [
  `{title:"MAHA Fortune",image:"${mahaIcon}",category:"MAHA",isHot:!1}`,
  `{title:"MAHA Deluxe",image:"${mahaIcon}",category:"MAHA",isHot:!1}`
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

  // 1. Ensure MAHA provider folder in category "স্লট"
  const mahaRegex = /\{title:"MAHA",image:"[^"]+",category:"স্লট",isHot:[^}]+\}/;
  if (mahaRegex.test(code)) {
    code = code.replace(mahaRegex, mahaProviderItem);
    changed = true;
    console.log(`[Slot MAHA Patch] Verified/Updated MAHA slot folder in ${path.basename(filePath)}`);
  } else {
    const kaRegex = /\{title:"KA",image:"[^"]+",category:"স্লট",isHot:[^}]+\}/;
    if (kaRegex.test(code)) {
      code = code.replace(kaRegex, (match) => `${match},${mahaProviderItem}`);
      changed = true;
      console.log(`[Slot MAHA Patch] Added MAHA slot folder after KA in ${path.basename(filePath)}`);
    } else {
      const jokerRegex = /\{title:"JOKER",image:"[^"]+",category:"স্লট",isHot:[^}]+\}/;
      if (jokerRegex.test(code)) {
        code = code.replace(jokerRegex, (match) => `${match},${mahaProviderItem}`);
        changed = true;
        console.log(`[Slot MAHA Patch] Added MAHA slot folder after JOKER in ${path.basename(filePath)}`);
      }
    }
  }

  // 2. Direct rules / folder click check for MAHA
  if (!code.includes('E==="MAHA"')) {
    if (code.includes('E==="KA")')) {
      code = code.replace(/E==="KA"\)/g, 'E==="KA"||E==="MAHA")');
      changed = true;
      console.log(`[Slot MAHA Patch] Added MAHA to provider rules check after KA in ${path.basename(filePath)}`);
    } else if (code.includes('E==="JOKER")')) {
      code = code.replace(/E==="JOKER"\)/g, 'E==="JOKER"||E==="MAHA")');
      changed = true;
      console.log(`[Slot MAHA Patch] Added MAHA to provider rules check after JOKER in ${path.basename(filePath)}`);
    }
  }

  // 3. Add MAHA games if not present
  if (!code.includes('category:"MAHA"')) {
    const kaGameRegex = /\{title:"KA Fortune"[^}]+\}/;
    if (kaGameRegex.test(code)) {
      code = code.replace(kaGameRegex, match => `${match},${mahaSlotGames.join(',')}`);
      changed = true;
      console.log(`[Slot MAHA Patch] Added MAHA slot games after KA in ${path.basename(filePath)}`);
    } else {
      const jokerGameRegex = /\{title:"Joker Fortune"[^}]+\}/;
      if (jokerGameRegex.test(code)) {
        code = code.replace(jokerGameRegex, match => `${match},${mahaSlotGames.join(',')}`);
        changed = true;
        console.log(`[Slot MAHA Patch] Added MAHA slot games after JOKER in ${path.basename(filePath)}`);
      }
    }
  }

  if (changed) {
    fs.writeFileSync(filePath, code, 'utf8');
  }
});

// 4. Update Cache-busting version in HTML files
const newVersion = '20261101_slot_maha_v1';
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
    console.log(`[Slot MAHA Patch] Updated script version in ${path.basename(f)} to ${newVersion}`);
  }
});

// 5. Update Cache Name in Service Worker files
const newCacheName = 'sn777-v52';
const swFiles = [
  path.join(__dirname, 'sw.js'),
  path.join(__dirname, 'public/sw.js'),
  path.join(__dirname, 'dist/sw.js')
];

swFiles.forEach(f => {
  if (fs.existsSync(f)) {
    let content = fs.readFileSync(f, 'utf8');
    content = content.replace(/const CACHE_NAME = "sn777-v[0-9]+";/, `const CACHE_NAME = "${newCacheName}";`);
    if (f.endsWith('sw.js') && !content.includes(mahaIcon)) {
      content = content.replace(/const CORE_ASSETS = \[/, `const CORE_ASSETS = [\n  "${mahaIcon}",`);
    }
    fs.writeFileSync(f, content, 'utf8');
    console.log(`[Slot MAHA Patch] Updated cache name in ${f} to ${newCacheName}`);
  }
});

console.log('[Slot MAHA Patch] Completed successfully!');
