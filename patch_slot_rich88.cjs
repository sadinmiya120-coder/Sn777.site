const fs = require('fs');
const path = require('path');

console.log('[RICH88 Slot Patch] Starting execution...');

const rich88IconUrl = 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjRj-Ik-8njhgHmMc4TWl1mOhyBMu5rCF1qOKFMTpUcIhOEVPdS9RMIM7Hpc5ltHWKJJZuS5IgYQPfQEcb59ZFoT2c3Yka1V9NHTNcKMYcIX_psvSFm_M7M3Uly3nhqQMPYUMOuBAycr0kbFBWJk59yswh0ZiZBPfwrkuaoyZV5Svpv7p9WAl6CGuFICyWi/s360/provider-rich88.png';

const rich88SlotProviderItem = `{title:"RICH88",image:"${rich88IconUrl}",category:"স্লট",isHot:!1}`;

const rich88SlotGames = [
  `{title:"Rich88 Fortune",image:"https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhfWL1oXVK-cXPNStj4_NPXCW_KM0f64f8QAKSbr10PoR74XR8O_s50sKpTZ7Tsid_qkkFNHnl9aW9K2-Ncogso481X9XTTiCR8nd76nSL_oyL86BBvNsmmFBbim52HAPxKsNSs3aqcD1PPhmEDvPmrtm326-15qRoivyaydTKpMED6nlXuxh_Dvhx3WvNg/s120/lightIcon%20(9).webp",category:"RICH88",isHot:!0}`,
  `{title:"Rich88 Deluxe",image:"https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjTjrqbBrMwileUvFPyFyvMCkCjV-O8nkMbJyP_9hEAR40ILnjbUiBhFIAOwP2zBFR59pVwprRTpejwJaASfKqx8xWqzt2R-XknWjhYtGUz5MZAvYLB96Pp9b7AZ8qxX2iCo7bJasPA-stIDbQBk9_vbBvtD4N1urpud_SND-xuyIhSoTzyZIriVSJvpz6x/s256/images%20(22).jpeg",category:"RICH88",isHot:!0}`
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

  // 1. Add or update RICH88 provider into category: "স্লট"
  const rich88Regex = /\{title:"RICH88",image:"[^"]+",category:"স্লট",isHot:[^}]+\}/;
  if (rich88Regex.test(code)) {
    code = code.replace(rich88Regex, rich88SlotProviderItem);
    modified = true;
    console.log(`[RICH88 Slot Patch] Updated RICH88 image URL in ${path.basename(filePath)}`);
  } else {
    const fivegRegex = /\{title:"FIVEG",image:"[^"]+",category:"স্লট",isHot:[^}]+\}/;
    if (fivegRegex.test(code)) {
      code = code.replace(fivegRegex, match => `${match},${rich88SlotProviderItem}`);
      modified = true;
      console.log(`[RICH88 Slot Patch] Added RICH88 folder after FIVEG in ${path.basename(filePath)}`);
    } else {
      const lucky365Regex = /\{title:"LUCKY365",image:"[^"]+",category:"স্লট",isHot:[^}]+\}/;
      if (lucky365Regex.test(code)) {
        code = code.replace(lucky365Regex, match => `${match},${rich88SlotProviderItem}`);
        modified = true;
        console.log(`[RICH88 Slot Patch] Added RICH88 folder after LUCKY365 in ${path.basename(filePath)}`);
      }
    }
  }

  // 2. Add direct rules check for RICH88 in kc click handler
  if (!code.includes('E==="RICH88"')) {
    // Look for the last known provider list in the if statement
    const providerListRegex = /if\(E==="JILI"\|\|E==="FC"\|\|E==="PP"\|\|E==="PP_SLOT"\|\|E==="PG"\|\|E==="JDB"\|\|E==="COMBO"\|\|E==="LETSGO"\|\|E==="MONOPOLY"\|\|E==="MG"\|\|E==="YELLOWBAT"\|\|E==="FASTSPIN"\|\|E==="SG"\|\|E==="NEXTSPIN"\|\|E==="LUCKY365"\|\|E==="FIVEG"\)/;
    if (providerListRegex.test(code)) {
      code = code.replace(
        providerListRegex,
        'if(E==="JILI"||E==="FC"||E==="PP"||E==="PP_SLOT"||E==="PG"||E==="JDB"||E==="COMBO"||E==="LETSGO"||E==="MONOPOLY"||E==="MG"||E==="YELLOWBAT"||E==="FASTSPIN"||E==="SG"||E==="NEXTSPIN"||E==="LUCKY365"||E==="FIVEG"||E==="RICH88")'
      );
      modified = true;
      console.log(`[RICH88 Slot Patch] Updated direct rules check for RICH88 in ${path.basename(filePath)}`);
    } else if (code.includes('if(E==="FIVEG"){wr("FIVEG");return}')) {
      code = code.replace('if(E==="FIVEG"){wr("FIVEG");return}', 'if(E==="FIVEG"){wr("FIVEG");return}if(E==="RICH88"){wr("RICH88");return}');
      modified = true;
      console.log(`[RICH88 Slot Patch] Added RICH88 click handler after FIVEG in ${path.basename(filePath)}`);
    }
  }

  // 3. Add RICH88 games if not present
  if (!code.includes('category:"RICH88"')) {
    const aztecRegex = /\{title:"Aztec Gems"[^}]+\}/;
    if (aztecRegex.test(code)) {
      code = code.replace(aztecRegex, match => `${match},${rich88SlotGames.join(',')}`);
      modified = true;
      console.log(`[RICH88 Slot Patch] Added RICH88 slot games in ${path.basename(filePath)}`);
    }
  }

  if (modified) {
    fs.writeFileSync(filePath, code, 'utf8');
    console.log(`[RICH88 Slot Patch] Successfully updated ${path.basename(filePath)}`);
  }
});

// Update index.html files with new cache-busting timestamp
const newVersion = '20261023_slot_rich88_v1';
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
    console.log(`[RICH88 Slot Patch] Updated version in ${f} to ${newVersion}`);
  }
});

// Update sw.js files with new cache name to wipe old cache
const newCacheName = 'sn777-v27';
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
    console.log(`[RICH88 Slot Patch] Updated cache name in ${f} to ${newCacheName}`);
  }
});

console.log('[RICH88 Slot Patch] Completed successfully!');
