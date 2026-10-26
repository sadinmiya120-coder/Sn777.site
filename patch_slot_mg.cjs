const fs = require('fs');
const path = require('path');

console.log('[MG Slot Patch] Starting execution...');

const mgIconUrl = 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEguqiwXsxMKY6vfS4jXtoMc7PRBmKO_uVp-BKvqCsqjcrIy1qM1rwNr-iUxKUgtNL4Acy9izQj8VB8GhDXE38gEMrirtHERyAsxFsqL7LFmj73R9g-O8sPnU5Ci5pdfog1bL6R4FG6MZK1BrloeO3i_3cIaOFhP-i8uWJly18shcxFUFauRC1fbTFFoUsDX/s120/provider-mg.png';

const mgSlotProviderItem = `{title:"MG",image:"${mgIconUrl}",category:"স্লট",isHot:!1}`;

const mgSlotGames = [
  `{title:"Mega Moolah",image:"https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhfWL1oXVK-cXPNStj4_NPXCW_KM0f64f8QAKSbr10PoR74XR8O_s50sKpTZ7Tsid_qkkFNHnl9aW9K2-Ncogso481X9XTTiCR8nd76nSL_oyL86BBvNsmmFBbim52HAPxKsNSs3aqcD1PPhmEDvPmrtm326-15qRoivyaydTKpMED6nlXuxh_Dvhx3WvNg/s120/lightIcon%20(9).webp",category:"MG",isHot:!0}`,
  `{title:"Immortal Romance",image:"https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjTjrqbBrMwileUvFPyFyvMCkCjV-O8nkMbJyP_9hEAR40ILnjbUiBhFIAOwP2zBFR59pVwprRTpejwJaASfKqx8xWqzt2R-XknWjhYtGUz5MZAvYLB96Pp9b7AZ8qxX2iCo7bJasPA-stIDbQBk9_vbBvtD4N1urpud_SND-xuyIhSoTzyZIriVSJvpz6x/s256/images%20(22).jpeg",category:"MG",isHot:!0}`
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

  // 1. Add or update MG provider into category: "স্লট"
  const mgRegex = /\{title:"MG",image:"[^"]+",category:"স্লট",isHot:[^}]+\}/;
  if (mgRegex.test(code)) {
    code = code.replace(mgRegex, mgSlotProviderItem);
    modified = true;
    console.log(`[MG Slot Patch] Updated MG image URL in ${path.basename(filePath)}`);
  } else {
    const monopolyRegex = /\{title:"MONOPOLY",image:"[^"]+",category:"স্লট",isHot:[^}]+\}/;
    if (monopolyRegex.test(code)) {
      code = code.replace(monopolyRegex, match => `${match},${mgSlotProviderItem}`);
      modified = true;
      console.log(`[MG Slot Patch] Added MG folder after MONOPOLY in ${path.basename(filePath)}`);
    } else {
      const letsgoRegex = /\{title:"LETSGO",image:"[^"]+",category:"স্লট",isHot:[^}]+\}/;
      if (letsgoRegex.test(code)) {
        code = code.replace(letsgoRegex, match => `${match},${mgSlotProviderItem}`);
        modified = true;
        console.log(`[MG Slot Patch] Added MG folder after LETSGO in ${path.basename(filePath)}`);
      }
    }
  }

  // 2. Add direct rules check for MG in kc click handler
  if (!code.includes('E==="MG"')) {
    if (code.includes('if(E==="JILI"||E==="FC"||E==="PP"||E==="PP_SLOT"||E==="PG"||E==="JDB"||E==="COMBO"||E==="LETSGO"||E==="MONOPOLY")')) {
      code = code.replace(
        'if(E==="JILI"||E==="FC"||E==="PP"||E==="PP_SLOT"||E==="PG"||E==="JDB"||E==="COMBO"||E==="LETSGO"||E==="MONOPOLY")',
        'if(E==="JILI"||E==="FC"||E==="PP"||E==="PP_SLOT"||E==="PG"||E==="JDB"||E==="COMBO"||E==="LETSGO"||E==="MONOPOLY"||E==="MG")'
      );
      modified = true;
      console.log(`[MG Slot Patch] Updated direct rules check for MG in ${path.basename(filePath)}`);
    } else if (code.includes('if(E==="MONOPOLY"){wr("MONOPOLY");return}')) {
      code = code.replace('if(E==="MONOPOLY"){wr("MONOPOLY");return}', 'if(E==="MONOPOLY"){wr("MONOPOLY");return}if(E==="MG"){wr("MG");return}');
      modified = true;
      console.log(`[MG Slot Patch] Added MG click handler after MONOPOLY in ${path.basename(filePath)}`);
    }
  }

  // 3. Add MG games if not present
  if (!code.includes('category:"MG"')) {
    const aztecRegex = /\{title:"Aztec Gems"[^}]+\}/;
    if (aztecRegex.test(code)) {
      code = code.replace(aztecRegex, match => `${match},${mgSlotGames.join(',')}`);
      modified = true;
      console.log(`[MG Slot Patch] Added MG slot games in ${path.basename(filePath)}`);
    }
  }

  if (modified) {
    fs.writeFileSync(filePath, code, 'utf8');
    console.log(`[MG Slot Patch] Successfully updated ${path.basename(filePath)}`);
  }
});

// Update index.html files with new cache-busting timestamp
const newVersion = '20261023_slot_mg_v1';
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
    console.log(`[MG Slot Patch] Updated version in ${f} to ${newVersion}`);
  }
});

// Update sw.js files with new cache name to wipe old cache
const newCacheName = 'sn777-v20';
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
    console.log(`[MG Slot Patch] Updated cache name in ${f} to ${newCacheName}`);
  }
});

console.log('[MG Slot Patch] Completed successfully!');
