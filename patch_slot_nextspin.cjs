const fs = require('fs');
const path = require('path');

console.log('[NEXTSPIN Slot Patch] Starting execution...');

const nextspinIconUrl = 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjx8LPmZoSOWtq90T9NB2SDLY8JyNKU6VZ5UTFFM31LLNgvdtj4CoiSmFmZVgvgKfLKN3xX9IsMvbTDzxSo849swGxzDlJH6KNHY6Au-PnOSo1vIN3Uwx-mrFk3O2cFQG9-ecOt83RvzvC5r0k-43ZaE1nV5HW2TI9BggCb0cAxKj_IOuzOC3cCDYil2jPP/s120/provider-awcv2_nextspin.png';

const nextspinSlotProviderItem = `{title:"NEXTSPIN",image:"${nextspinIconUrl}",category:"স্লট",isHot:!1}`;

const nextspinSlotGames = [
  `{title:"Nextspin Wins",image:"https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhfWL1oXVK-cXPNStj4_NPXCW_KM0f64f8QAKSbr10PoR74XR8O_s50sKpTZ7Tsid_qkkFNHnl9aW9K2-Ncogso481X9XTTiCR8nd76nSL_oyL86BBvNsmmFBbim52HAPxKsNSs3aqcD1PPhmEDvPmrtm326-15qRoivyaydTKpMED6nlXuxh_Dvhx3WvNg/s120/lightIcon%20(9).webp",category:"NEXTSPIN",isHot:!0}`,
  `{title:"Nextspin Deluxe",image:"https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjTjrqbBrMwileUvFPyFyvMCkCjV-O8nkMbJyP_9hEAR40ILnjbUiBhFIAOwP2zBFR59pVwprRTpejwJaASfKqx8xWqzt2R-XknWjhYtGUz5MZAvYLB96Pp9b7AZ8qxX2iCo7bJasPA-stIDbQBk9_vbBvtD4N1urpud_SND-xuyIhSoTzyZIriVSJvpz6x/s256/images%20(22).jpeg",category:"NEXTSPIN",isHot:!0}`
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

  // 1. Add or update NEXTSPIN provider into category: "স্লট"
  const nextspinRegex = /\{title:"NEXTSPIN",image:"[^"]+",category:"স্লট",isHot:[^}]+\}/;
  if (nextspinRegex.test(code)) {
    code = code.replace(nextspinRegex, nextspinSlotProviderItem);
    modified = true;
    console.log(`[NEXTSPIN Slot Patch] Updated NEXTSPIN image URL in ${path.basename(filePath)}`);
  } else {
    const sgRegex = /\{title:"SG",image:"[^"]+",category:"স্লট",isHot:[^}]+\}/;
    if (sgRegex.test(code)) {
      code = code.replace(sgRegex, match => `${match},${nextspinSlotProviderItem}`);
      modified = true;
      console.log(`[NEXTSPIN Slot Patch] Added NEXTSPIN folder after SG in ${path.basename(filePath)}`);
    } else {
      const fastspinRegex = /\{title:"FASTSPIN",image:"[^"]+",category:"স্লট",isHot:[^}]+\}/;
      if (fastspinRegex.test(code)) {
        code = code.replace(fastspinRegex, match => `${match},${nextspinSlotProviderItem}`);
        modified = true;
        console.log(`[NEXTSPIN Slot Patch] Added NEXTSPIN folder after FASTSPIN in ${path.basename(filePath)}`);
      }
    }
  }

  // 2. Add direct rules check for NEXTSPIN in kc click handler
  if (!code.includes('E==="NEXTSPIN"')) {
    if (code.includes('if(E==="JILI"||E==="FC"||E==="PP"||E==="PP_SLOT"||E==="PG"||E==="JDB"||E==="COMBO"||E==="LETSGO"||E==="MONOPOLY"||E==="MG"||E==="YELLOWBAT"||E==="FASTSPIN"||E==="SG")')) {
      code = code.replace(
        'if(E==="JILI"||E==="FC"||E==="PP"||E==="PP_SLOT"||E==="PG"||E==="JDB"||E==="COMBO"||E==="LETSGO"||E==="MONOPOLY"||E==="MG"||E==="YELLOWBAT"||E==="FASTSPIN"||E==="SG")',
        'if(E==="JILI"||E==="FC"||E==="PP"||E==="PP_SLOT"||E==="PG"||E==="JDB"||E==="COMBO"||E==="LETSGO"||E==="MONOPOLY"||E==="MG"||E==="YELLOWBAT"||E==="FASTSPIN"||E==="SG"||E==="NEXTSPIN")'
      );
      modified = true;
      console.log(`[NEXTSPIN Slot Patch] Updated direct rules check for NEXTSPIN in ${path.basename(filePath)}`);
    } else if (code.includes('if(E==="SG"){wr("SG");return}')) {
      code = code.replace('if(E==="SG"){wr("SG");return}', 'if(E==="SG"){wr("SG");return}if(E==="NEXTSPIN"){wr("NEXTSPIN");return}');
      modified = true;
      console.log(`[NEXTSPIN Slot Patch] Added NEXTSPIN click handler after SG in ${path.basename(filePath)}`);
    }
  }

  // 3. Add NEXTSPIN games if not present
  if (!code.includes('category:"NEXTSPIN"')) {
    const aztecRegex = /\{title:"Aztec Gems"[^}]+\}/;
    if (aztecRegex.test(code)) {
      code = code.replace(aztecRegex, match => `${match},${nextspinSlotGames.join(',')}`);
      modified = true;
      console.log(`[NEXTSPIN Slot Patch] Added NEXTSPIN slot games in ${path.basename(filePath)}`);
    }
  }

  if (modified) {
    fs.writeFileSync(filePath, code, 'utf8');
    console.log(`[NEXTSPIN Slot Patch] Successfully updated ${path.basename(filePath)}`);
  }
});

// Update index.html files with new cache-busting timestamp
const newVersion = '20261023_slot_nextspin_v1';
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
    console.log(`[NEXTSPIN Slot Patch] Updated version in ${f} to ${newVersion}`);
  }
});

// Update sw.js files with new cache name to wipe old cache
const newCacheName = 'sn777-v24';
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
    console.log(`[NEXTSPIN Slot Patch] Updated cache name in ${f} to ${newCacheName}`);
  }
});

console.log('[NEXTSPIN Slot Patch] Completed successfully!');
