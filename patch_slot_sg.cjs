const fs = require('fs');
const path = require('path');

console.log('[SG Slot Patch] Starting execution...');

const sgIconUrl = 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgutvqbnH6d04KkdHZQ5MhYNkODuJjpAPZ_Q0pCHhExeu0L_7wrp-ZtP36_APbMXNLtfs_fg47EpJo7n2dihMqZ9cUC2KS3Q1jXY2HaOKfnaf0aEBKavknLSY-gRogiiiQSzwdUxWTYRNRHNfpnssPlMGSiy60GAs5XQ39IL-rVUn-Yf6BG1BZnossC2ZqX/s120/provider-awcv2_spade.png';

const sgSlotProviderItem = `{title:"SG",image:"${sgIconUrl}",category:"স্লট",isHot:!1}`;

const sgSlotGames = [
  `{title:"Spade Fortune",image:"https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhfWL1oXVK-cXPNStj4_NPXCW_KM0f64f8QAKSbr10PoR74XR8O_s50sKpTZ7Tsid_qkkFNHnl9aW9K2-Ncogso481X9XTTiCR8nd76nSL_oyL86BBvNsmmFBbim52HAPxKsNSs3aqcD1PPhmEDvPmrtm326-15qRoivyaydTKpMED6nlXuxh_Dvhx3WvNg/s120/lightIcon%20(9).webp",category:"SG",isHot:!0}`,
  `{title:"Spade Treasures",image:"https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjTjrqbBrMwileUvFPyFyvMCkCjV-O8nkMbJyP_9hEAR40ILnjbUiBhFIAOwP2zBFR59pVwprRTpejwJaASfKqx8xWqzt2R-XknWjhYtGUz5MZAvYLB96Pp9b7AZ8qxX2iCo7bJasPA-stIDbQBk9_vbBvtD4N1urpud_SND-xuyIhSoTzyZIriVSJvpz6x/s256/images%20(22).jpeg",category:"SG",isHot:!0}`
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

  // 1. Add or update SG provider into category: "স্লট"
  const sgRegex = /\{title:"SG",image:"[^"]+",category:"স্লট",isHot:[^}]+\}/;
  if (sgRegex.test(code)) {
    code = code.replace(sgRegex, sgSlotProviderItem);
    modified = true;
    console.log(`[SG Slot Patch] Updated SG image URL in ${path.basename(filePath)}`);
  } else {
    const fastspinRegex = /\{title:"FASTSPIN",image:"[^"]+",category:"স্লট",isHot:[^}]+\}/;
    if (fastspinRegex.test(code)) {
      code = code.replace(fastspinRegex, match => `${match},${sgSlotProviderItem}`);
      modified = true;
      console.log(`[SG Slot Patch] Added SG folder after FASTSPIN in ${path.basename(filePath)}`);
    } else {
      const yellowbatRegex = /\{title:"YELLOWBAT",image:"[^"]+",category:"স্লট",isHot:[^}]+\}/;
      if (yellowbatRegex.test(code)) {
        code = code.replace(yellowbatRegex, match => `${match},${sgSlotProviderItem}`);
        modified = true;
        console.log(`[SG Slot Patch] Added SG folder after YELLOWBAT in ${path.basename(filePath)}`);
      }
    }
  }

  // 2. Add direct rules check for SG in kc click handler
  if (!code.includes('E==="SG"')) {
    if (code.includes('if(E==="JILI"||E==="FC"||E==="PP"||E==="PP_SLOT"||E==="PG"||E==="JDB"||E==="COMBO"||E==="LETSGO"||E==="MONOPOLY"||E==="MG"||E==="YELLOWBAT"||E==="FASTSPIN")')) {
      code = code.replace(
        'if(E==="JILI"||E==="FC"||E==="PP"||E==="PP_SLOT"||E==="PG"||E==="JDB"||E==="COMBO"||E==="LETSGO"||E==="MONOPOLY"||E==="MG"||E==="YELLOWBAT"||E==="FASTSPIN")',
        'if(E==="JILI"||E==="FC"||E==="PP"||E==="PP_SLOT"||E==="PG"||E==="JDB"||E==="COMBO"||E==="LETSGO"||E==="MONOPOLY"||E==="MG"||E==="YELLOWBAT"||E==="FASTSPIN"||E==="SG")'
      );
      modified = true;
      console.log(`[SG Slot Patch] Updated direct rules check for SG in ${path.basename(filePath)}`);
    } else if (code.includes('if(E==="FASTSPIN"){wr("FASTSPIN");return}')) {
      code = code.replace('if(E==="FASTSPIN"){wr("FASTSPIN");return}', 'if(E==="FASTSPIN"){wr("FASTSPIN");return}if(E==="SG"){wr("SG");return}');
      modified = true;
      console.log(`[SG Slot Patch] Added SG click handler after FASTSPIN in ${path.basename(filePath)}`);
    }
  }

  // 3. Add SG games if not present
  if (!code.includes('category:"SG"')) {
    const aztecRegex = /\{title:"Aztec Gems"[^}]+\}/;
    if (aztecRegex.test(code)) {
      code = code.replace(aztecRegex, match => `${match},${sgSlotGames.join(',')}`);
      modified = true;
      console.log(`[SG Slot Patch] Added SG slot games in ${path.basename(filePath)}`);
    }
  }

  if (modified) {
    fs.writeFileSync(filePath, code, 'utf8');
    console.log(`[SG Slot Patch] Successfully updated ${path.basename(filePath)}`);
  }
});

// Update index.html files with new cache-busting timestamp
const newVersion = '20261023_slot_sg_v1';
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
    console.log(`[SG Slot Patch] Updated version in ${f} to ${newVersion}`);
  }
});

// Update sw.js files with new cache name to wipe old cache
const newCacheName = 'sn777-v23';
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
    console.log(`[SG Slot Patch] Updated cache name in ${f} to ${newCacheName}`);
  }
});

console.log('[SG Slot Patch] Completed successfully!');
