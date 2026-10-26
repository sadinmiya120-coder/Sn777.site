const fs = require('fs');
const path = require('path');

console.log('[JDB Slot Patch] Starting execution...');

const jdbIconUrl = 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEht1EH5nfdmUETFfsQZtVSkBY9dqYQVssawVLxOycbkeUJ9C3tZZpP8cvq-aUNVT5YDp4a6ifCkZO-Xzmlo7R6Lbegx2UkmaOaydWAhczc_XzAfwFEuRqJXTYQe5VcEioolf_sjd90sjLmmLVydOoAc5-zt3bG4k4_FgRb2VArx6a4zfFVaT17aou1bzcl1/s120/provider-awcv2_jdb.png';

const jdbSlotProviderItem = `{title:"JDB",image:"${jdbIconUrl}",category:"স্লট",isHot:!1}`;

const jdbSlotGames = [
  `{title:"JDB Slot 1",image:"https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhfWL1oXVK-cXPNStj4_NPXCW_KM0f64f8QAKSbr10PoR74XR8O_s50sKpTZ7Tsid_qkkFNHnl9aW9K2-Ncogso481X9XTTiCR8nd76nSL_oyL86BBvNsmmFBbim52HAPxKsNSs3aqcD1PPhmEDvPmrtm326-15qRoivyaydTKpMED6nlXuxh_Dvhx3WvNg/s120/lightIcon%20(9).webp",category:"JDB",isHot:!0}`,
  `{title:"JDB Slot 2",image:"https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjTjrqbBrMwileUvFPyFyvMCkCjV-O8nkMbJyP_9hEAR40ILnjbUiBhFIAOwP2zBFR59pVwprRTpejwJaASfKqx8xWqzt2R-XknWjhYtGUz5MZAvYLB96Pp9b7AZ8qxX2iCo7bJasPA-stIDbQBk9_vbBvtD4N1urpud_SND-xuyIhSoTzyZIriVSJvpz6x/s256/images%20(22).jpeg",category:"JDB",isHot:!0}`
];

const jsTargets = [
  path.join(__dirname, 'dist/assets/index-sn777-v12.js'),
  path.join(__dirname, 'dist_backup/assets/index-sn777-v12.js'),
  path.join(__dirname, 'original-index-sn777-v5.js')
];

jsTargets.forEach(filePath => {
  if (!fs.existsSync(filePath)) return;
  let code = fs.readFileSync(filePath, 'utf8');
  let modified = false;

  // 1. Add JDB provider into category: "স্লট" after PG
  const hasJdbInSlot = code.includes('category:"স্লট"') && code.includes(`{title:"JDB",image:"${jdbIconUrl}",category:"স্লট"`);
  if (!hasJdbInSlot) {
    const pgRegex = /\{title:"PG",image:"[^"]+",category:"স্লট",isHot:[^}]+\}/;
    if (pgRegex.test(code)) {
      code = code.replace(pgRegex, match => `${match},${jdbSlotProviderItem}`);
      modified = true;
      console.log(`[JDB Slot Patch] Added JDB folder after PG in ${path.basename(filePath)}`);
    } else {
      const ppRegex = /\{title:"PP",image:"[^"]+",category:"স্লট",isHot:[^}]+\}/;
      if (ppRegex.test(code)) {
        code = code.replace(ppRegex, match => `${match},${jdbSlotProviderItem}`);
        modified = true;
        console.log(`[JDB Slot Patch] Added JDB folder after PP in ${path.basename(filePath)}`);
      }
    }
  }

  // 2. Add click handler for JDB
  if (!code.includes('if(E==="JDB"){wr("JDB");return}')) {
    const pgClick = 'if(E==="PG"){wr("PG");return}';
    if (code.includes(pgClick)) {
      code = code.replace(pgClick, `${pgClick}if(E==="JDB"){wr("JDB");return}`);
      modified = true;
      console.log(`[JDB Slot Patch] Added JDB click handler in ${path.basename(filePath)}`);
    }
  }

  // 3. Add JDB games if not present
  if (!code.includes('category:"JDB"')) {
    const aztecRegex = /\{title:"Aztec Gems"[^}]+\}/;
    if (aztecRegex.test(code)) {
      code = code.replace(aztecRegex, match => `${match},${jdbSlotGames.join(',')}`);
      modified = true;
      console.log(`[JDB Slot Patch] Added JDB slot games in ${path.basename(filePath)}`);
    }
  }

  if (modified) {
    fs.writeFileSync(filePath, code, 'utf8');
    console.log(`[JDB Slot Patch] Successfully updated ${path.basename(filePath)}`);
  }
});

// Update index.html files with new cache-busting timestamp
const newVersion = '20261023_slot_jdb_v1';
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
    console.log(`[JDB Slot Patch] Updated version in ${f} to ${newVersion}`);
  }
});

// Update sw.js files with new cache name to wipe old cache
const newCacheName = 'sn777-v14';
const swFiles = [
  path.join(__dirname, 'sw.js'),
  path.join(__dirname, 'public/sw.js'),
  path.join(__dirname, 'dist/sw.js')
];

swFiles.forEach(f => {
  if (fs.existsSync(f)) {
    let content = fs.readFileSync(f, 'utf8');
    content = content.replace(/const CACHE_NAME = "sn777-v[0-9]+";/, `const CACHE_NAME = "${newCacheName}";`);
    fs.writeFileSync(f, content, 'utf8');
    console.log(`[JDB Slot Patch] Updated cache name in ${f} to ${newCacheName}`);
  }
});

console.log('[JDB Slot Patch] Completed successfully!');
