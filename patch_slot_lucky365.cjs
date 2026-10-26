const fs = require('fs');
const path = require('path');

console.log('[Lucky365 Slot Patch] Starting execution...');

const lucky365IconUrl = 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEh1rX1ojt-fiO5VlMfr0u5e0orr5I-kN7NsdBLKx7IATfIqv3CUiTN4k0ojCyHvphqn0MfpQ3YMtBAfega1Q8iQ3sKVwXksKKO7uPNre2u6SDwfRNEIv6qbUL-4kXlnRVyt8LN6qlmwINdU28dHitJbOECxCRbUW8XbIZHfGxio_R0mnfV3HQqcu53mEDC1/s120/provider-lucky365.png';

const lucky365SlotProviderItem = `{title:"LUCKY365",image:"${lucky365IconUrl}",category:"স্লট",isHot:!1}`;

const lucky365SlotGames = [
  `{title:"Lucky365 Gems",image:"https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhfWL1oXVK-cXPNStj4_NPXCW_KM0f64f8QAKSbr10PoR74XR8O_s50sKpTZ7Tsid_qkkFNHnl9aW9K2-Ncogso481X9XTTiCR8nd76nSL_oyL86BBvNsmmFBbim52HAPxKsNSs3aqcD1PPhmEDvPmrtm326-15qRoivyaydTKpMED6nlXuxh_Dvhx3WvNg/s120/lightIcon%20(9).webp",category:"LUCKY365",isHot:!0}`,
  `{title:"Lucky365 Fortune",image:"https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjTjrqbBrMwileUvFPyFyvMCkCjV-O8nkMbJyP_9hEAR40ILnjbUiBhFIAOwP2zBFR59pVwprRTpejwJaASfKqx8xWqzt2R-XknWjhYtGUz5MZAvYLB96Pp9b7AZ8qxX2iCo7bJasPA-stIDbQBk9_vbBvtD4N1urpud_SND-xuyIhSoTzyZIriVSJvpz6x/s256/images%20(22).jpeg",category:"LUCKY365",isHot:!0}`
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

  // 1. Add or update LUCKY365 provider into category: "স্লট"
  const lucky365Regex = /\{title:"LUCKY365",image:"[^"]+",category:"স্লট",isHot:[^}]+\}/;
  if (lucky365Regex.test(code)) {
    code = code.replace(lucky365Regex, lucky365SlotProviderItem);
    modified = true;
    console.log(`[Lucky365 Slot Patch] Updated LUCKY365 image URL in ${path.basename(filePath)}`);
  } else {
    const nextspinRegex = /\{title:"NEXTSPIN",image:"[^"]+",category:"স্লট",isHot:[^}]+\}/;
    if (nextspinRegex.test(code)) {
      code = code.replace(nextspinRegex, match => `${match},${lucky365SlotProviderItem}`);
      modified = true;
      console.log(`[Lucky365 Slot Patch] Added LUCKY365 folder after NEXTSPIN in ${path.basename(filePath)}`);
    } else {
      const sgRegex = /\{title:"SG",image:"[^"]+",category:"স্লট",isHot:[^}]+\}/;
      if (sgRegex.test(code)) {
        code = code.replace(sgRegex, match => `${match},${lucky365SlotProviderItem}`);
        modified = true;
        console.log(`[Lucky365 Slot Patch] Added LUCKY365 folder after SG in ${path.basename(filePath)}`);
      }
    }
  }

  // 2. Add direct rules check for LUCKY365 in kc click handler
  if (!code.includes('E==="LUCKY365"')) {
    if (code.includes('if(E==="JILI"||E==="FC"||E==="PP"||E==="PP_SLOT"||E==="PG"||E==="JDB"||E==="COMBO"||E==="LETSGO"||E==="MONOPOLY"||E==="MG"||E==="YELLOWBAT"||E==="FASTSPIN"||E==="SG"||E==="NEXTSPIN")')) {
      code = code.replace(
        'if(E==="JILI"||E==="FC"||E==="PP"||E==="PP_SLOT"||E==="PG"||E==="JDB"||E==="COMBO"||E==="LETSGO"||E==="MONOPOLY"||E==="MG"||E==="YELLOWBAT"||E==="FASTSPIN"||E==="SG"||E==="NEXTSPIN")',
        'if(E==="JILI"||E==="FC"||E==="PP"||E==="PP_SLOT"||E==="PG"||E==="JDB"||E==="COMBO"||E==="LETSGO"||E==="MONOPOLY"||E==="MG"||E==="YELLOWBAT"||E==="FASTSPIN"||E==="SG"||E==="NEXTSPIN"||E==="LUCKY365")'
      );
      modified = true;
      console.log(`[Lucky365 Slot Patch] Updated direct rules check for LUCKY365 in ${path.basename(filePath)}`);
    } else if (code.includes('if(E==="NEXTSPIN"){wr("NEXTSPIN");return}')) {
      code = code.replace('if(E==="NEXTSPIN"){wr("NEXTSPIN");return}', 'if(E==="NEXTSPIN"){wr("NEXTSPIN");return}if(E==="LUCKY365"){wr("LUCKY365");return}');
      modified = true;
      console.log(`[Lucky365 Slot Patch] Added LUCKY365 click handler after NEXTSPIN in ${path.basename(filePath)}`);
    }
  }

  // 3. Add LUCKY365 games if not present
  if (!code.includes('category:"LUCKY365"')) {
    const aztecRegex = /\{title:"Aztec Gems"[^}]+\}/;
    if (aztecRegex.test(code)) {
      code = code.replace(aztecRegex, match => `${match},${lucky365SlotGames.join(',')}`);
      modified = true;
      console.log(`[Lucky365 Slot Patch] Added LUCKY365 slot games in ${path.basename(filePath)}`);
    }
  }

  if (modified) {
    fs.writeFileSync(filePath, code, 'utf8');
    console.log(`[Lucky365 Slot Patch] Successfully updated ${path.basename(filePath)}`);
  }
});

// Update index.html files with new cache-busting timestamp
const newVersion = '20261023_slot_lucky365_v1';
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
    console.log(`[Lucky365 Slot Patch] Updated version in ${f} to ${newVersion}`);
  }
});

// Update sw.js files with new cache name to wipe old cache
const newCacheName = 'sn777-v25';
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
    console.log(`[Lucky365 Slot Patch] Updated cache name in ${f} to ${newCacheName}`);
  }
});

console.log('[Lucky365 Slot Patch] Completed successfully!');
