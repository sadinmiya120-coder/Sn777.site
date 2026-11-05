const fs = require('fs');
const path = require('path');

console.log('[Slot KM Patch] Starting comprehensive KM patch...');

const kmIcon = 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEg_oPxX2eHhdTGk7cZIiZ0HTDxPGBqKH5tZNTFr00jK4wfObGJhqP99kwSA2dHmhQEZMlDLqicSWlEPnf4hhGREVOHlbuMfgwsq_6U_Vf0_jak5Ktf8QHiK3muq6j-un0t4NCSyzWHp2kXaaurzm6Q-ehhqqpQuCoxLBNFoqBt4Hbk72OuzByTHTeYioOae/s120/provider-awcv2_kingmaker.png';

const kmProviderItem = `{title:"KM",image:"${kmIcon}",category:"স্লট",isHot:!1}`;

const kmSlotGames = [
  `{title:"Kingmaker Fortune",image:"${kmIcon}",category:"KM",isHot:!1}`,
  `{title:"Kingmaker Deluxe",image:"${kmIcon}",category:"KM",isHot:!1}`
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

  // 1. Ensure KM provider folder in category "স্লট"
  const kmRegex = /\{title:"KM",image:"[^"]+",category:"স্লট",isHot:[^}]+\}/;
  if (kmRegex.test(code)) {
    code = code.replace(kmRegex, kmProviderItem);
    changed = true;
    console.log(`[Slot KM Patch] Verified/Updated KM slot folder in ${path.basename(filePath)}`);
  } else {
    const hacksawRegex = /\{title:"HACKSAW",image:"[^"]+",category:"স্লট",isHot:[^}]+\}/;
    if (hacksawRegex.test(code)) {
      code = code.replace(hacksawRegex, (match) => `${match},${kmProviderItem}`);
      changed = true;
      console.log(`[Slot KM Patch] Added KM slot folder after HACKSAW in ${path.basename(filePath)}`);
    } else {
      const gtfRegex = /\{title:"GTF",image:"[^"]+",category:"স্লট",isHot:[^}]+\}/;
      if (gtfRegex.test(code)) {
        code = code.replace(gtfRegex, (match) => `${match},${kmProviderItem}`);
        changed = true;
        console.log(`[Slot KM Patch] Added KM slot folder after GTF in ${path.basename(filePath)}`);
      }
    }
  }

  // 2. Direct rules / folder click check for KM
  if (!code.includes('E==="KM"')) {
    if (code.includes('E==="HACKSAW")')) {
      code = code.replace(/E==="HACKSAW"\)/g, 'E==="HACKSAW"||E==="KM")');
      changed = true;
      console.log(`[Slot KM Patch] Added KM to provider rules check after HACKSAW in ${path.basename(filePath)}`);
    } else if (code.includes('E==="GTF")')) {
      code = code.replace(/E==="GTF"\)/g, 'E==="GTF"||E==="KM")');
      changed = true;
      console.log(`[Slot KM Patch] Added KM to provider rules check after GTF in ${path.basename(filePath)}`);
    }
  }

  // 3. Add KM games if not present
  if (!code.includes('category:"KM"')) {
    const hacksawGameRegex = /\]+\}/;
    if (hacksawGameRegex.test(code)) {
      code = code.replace(hacksawGameRegex, match => `${match},${kmSlotGames.join(',')}`);
      changed = true;
      console.log(`[Slot KM Patch] Added KM slot games after HACKSAW in ${path.basename(filePath)}`);
    } else {
      const gtfGameRegex = /\{title:"GTF Fortune"[^}]+\}/;
      if (gtfGameRegex.test(code)) {
        code = code.replace(gtfGameRegex, match => `${match},${kmSlotGames.join(',')}`);
        changed = true;
        console.log(`[Slot KM Patch] Added KM slot games after GTF in ${path.basename(filePath)}`);
      }
    }
  }

  if (changed) {
    fs.writeFileSync(filePath, code, 'utf8');
  }
});

// 4. Update Cache-busting version in HTML files
const newVersion = '20261101_slot_km_v1';
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
    console.log(`[Slot KM Patch] Updated script version in ${path.basename(f)} to ${newVersion}`);
  }
});

// 5. Update Cache Name in Service Worker files
const newCacheName = 'sn777-v35';
const swFiles = [
  path.join(__dirname, 'sw.js'),
  path.join(__dirname, 'public/sw.js'),
  path.join(__dirname, 'dist/sw.js')
];

swFiles.forEach(f => {
  if (fs.existsSync(f)) {
    let content = fs.readFileSync(f, 'utf8');
    content = content.replace(/const CACHE_NAME = "sn777-v[0-9]+";/, `const CACHE_NAME = "${newCacheName}";`);
    if (f.endsWith('sw.js') && !content.includes(kmIcon)) {
      content = content.replace(/const CORE_ASSETS = \[/, `const CORE_ASSETS = [\n  "${kmIcon}",`);
    }
    fs.writeFileSync(f, content, 'utf8');
    console.log(`[Slot KM Patch] Updated cache name in ${f} to ${newCacheName}`);
  }
});

console.log('[Slot KM Patch] Completed successfully!');
