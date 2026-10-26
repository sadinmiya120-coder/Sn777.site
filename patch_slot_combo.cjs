const fs = require('fs');
const path = require('path');

console.log('[COMBO Slot Patch] Starting execution...');

const comboIconUrl = 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjzL3Q0Ans_zuLxYZnEaJjkqKkWS3pANzbmQ6L7xgjMg7uD3yua0KejfultWCyC_CyFgGIVCffxSsn0_bxhEf9Jxg_pNfxUzJKTR5t4Gr3e55eMFgfnCe5oZbINbj1VfGwtALPtkK1VQMOAeMW4ur7mm8e2fOr2iRXmmbwhzJRVpkUtrjlhVk3XNNwvY8HC/s120/provider-awcv2_combo.png';

const comboSlotProviderItem = `{title:"COMBO",image:"${comboIconUrl}",category:"স্লট",isHot:!1}`;

const comboSlotGames = [
  `{title:"Combo Wild Gold",image:"https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhfWL1oXVK-cXPNStj4_NPXCW_KM0f64f8QAKSbr10PoR74XR8O_s50sKpTZ7Tsid_qkkFNHnl9aW9K2-Ncogso481X9XTTiCR8nd76nSL_oyL86BBvNsmmFBbim52HAPxKsNSs3aqcD1PPhmEDvPmrtm326-15qRoivyaydTKpMED6nlXuxh_Dvhx3WvNg/s120/lightIcon%20(9).webp",category:"COMBO",isHot:!0}`,
  `{title:"Super Combo Bonanza",image:"https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjTjrqbBrMwileUvFPyFyvMCkCjV-O8nkMbJyP_9hEAR40ILnjbUiBhFIAOwP2zBFR59pVwprRTpejwJaASfKqx8xWqzt2R-XknWjhYtGUz5MZAvYLB96Pp9b7AZ8qxX2iCo7bJasPA-stIDbQBk9_vbBvtD4N1urpud_SND-xuyIhSoTzyZIriVSJvpz6x/s256/images%20(22).jpeg",category:"COMBO",isHot:!0}`
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

  // 1. Add COMBO provider into category: "স্লট" after JDB / PG / PP
  const hasComboInSlot = code.includes('category:"স্লট"') && code.includes(`{title:"COMBO",image:"${comboIconUrl}",category:"স্লট"`);
  if (!hasComboInSlot) {
    const jdbRegex = /\{title:"JDB",image:"[^"]+",category:"স্লট",isHot:[^}]+\}/;
    if (jdbRegex.test(code)) {
      code = code.replace(jdbRegex, match => `${match},${comboSlotProviderItem}`);
      modified = true;
      console.log(`[COMBO Slot Patch] Added COMBO folder after JDB in ${path.basename(filePath)}`);
    } else {
      const pgRegex = /\{title:"PG",image:"[^"]+",category:"স্লট",isHot:[^}]+\}/;
      if (pgRegex.test(code)) {
        code = code.replace(pgRegex, match => `${match},${comboSlotProviderItem}`);
        modified = true;
        console.log(`[COMBO Slot Patch] Added COMBO folder after PG in ${path.basename(filePath)}`);
      }
    }
  }

  // 2. Add click handler for COMBO
  if (!code.includes('if(E==="COMBO"){wr("COMBO");return}')) {
    const jdbClick = 'if(E==="JDB"){wr("JDB");return}';
    const pgClick = 'if(E==="PG"){wr("PG");return}';
    if (code.includes(jdbClick)) {
      code = code.replace(jdbClick, `${jdbClick}if(E==="COMBO"){wr("COMBO");return}`);
      modified = true;
      console.log(`[COMBO Slot Patch] Added COMBO click handler after JDB in ${path.basename(filePath)}`);
    } else if (code.includes(pgClick)) {
      code = code.replace(pgClick, `${pgClick}if(E==="COMBO"){wr("COMBO");return}`);
      modified = true;
      console.log(`[COMBO Slot Patch] Added COMBO click handler after PG in ${path.basename(filePath)}`);
    }
  }

  // 3. Add COMBO games if not present
  if (!code.includes('category:"COMBO"')) {
    const aztecRegex = /\{title:"Aztec Gems"[^}]+\}/;
    if (aztecRegex.test(code)) {
      code = code.replace(aztecRegex, match => `${match},${comboSlotGames.join(',')}`);
      modified = true;
      console.log(`[COMBO Slot Patch] Added COMBO slot games in ${path.basename(filePath)}`);
    }
  }

  if (modified) {
    fs.writeFileSync(filePath, code, 'utf8');
    console.log(`[COMBO Slot Patch] Successfully updated ${path.basename(filePath)}`);
  }
});

// Update index.html files with new cache-busting timestamp
const newVersion = '20261023_slot_combo_v1';
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
    console.log(`[COMBO Slot Patch] Updated version in ${f} to ${newVersion}`);
  }
});

// Update sw.js files with new cache name to wipe old cache
const newCacheName = 'sn777-v15';
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
    console.log(`[COMBO Slot Patch] Updated cache name in ${f} to ${newCacheName}`);
  }
});

console.log('[COMBO Slot Patch] Completed successfully!');
