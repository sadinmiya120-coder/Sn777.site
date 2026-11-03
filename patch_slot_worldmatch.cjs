const fs = require('fs');
const path = require('path');

console.log('[Slot WORLDMATCH Patch] Starting comprehensive WORLDMATCH patch...');

const worldmatchIcon = 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhMMNtfez2ppvniLPXxxIuyAlW1I-f2CVVy2qjhQxExKzfpoERJZj_7QalmCfhesokbtumTaxt6GOBNe_Oe5GpLJAXeMTlGJ33rwtZikXOAPMFoevjfTiBET9RvUu1Xl-GefY2pGYI5u7B9kx6xKnyI4ToaWH2RAUvxeuwyou9xXu9x9CzXAGzMb-2sHXjB/s120/provider-worldmatch.png';

const worldmatchProviderItem = `{title:"WORLDMATCH",image:"${worldmatchIcon}",category:"স্লট",isHot:!1}`;

const worldmatchSlotGames = [
  `{title:"Worldmatch Fortune",image:"${worldmatchIcon}",category:"WORLDMATCH",isHot:!1}`,
  `{title:"Worldmatch Deluxe",image:"${worldmatchIcon}",category:"WORLDMATCH",isHot:!1}`
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

  // 1. Ensure WORLDMATCH provider folder in category "স্লট"
  const wmRegex = /\{title:"WORLDMATCH",image:"[^"]+",category:"স্লট",isHot:[^}]+\}/;
  if (wmRegex.test(code)) {
    code = code.replace(wmRegex, worldmatchProviderItem);
    changed = true;
    console.log(`[Slot WORLDMATCH Patch] Verified/Updated WORLDMATCH slot folder in ${path.basename(filePath)}`);
  } else {
    const mahaRegex = /\{title:"MAHA",image:"[^"]+",category:"স্লট",isHot:[^}]+\}/;
    if (mahaRegex.test(code)) {
      code = code.replace(mahaRegex, (match) => `${match},${worldmatchProviderItem}`);
      changed = true;
      console.log(`[Slot WORLDMATCH Patch] Added WORLDMATCH slot folder after MAHA in ${path.basename(filePath)}`);
    } else {
      const kaRegex = /\{title:"KA",image:"[^"]+",category:"স্লট",isHot:[^}]+\}/;
      if (kaRegex.test(code)) {
        code = code.replace(kaRegex, (match) => `${match},${worldmatchProviderItem}`);
        changed = true;
        console.log(`[Slot WORLDMATCH Patch] Added WORLDMATCH slot folder after KA in ${path.basename(filePath)}`);
      }
    }
  }

  // 2. Direct rules / folder click check for WORLDMATCH
  if (!code.includes('E==="WORLDMATCH"')) {
    if (code.includes('E==="MAHA")')) {
      code = code.replace(/E==="MAHA"\)/g, 'E==="MAHA"||E==="WORLDMATCH")');
      changed = true;
      console.log(`[Slot WORLDMATCH Patch] Added WORLDMATCH to provider rules check after MAHA in ${path.basename(filePath)}`);
    } else if (code.includes('E==="KA")')) {
      code = code.replace(/E==="KA"\)/g, 'E==="KA"||E==="WORLDMATCH")');
      changed = true;
      console.log(`[Slot WORLDMATCH Patch] Added WORLDMATCH to provider rules check after KA in ${path.basename(filePath)}`);
    }
  }

  // 3. Add WORLDMATCH games if not present
  if (!code.includes('category:"WORLDMATCH"')) {
    const mahaGameRegex = /\{title:"MAHA Fortune"[^}]+\}/;
    if (mahaGameRegex.test(code)) {
      code = code.replace(mahaGameRegex, match => `${match},${worldmatchSlotGames.join(',')}`);
      changed = true;
      console.log(`[Slot WORLDMATCH Patch] Added WORLDMATCH slot games after MAHA in ${path.basename(filePath)}`);
    } else {
      const kaGameRegex = /\{title:"KA Fortune"[^}]+\}/;
      if (kaGameRegex.test(code)) {
        code = code.replace(kaGameRegex, match => `${match},${worldmatchSlotGames.join(',')}`);
        changed = true;
        console.log(`[Slot WORLDMATCH Patch] Added WORLDMATCH slot games after KA in ${path.basename(filePath)}`);
      }
    }
  }

  if (changed) {
    fs.writeFileSync(filePath, code, 'utf8');
  }
});

// 4. Update Cache-busting version in HTML files
const newVersion = '20261101_slot_worldmatch_v1';
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
    console.log(`[Slot WORLDMATCH Patch] Updated script version in ${path.basename(f)} to ${newVersion}`);
  }
});

// 5. Update Cache Name in Service Worker files
const newCacheName = 'sn777-v53';
const swFiles = [
  path.join(__dirname, 'sw.js'),
  path.join(__dirname, 'public/sw.js'),
  path.join(__dirname, 'dist/sw.js')
];

swFiles.forEach(f => {
  if (fs.existsSync(f)) {
    let content = fs.readFileSync(f, 'utf8');
    content = content.replace(/const CACHE_NAME = "sn777-v[0-9]+";/, `const CACHE_NAME = "${newCacheName}";`);
    if (f.endsWith('sw.js') && !content.includes(worldmatchIcon)) {
      content = content.replace(/const CORE_ASSETS = \[/, `const CORE_ASSETS = [\n  "${worldmatchIcon}",`);
    }
    fs.writeFileSync(f, content, 'utf8');
    console.log(`[Slot WORLDMATCH Patch] Updated cache name in ${f} to ${newCacheName}`);
  }
});

console.log('[Slot WORLDMATCH Patch] Completed successfully!');
