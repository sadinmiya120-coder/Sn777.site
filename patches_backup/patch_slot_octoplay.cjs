const fs = require('fs');
const path = require('path');

console.log('[Slot OCTOPLAY Patch] Starting comprehensive OCTOPLAY patch...');

const octoplayIcon = 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgo1h9lRhBewFgHhayx655309Lu0o85xR_7JI3jyiMlGjceVs2qC43BZRDaMPaIi_C7uAM7KOCQSPYkf6yb5bUXJpUwW0B3eqftgyXw285Pl3eEf7HXJUbtiDsnG9wxmUfjxooXR60QLoqDqV6F47TqIO6yR7Sm7nuMScbI9J5doPiT-ciL5aKH0rhFgIcP/s120/provider-awcv2_octoplay.png';

const octoplayProviderItem = `{title:"OCTOPLAY",image:"${octoplayIcon}",category:"স্লট",isHot:!1}`;

const octoplaySlotGames = [
  `{title:"Octoplay Fortune",image:"${octoplayIcon}",category:"OCTOPLAY",isHot:!1}`,
  `{title:"Octoplay Deluxe",image:"${octoplayIcon}",category:"OCTOPLAY",isHot:!1}`
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

  // 1. Ensure OCTOPLAY provider folder in category "স্লট"
  const octoplayRegex = /\{title:"OCTOPLAY",image:"[^"]+",category:"স্লট",isHot:[^}]+\}/;
  if (octoplayRegex.test(code)) {
    code = code.replace(octoplayRegex, octoplayProviderItem);
    changed = true;
    console.log(`[Slot OCTOPLAY Patch] Verified/Updated OCTOPLAY slot folder in ${path.basename(filePath)}`);
  } else {
    const nlcRegex = /\{title:"NLC",image:"[^"]+",category:"স্লট",isHot:[^}]+\}/;
    if (nlcRegex.test(code)) {
      code = code.replace(nlcRegex, (match) => `${match},${octoplayProviderItem}`);
      changed = true;
      console.log(`[Slot OCTOPLAY Patch] Added OCTOPLAY slot folder after NLC in ${path.basename(filePath)}`);
    } else {
      const netentRegex = /\{title:"NETENT",image:"[^"]+",category:"স্লট",isHot:[^}]+\}/;
      if (netentRegex.test(code)) {
        code = code.replace(netentRegex, (match) => `${match},${octoplayProviderItem}`);
        changed = true;
        console.log(`[Slot OCTOPLAY Patch] Added OCTOPLAY slot folder after NETENT in ${path.basename(filePath)}`);
      }
    }
  }

  // 2. Direct rules / folder click check for OCTOPLAY
  if (!code.includes('E==="OCTOPLAY"')) {
    if (code.includes('E==="NLC")')) {
      code = code.replace(/E==="NLC"\)/g, 'E==="NLC"||E==="OCTOPLAY")');
      changed = true;
      console.log(`[Slot OCTOPLAY Patch] Added OCTOPLAY to provider rules check after NLC in ${path.basename(filePath)}`);
    } else if (code.includes('E==="NETENT")')) {
      code = code.replace(/E==="NETENT"\)/g, 'E==="NETENT"||E==="OCTOPLAY")');
      changed = true;
      console.log(`[Slot OCTOPLAY Patch] Added OCTOPLAY to provider rules check after NETENT in ${path.basename(filePath)}`);
    }
  }

  // 3. Add OCTOPLAY games if not present
  if (!code.includes('category:"OCTOPLAY"')) {
    const nlcGameRegex = /\{title:"NLC Fortune"[^}]+\}/;
    if (nlcGameRegex.test(code)) {
      code = code.replace(nlcGameRegex, match => `${match},${octoplaySlotGames.join(',')}`);
      changed = true;
      console.log(`[Slot OCTOPLAY Patch] Added OCTOPLAY slot games after NLC in ${path.basename(filePath)}`);
    } else {
      const netentGameRegex = /\{title:"Netent Starburst"[^}]+\}/;
      if (netentGameRegex.test(code)) {
        code = code.replace(netentGameRegex, match => `${match},${octoplaySlotGames.join(',')}`);
        changed = true;
        console.log(`[Slot OCTOPLAY Patch] Added OCTOPLAY slot games after NETENT in ${path.basename(filePath)}`);
      }
    }
  }

  if (changed) {
    fs.writeFileSync(filePath, code, 'utf8');
  }
});

// 4. Update Cache-busting version in HTML files
const newVersion = '20261101_slot_octoplay_v1';
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
    console.log(`[Slot OCTOPLAY Patch] Updated script version in ${path.basename(f)} to ${newVersion}`);
  }
});

// 5. Update Cache Name in Service Worker files
const newCacheName = 'sn777-v40';
const swFiles = [
  path.join(__dirname, 'sw.js'),
  path.join(__dirname, 'public/sw.js'),
  path.join(__dirname, 'dist/sw.js')
];

swFiles.forEach(f => {
  if (fs.existsSync(f)) {
    let content = fs.readFileSync(f, 'utf8');
    content = content.replace(/const CACHE_NAME = "sn777-v[0-9]+";/, `const CACHE_NAME = "${newCacheName}";`);
    if (f.endsWith('sw.js') && !content.includes(octoplayIcon)) {
      content = content.replace(/const CORE_ASSETS = \[/, `const CORE_ASSETS = [\n  "${octoplayIcon}",`);
    }
    fs.writeFileSync(f, content, 'utf8');
    console.log(`[Slot OCTOPLAY Patch] Updated cache name in ${f} to ${newCacheName}`);
  }
});

console.log('[Slot OCTOPLAY Patch] Completed successfully!');
