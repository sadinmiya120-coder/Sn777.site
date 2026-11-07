const fs = require('fs');
const path = require('path');

console.log('[Slot PT Patch] Starting comprehensive PT patch...');

const ptIcon = 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEiMs1CUjKe7WpIM5lZzXCclAYgjzbluQqifbMwwstXMpS3dYfx1PAIyoDLxBjX9TCLU9ardDsBmd-fUWxMGYTUWD-ZAzWV3cYvNx7I8yIZuiXbpHx-_qHlSWMgrqWyx9iMyUVSEhlCXThyphenhyphenAXrdo3Xw3oc1AXsLtMUfpqFGfqp3edX6vskoPJS9t3E-kwtIB/s120/provider-awcv2_pt.png';

const ptProviderItem = `{title:"PT",image:"${ptIcon}",category:"স্লট",isHot:!1}`;

const ptSlotGames = [
  `{title:"PT Fortune",image:"${ptIcon}",category:"PT",isHot:!1}`,
  `{title:"PT Deluxe",image:"${ptIcon}",category:"PT",isHot:!1}`
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

  // 1. Ensure PT provider folder in category "স্লট"
  const ptSlotRegex = /\{title:"PT",image:"[^"]+",category:"স্লট",isHot:[^}]+\}/;
  if (ptSlotRegex.test(code)) {
    code = code.replace(ptSlotRegex, ptProviderItem);
    changed = true;
    console.log(`[Slot PT Patch] Verified/Updated PT slot folder in ${path.basename(filePath)}`);
  } else {
    const playstarRegex = /\{title:"PLAYSTAR",image:"[^"]+",category:"স্লট",isHot:[^}]+\}/;
    if (playstarRegex.test(code)) {
      code = code.replace(playstarRegex, (match) => `${match},${ptProviderItem}`);
      changed = true;
      console.log(`[Slot PT Patch] Added PT slot folder after PLAYSTAR in ${path.basename(filePath)}`);
    } else {
      const p8Regex = /\{title:"P8",image:"[^"]+",category:"স্লট",isHot:[^}]+\}/;
      if (p8Regex.test(code)) {
        code = code.replace(p8Regex, (match) => `${match},${ptProviderItem}`);
        changed = true;
        console.log(`[Slot PT Patch] Added PT slot folder after P8 in ${path.basename(filePath)}`);
      }
    }
  }

  // 2. Adjust direct rules / folder click check for PT
  // Remove PT from casino wr("PT") block if present so it doesn't short-circuit slot rules
  if (code.includes('||E==="PT")')) {
    code = code.replace(/\|\|E==="PT"\)/g, ')');
    changed = true;
  }
  if (code.includes('if(E==="PT"){wr("PT");return}')) {
    code = code.replace(/if\(E==="PT"\)\{wr\("PT"\);return\}/g, '');
    changed = true;
  }

  // Add PT to slot provider rules check
  if (!code.includes('E==="PLAYSTAR"||E==="PT"')) {
    if (code.includes('E==="PLAYSTAR")')) {
      code = code.replace(/E==="PLAYSTAR"\)/g, 'E==="PLAYSTAR"||E==="PT")');
      changed = true;
      console.log(`[Slot PT Patch] Added PT to provider rules check after PLAYSTAR in ${path.basename(filePath)}`);
    } else if (code.includes('E==="P8")')) {
      code = code.replace(/E==="P8"\)/g, 'E==="P8"||E==="PT")');
      changed = true;
      console.log(`[Slot PT Patch] Added PT to provider rules check after P8 in ${path.basename(filePath)}`);
    }
  }

  // 3. Add PT slot games if not present
  if (!code.includes('category:"PT",isHot:!1')) {
    const playstarGameRegex = /\{title:"Playstar Fortune"[^}]+\}/;
    if (playstarGameRegex.test(code)) {
      code = code.replace(playstarGameRegex, match => `${match},${ptSlotGames.join(',')}`);
      changed = true;
      console.log(`[Slot PT Patch] Added PT slot games after PLAYSTAR in ${path.basename(filePath)}`);
    } else {
      const p8GameRegex = /\{title:"P8 Fortune"[^}]+\}/;
      if (p8GameRegex.test(code)) {
        code = code.replace(p8GameRegex, match => `${match},${ptSlotGames.join(',')}`);
        changed = true;
        console.log(`[Slot PT Patch] Added PT slot games after P8 in ${path.basename(filePath)}`);
      }
    }
  }

  if (changed) {
    fs.writeFileSync(filePath, code, 'utf8');
  }
});

// 4. Update Cache-busting version in HTML files
const newVersion = '20261101_slot_pt_v1';
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
    console.log(`[Slot PT Patch] Updated script version in ${path.basename(f)} to ${newVersion}`);
  }
});

// 5. Update Cache Name in Service Worker files
const newCacheName = 'sn777-v43';
const swFiles = [
  path.join(__dirname, 'sw.js'),
  path.join(__dirname, 'public/sw.js'),
  path.join(__dirname, 'dist/sw.js')
];

swFiles.forEach(f => {
  if (fs.existsSync(f)) {
    let content = fs.readFileSync(f, 'utf8');
    content = content.replace(/const CACHE_NAME = "sn777-v[0-9]+";/, `const CACHE_NAME = "${newCacheName}";`);
    if (f.endsWith('sw.js') && !content.includes(ptIcon)) {
      content = content.replace(/const CORE_ASSETS = \[/, `const CORE_ASSETS = [\n  "${ptIcon}",`);
    }
    fs.writeFileSync(f, content, 'utf8');
    console.log(`[Slot PT Patch] Updated cache name in ${f} to ${newCacheName}`);
  }
});

console.log('[Slot PT Patch] Completed successfully!');
