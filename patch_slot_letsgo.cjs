const fs = require('fs');
const path = require('path');

console.log('[LETSGO Slot Patch] Starting execution...');

const letsgoIconUrl = 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhKcF7-7SDl-459vpzdIByX8-xavLRul8CFFdjMR50Rj487IVnvxaMq3bFjvcDZQXQ5bHbZwpfcGQmPfGJdcm9QnqTnPcOkktgWUVrlNK4Yz9tYkW9fqzMjyN8l6ucnz6etDjflgsbiKsuCJ_3qXXELXtmbtAzSf8odlGDVL_54SPY3JLQRjto_xmOm8kIt/s120/provider-awcv2_letsgo.png';

const letsgoSlotProviderItem = `{title:"LETSGO",image:"${letsgoIconUrl}",category:"স্লট",isHot:!1}`;

const letsgoSlotGames = [
  `{title:"LetsGo Wild",image:"https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhfWL1oXVK-cXPNStj4_NPXCW_KM0f64f8QAKSbr10PoR74XR8O_s50sKpTZ7Tsid_qkkFNHnl9aW9K2-Ncogso481X9XTTiCR8nd76nSL_oyL86BBvNsmmFBbim52HAPxKsNSs3aqcD1PPhmEDvPmrtm326-15qRoivyaydTKpMED6nlXuxh_Dvhx3WvNg/s120/lightIcon%20(9).webp",category:"LETSGO",isHot:!0}`,
  `{title:"LetsGo Party",image:"https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjTjrqbBrMwileUvFPyFyvMCkCjV-O8nkMbJyP_9hEAR40ILnjbUiBhFIAOwP2zBFR59pVwprRTpejwJaASfKqx8xWqzt2R-XknWjhYtGUz5MZAvYLB96Pp9b7AZ8qxX2iCo7bJasPA-stIDbQBk9_vbBvtD4N1urpud_SND-xuyIhSoTzyZIriVSJvpz6x/s256/images%20(22).jpeg",category:"LETSGO",isHot:!0}`
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

  // 1. Add or update LETSGO provider into category: "স্লট"
  const letsgoRegex = /\{title:"LETSGO",image:"[^"]+",category:"স্লট",isHot:[^}]+\}/;
  if (letsgoRegex.test(code)) {
    code = code.replace(letsgoRegex, letsgoSlotProviderItem);
    modified = true;
    console.log(`[LETSGO Slot Patch] Updated LETSGO image URL in ${path.basename(filePath)}`);
  } else {
    const comboRegex = /\{title:"COMBO",image:"[^"]+",category:"স্লট",isHot:[^}]+\}/;
    if (comboRegex.test(code)) {
      code = code.replace(comboRegex, match => `${match},${letsgoSlotProviderItem}`);
      modified = true;
      console.log(`[LETSGO Slot Patch] Added LETSGO folder after COMBO in ${path.basename(filePath)}`);
    } else {
      const jdbRegex = /\{title:"JDB",image:"[^"]+",category:"স্লট",isHot:[^}]+\}/;
      if (jdbRegex.test(code)) {
        code = code.replace(jdbRegex, match => `${match},${letsgoSlotProviderItem}`);
        modified = true;
        console.log(`[LETSGO Slot Patch] Added LETSGO folder after JDB in ${path.basename(filePath)}`);
      }
    }
  }

  // 2. Add click handler for LETSGO to show rules directly
  if (!code.includes('if(E==="LETSGO")')) {
    const comboClick = 'if(E==="COMBO"){wr("COMBO");return}';
    const jdbClick = 'if(E==="JDB"){wr("JDB");return}';
    const targetCheck = `if(E==="JILI"||E==="FC"||E==="PP"||E==="PP_SLOT"||E==="PG"||E==="JDB"||E==="COMBO"||E==="LETSGO")`;
    
    if (code.includes('if(E==="JILI"||E==="FC"||E==="PP"||E==="PP_SLOT"||E==="PG"||E==="JDB"||E==="COMBO")')) {
      code = code.replace(
        'if(E==="JILI"||E==="FC"||E==="PP"||E==="PP_SLOT"||E==="PG"||E==="JDB"||E==="COMBO")',
        'if(E==="JILI"||E==="FC"||E==="PP"||E==="PP_SLOT"||E==="PG"||E==="JDB"||E==="COMBO"||E==="LETSGO")'
      );
      modified = true;
      console.log(`[LETSGO Slot Patch] Updated direct rules check for LETSGO in ${path.basename(filePath)}`);
    } else if (code.includes(comboClick)) {
      code = code.replace(comboClick, `${comboClick}if(E==="LETSGO"){wr("LETSGO");return}`);
      modified = true;
      console.log(`[LETSGO Slot Patch] Added LETSGO click handler after COMBO in ${path.basename(filePath)}`);
    }
  }

  // 3. Add LETSGO games if not present
  if (!code.includes('category:"LETSGO"')) {
    const aztecRegex = /\{title:"Aztec Gems"[^}]+\}/;
    if (aztecRegex.test(code)) {
      code = code.replace(aztecRegex, match => `${match},${letsgoSlotGames.join(',')}`);
      modified = true;
      console.log(`[LETSGO Slot Patch] Added LETSGO slot games in ${path.basename(filePath)}`);
    }
  }

  if (modified) {
    fs.writeFileSync(filePath, code, 'utf8');
    console.log(`[LETSGO Slot Patch] Successfully updated ${path.basename(filePath)}`);
  }
});

// Update index.html files with new cache-busting timestamp
const newVersion = '20261023_slot_letsgo_v2';
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
    console.log(`[LETSGO Slot Patch] Updated version in ${f} to ${newVersion}`);
  }
});

// Update sw.js files with new cache name to wipe old cache
const newCacheName = 'sn777-v18';
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
    console.log(`[LETSGO Slot Patch] Updated cache name in ${f} to ${newCacheName}`);
  }
});

console.log('[LETSGO Slot Patch] Completed successfully!');
