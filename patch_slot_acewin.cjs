const fs = require('fs');
const path = require('path');

console.log('[Slot ACEWIN Patch] Starting comprehensive ACEWIN patch...');

const acewinIcon = 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEh8h1_ZgD-76Wz-5H7dPb7Gdw8zrVDOkEeVRAjRu4ojjNX4Ae3hubCvDGPD512Np1GJKmTHQbExJ27keaoPlRBSbZjHfLV9FWaCTF6m6RobnThZMFm6lDkksG64xKK8VffSCfac7wSNrs9N8V2gkLBdy5rWSFAGi-3WLSR5M8zva3UHqcArqJ0AmXQposJV/s120/provider-awcv2_acewin%20(1).png';

const acewinProviderItem = `{title:"ACEWIN",image:"${acewinIcon}",category:"স্লট",isHot:!1}`;

const acewinSlotGames = [
  `{title:"Acewin Fortune",image:"${acewinIcon}",category:"ACEWIN",isHot:!0}`,
  `{title:"Acewin Deluxe",image:"${acewinIcon}",category:"ACEWIN",isHot:!1}`
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

  // 1. Ensure ACEWIN provider folder in category "স্লট"
  const acewinRegex = /\{title:"ACEWIN",image:"[^"]+",category:"স্লট",isHot:[^}]+\}/;
  if (acewinRegex.test(code)) {
    code = code.replace(acewinRegex, acewinProviderItem);
    changed = true;
    console.log(`[Slot ACEWIN Patch] Verified/Updated ACEWIN slot folder in ${path.basename(filePath)}`);
  } else {
    const rich88Regex = /\{title:"RICH88",image:"[^"]+",category:"স্লট",isHot:[^}]+\}/;
    if (rich88Regex.test(code)) {
      code = code.replace(rich88Regex, (match) => `${match},${acewinProviderItem}`);
      changed = true;
      console.log(`[Slot ACEWIN Patch] Added ACEWIN slot folder after RICH88 in ${path.basename(filePath)}`);
    } else {
      const fivegRegex = /\{title:"FIVEG",image:"[^"]+",category:"স্লট",isHot:[^}]+\}/;
      if (fivegRegex.test(code)) {
        code = code.replace(fivegRegex, (match) => `${match},${acewinProviderItem}`);
        changed = true;
        console.log(`[Slot ACEWIN Patch] Added ACEWIN slot folder after FIVEG in ${path.basename(filePath)}`);
      }
    }
  }

  // 2. Direct rules / folder click check for ACEWIN
  if (!code.includes('E==="ACEWIN"') && code.includes('E==="RICH88")')) {
    code = code.replace(/E==="RICH88"\)/g, 'E==="RICH88"||E==="ACEWIN")');
    changed = true;
    console.log(`[Slot ACEWIN Patch] Added ACEWIN to provider rules check in ${path.basename(filePath)}`);
  }

  // 3. Add ACEWIN games if not present
  if (!code.includes('category:"ACEWIN"')) {
    const rich88GameRegex = /\{title:"Rich88 Fortune"[^}]+\}/;
    if (rich88GameRegex.test(code)) {
      code = code.replace(rich88GameRegex, match => `${match},${acewinSlotGames.join(',')}`);
      changed = true;
      console.log(`[Slot ACEWIN Patch] Added ACEWIN slot games after Rich88 in ${path.basename(filePath)}`);
    } else {
      const aztecRegex = /\{title:"Aztec Gems"[^}]+\}/;
      if (aztecRegex.test(code)) {
        code = code.replace(aztecRegex, match => `${match},${acewinSlotGames.join(',')}`);
        changed = true;
        console.log(`[Slot ACEWIN Patch] Added ACEWIN slot games after Aztec in ${path.basename(filePath)}`);
      }
    }
  }

  if (changed) {
    fs.writeFileSync(filePath, code, 'utf8');
  }
});

// 4. Update Cache-busting version in HTML files
const newVersion = '20261030_slot_acewin_v3';
const htmlFiles = [
  path.join(__dirname, 'index.html'),
  path.join(__dirname, 'dist/index.html'),
  path.join(__dirname, 'dist_backup/index.html')
];

htmlFiles.forEach(f => {
  if (fs.existsSync(f)) {
    let content = fs.readFileSync(f, 'utf8');
    content = content.replace(/index-sn777-v12\.js\?v=[a-zA-Z0-9_-]+/g, `index-sn777-v12.js?v=${newVersion}`);
    fs.writeFileSync(f, content, 'utf8');
    console.log(`[Slot ACEWIN Patch] Updated script version in ${path.basename(f)} to ${newVersion}`);
  }
});

// 5. Update Cache Name in Service Worker files to invalidate previous cache
const newCacheName = 'sn777-v29';
const swFiles = [
  path.join(__dirname, 'sw.js'),
  path.join(__dirname, 'public/sw.js'),
  path.join(__dirname, 'dist/sw.js')
];

swFiles.forEach(f => {
  if (fs.existsSync(f)) {
    let content = fs.readFileSync(f, 'utf8');
    content = content.replace(/const CACHE_NAME = "sn777-v[0-9]+";/, `const CACHE_NAME = "${newCacheName}";`);
    if (f.endsWith('sw.js') && !content.includes(acewinIcon)) {
      content = content.replace(/const CORE_ASSETS = \[/, `const CORE_ASSETS = [\n  "${acewinIcon}",`);
    }
    fs.writeFileSync(f, content, 'utf8');
    console.log(`[Slot ACEWIN Patch] Updated cache name in ${f} to ${newCacheName}`);
  }
});

console.log('[Slot ACEWIN Patch] Completed successfully!');
