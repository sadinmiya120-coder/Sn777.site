const fs = require('fs');
const path = require('path');

console.log('[FIVEG Slot Patch] Starting execution...');

const fivegIconUrl = 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgdm7mNH10HgaiM37TsuHVuqsl5SD_pLn9it1xgP0995CuAUuDCR7g_nGtgtttyeUpgE85KNs3sbh46-g5xd4RCZvZToX5Hf5C1boyTBh7_H0fPLdIhIHdJWVGNDBlC9kdbatnB6bEmYBA9iA1Xm4iI4cJrv6R5X-Bar3mHswtonYqE9xp66i10a29yoT4y/s120/provider-awcv2_fiveg.png';

const fivegSlotProviderItem = `{title:"FIVEG",image:"${fivegIconUrl}",category:"স্লট",isHot:!1}`;

const fivegSlotGames = [
  `{title:"FiveG Wins",image:"https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhfWL1oXVK-cXPNStj4_NPXCW_KM0f64f8QAKSbr10PoR74XR8O_s50sKpTZ7Tsid_qkkFNHnl9aW9K2-Ncogso481X9XTTiCR8nd76nSL_oyL86BBvNsmmFBbim52HAPxKsNSs3aqcD1PPhmEDvPmrtm326-15qRoivyaydTKpMED6nlXuxh_Dvhx3WvNg/s120/lightIcon%20(9).webp",category:"FIVEG",isHot:!0}`,
  `{title:"FiveG Deluxe",image:"https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjTjrqbBrMwileUvFPyFyvMCkCjV-O8nkMbJyP_9hEAR40ILnjbUiBhFIAOwP2zBFR59pVwprRTpejwJaASfKqx8xWqzt2R-XknWjhYtGUz5MZAvYLB96Pp9b7AZ8qxX2iCo7bJasPA-stIDbQBk9_vbBvtD4N1urpud_SND-xuyIhSoTzyZIriVSJvpz6x/s256/images%20(22).jpeg",category:"FIVEG",isHot:!0}`
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

  // 1. Add or update FIVEG provider into category: "স্লট"
  const fivegRegex = /\{title:"FIVEG",image:"[^"]+",category:"স্লট",isHot:[^}]+\}/;
  if (fivegRegex.test(code)) {
    code = code.replace(fivegRegex, fivegSlotProviderItem);
    modified = true;
    console.log(`[FIVEG Slot Patch] Updated FIVEG image URL in ${path.basename(filePath)}`);
  } else {
    const lucky365Regex = /\{title:"LUCKY365",image:"[^"]+",category:"স্লট",isHot:[^}]+\}/;
    if (lucky365Regex.test(code)) {
      code = code.replace(lucky365Regex, match => `${match},${fivegSlotProviderItem}`);
      modified = true;
      console.log(`[FIVEG Slot Patch] Added FIVEG folder after LUCKY365 in ${path.basename(filePath)}`);
    } else {
      const nextspinRegex = /\{title:"NEXTSPIN",image:"[^"]+",category:"স্লট",isHot:[^}]+\}/;
      if (nextspinRegex.test(code)) {
        code = code.replace(nextspinRegex, match => `${match},${fivegSlotProviderItem}`);
        modified = true;
        console.log(`[FIVEG Slot Patch] Added FIVEG folder after NEXTSPIN in ${path.basename(filePath)}`);
      }
    }
  }

  // 2. Add direct rules check for FIVEG in kc click handler
  if (!code.includes('E==="FIVEG"')) {
    if (code.includes('if(E==="JILI"||E==="FC"||E==="PP"||E==="PP_SLOT"||E==="PG"||E==="JDB"||E==="COMBO"||E==="LETSGO"||E==="MONOPOLY"||E==="MG"||E==="YELLOWBAT"||E==="FASTSPIN"||E==="SG"||E==="NEXTSPIN"||E==="LUCKY365")')) {
      code = code.replace(
        'if(E==="JILI"||E==="FC"||E==="PP"||E==="PP_SLOT"||E==="PG"||E==="JDB"||E==="COMBO"||E==="LETSGO"||E==="MONOPOLY"||E==="MG"||E==="YELLOWBAT"||E==="FASTSPIN"||E==="SG"||E==="NEXTSPIN"||E==="LUCKY365")',
        'if(E==="JILI"||E==="FC"||E==="PP"||E==="PP_SLOT"||E==="PG"||E==="JDB"||E==="COMBO"||E==="LETSGO"||E==="MONOPOLY"||E==="MG"||E==="YELLOWBAT"||E==="FASTSPIN"||E==="SG"||E==="NEXTSPIN"||E==="LUCKY365"||E==="FIVEG")'
      );
      modified = true;
      console.log(`[FIVEG Slot Patch] Updated direct rules check for FIVEG in ${path.basename(filePath)}`);
    } else if (code.includes('if(E==="LUCKY365"){wr("LUCKY365");return}')) {
      code = code.replace('if(E==="LUCKY365"){wr("LUCKY365");return}', 'if(E==="LUCKY365"){wr("LUCKY365");return}if(E==="FIVEG"){wr("FIVEG");return}');
      modified = true;
      console.log(`[FIVEG Slot Patch] Added FIVEG click handler after LUCKY365 in ${path.basename(filePath)}`);
    }
  }

  // 3. Add FIVEG games if not present
  if (!code.includes('category:"FIVEG"')) {
    const aztecRegex = /\{title:"Aztec Gems"[^}]+\}/;
    if (aztecRegex.test(code)) {
      code = code.replace(aztecRegex, match => `${match},${fivegSlotGames.join(',')}`);
      modified = true;
      console.log(`[FIVEG Slot Patch] Added FIVEG slot games in ${path.basename(filePath)}`);
    }
  }

  if (modified) {
    fs.writeFileSync(filePath, code, 'utf8');
    console.log(`[FIVEG Slot Patch] Successfully updated ${path.basename(filePath)}`);
  }
});

// Update index.html files with new cache-busting timestamp
const newVersion = '20261023_slot_fiveg_v1';
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
    console.log(`[FIVEG Slot Patch] Updated version in ${f} to ${newVersion}`);
  }
});

// Update sw.js files with new cache name to wipe old cache
const newCacheName = 'sn777-v26';
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
    console.log(`[FIVEG Slot Patch] Updated cache name in ${f} to ${newCacheName}`);
  }
});

console.log('[FIVEG Slot Patch] Completed successfully!');
