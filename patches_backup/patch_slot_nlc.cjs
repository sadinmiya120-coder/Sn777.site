const fs = require('fs');
const path = require('path');

console.log('[Slot NLC Patch] Starting comprehensive NLC patch...');

const nlcIcon = 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhCx7Cnp3NHuLwnOAlQdmBWuznvHo6oOA_-XN6vil6HxOlmqDMszmkLVVjgajecmOImb0aEtFuafzrAnCrR7akPnY0ri4_PMgpNfYNokq3RzCMXK7NA7s0_i67kaSqYrstiHsnNtScB9Ki-aaDgKqQbnl7EyWxfLvRGFCCyy0shUcr88vCNENkup8aeVlKA/s120/provider-awcv2_nlc.png';

const nlcProviderItem = `{title:"NLC",image:"${nlcIcon}",category:"স্লট",isHot:!1}`;

const nlcSlotGames = [
  `{title:"NLC Fortune",image:"${nlcIcon}",category:"NLC",isHot:!1}`,
  `{title:"NLC Deluxe",image:"${nlcIcon}",category:"NLC",isHot:!1}`
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

  // 1. Ensure NLC provider folder in category "স্লট"
  const nlcRegex = /\{title:"NLC",image:"[^"]+",category:"স্লট",isHot:[^}]+\}/;
  if (nlcRegex.test(code)) {
    code = code.replace(nlcRegex, nlcProviderItem);
    changed = true;
    console.log(`[Slot NLC Patch] Verified/Updated NLC slot folder in ${path.basename(filePath)}`);
  } else {
    const netentRegex = /\{title:"NETENT",image:"[^"]+",category:"স্লট",isHot:[^}]+\}/;
    if (netentRegex.test(code)) {
      code = code.replace(netentRegex, (match) => `${match},${nlcProviderItem}`);
      changed = true;
      console.log(`[Slot NLC Patch] Added NLC slot folder after NETENT in ${path.basename(filePath)}`);
    } else {
      const mimiRegex = /\{title:"MIMI",image:"[^"]+",category:"স্লট",isHot:[^}]+\}/;
      if (mimiRegex.test(code)) {
        code = code.replace(mimiRegex, (match) => `${match},${nlcProviderItem}`);
        changed = true;
        console.log(`[Slot NLC Patch] Added NLC slot folder after MIMI in ${path.basename(filePath)}`);
      }
    }
  }

  // 2. Direct rules / folder click check for NLC
  if (!code.includes('E==="NLC"')) {
    if (code.includes('E==="NETENT")')) {
      code = code.replace(/E==="NETENT"\)/g, 'E==="NETENT"||E==="NLC")');
      changed = true;
      console.log(`[Slot NLC Patch] Added NLC to provider rules check after NETENT in ${path.basename(filePath)}`);
    } else if (code.includes('E==="MIMI")')) {
      code = code.replace(/E==="MIMI"\)/g, 'E==="MIMI"||E==="NLC")');
      changed = true;
      console.log(`[Slot NLC Patch] Added NLC to provider rules check after MIMI in ${path.basename(filePath)}`);
    }
  }

  // 3. Add NLC games if not present
  if (!code.includes('category:"NLC"')) {
    const netentGameRegex = /\{title:"Netent Starburst"[^}]+\}/;
    if (netentGameRegex.test(code)) {
      code = code.replace(netentGameRegex, match => `${match},${nlcSlotGames.join(',')}`);
      changed = true;
      console.log(`[Slot NLC Patch] Added NLC slot games after NETENT in ${path.basename(filePath)}`);
    } else {
      const mimiGameRegex = /\{title:"Mimi Fortune"[^}]+\}/;
      if (mimiGameRegex.test(code)) {
        code = code.replace(mimiGameRegex, match => `${match},${nlcSlotGames.join(',')}`);
        changed = true;
        console.log(`[Slot NLC Patch] Added NLC slot games after MIMI in ${path.basename(filePath)}`);
      }
    }
  }

  if (changed) {
    fs.writeFileSync(filePath, code, 'utf8');
  }
});

// 4. Update Cache-busting version in HTML files
const newVersion = '20261101_slot_nlc_v1';
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
    console.log(`[Slot NLC Patch] Updated script version in ${path.basename(f)} to ${newVersion}`);
  }
});

// 5. Update Cache Name in Service Worker files
const newCacheName = 'sn777-v39';
const swFiles = [
  path.join(__dirname, 'sw.js'),
  path.join(__dirname, 'public/sw.js'),
  path.join(__dirname, 'dist/sw.js')
];

swFiles.forEach(f => {
  if (fs.existsSync(f)) {
    let content = fs.readFileSync(f, 'utf8');
    content = content.replace(/const CACHE_NAME = "sn777-v[0-9]+";/, `const CACHE_NAME = "${newCacheName}";`);
    if (f.endsWith('sw.js') && !content.includes(nlcIcon)) {
      content = content.replace(/const CORE_ASSETS = \[/, `const CORE_ASSETS = [\n  "${nlcIcon}",`);
    }
    fs.writeFileSync(f, content, 'utf8');
    console.log(`[Slot NLC Patch] Updated cache name in ${f} to ${newCacheName}`);
  }
});

console.log('[Slot NLC Patch] Completed successfully!');
