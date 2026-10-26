const fs = require('fs');
const path = require('path');

console.log('[FASTSPIN Slot Patch] Starting execution...');

const fastspinIconUrl = 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEg_LNzZUzupuxSxgVJW6RmVC0Bk4aCk7YHfHTAr9AJ0T6-GZ0AOYuAI3DYfaxwygVxC1kkVnqxmBwCl-Qe0mXu9Fj95AkEZ_yH1_g-yyc3fUvsbhEa08kpsdgs-kwWhMvUE6bYzBc6bP1QiL34Aozgegv69FTfG6d7ionIu47u7w79oETqbh_Ehr80uDCoa/s120/provider-awcv2_fastspin.png';

const fastspinSlotProviderItem = `{title:"FASTSPIN",image:"${fastspinIconUrl}",category:"স্লট",isHot:!1}`;

const fastspinSlotGames = [
  `{title:"Fastspin Treasures",image:"https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhfWL1oXVK-cXPNStj4_NPXCW_KM0f64f8QAKSbr10PoR74XR8O_s50sKpTZ7Tsid_qkkFNHnl9aW9K2-Ncogso481X9XTTiCR8nd76nSL_oyL86BBvNsmmFBbim52HAPxKsNSs3aqcD1PPhmEDvPmrtm326-15qRoivyaydTKpMED6nlXuxh_Dvhx3WvNg/s120/lightIcon%20(9).webp",category:"FASTSPIN",isHot:!0}`,
  `{title:"Fastspin Gold",image:"https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjTjrqbBrMwileUvFPyFyvMCkCjV-O8nkMbJyP_9hEAR40ILnjbUiBhFIAOwP2zBFR59pVwprRTpejwJaASfKqx8xWqzt2R-XknWjhYtGUz5MZAvYLB96Pp9b7AZ8qxX2iCo7bJasPA-stIDbQBk9_vbBvtD4N1urpud_SND-xuyIhSoTzyZIriVSJvpz6x/s256/images%20(22).jpeg",category:"FASTSPIN",isHot:!0}`
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

  // 1. Add or update FASTSPIN provider into category: "স্লট"
  const fastspinRegex = /\{title:"FASTSPIN",image:"[^"]+",category:"স্লট",isHot:[^}]+\}/;
  if (fastspinRegex.test(code)) {
    code = code.replace(fastspinRegex, fastspinSlotProviderItem);
    modified = true;
    console.log(`[FASTSPIN Slot Patch] Updated FASTSPIN image URL in ${path.basename(filePath)}`);
  } else {
    const yellowbatRegex = /\{title:"YELLOWBAT",image:"[^"]+",category:"স্লট",isHot:[^}]+\}/;
    if (yellowbatRegex.test(code)) {
      code = code.replace(yellowbatRegex, match => `${match},${fastspinSlotProviderItem}`);
      modified = true;
      console.log(`[FASTSPIN Slot Patch] Added FASTSPIN folder after YELLOWBAT in ${path.basename(filePath)}`);
    } else {
      const mgRegex = /\{title:"MG",image:"[^"]+",category:"স্লট",isHot:[^}]+\}/;
      if (mgRegex.test(code)) {
        code = code.replace(mgRegex, match => `${match},${fastspinSlotProviderItem}`);
        modified = true;
        console.log(`[FASTSPIN Slot Patch] Added FASTSPIN folder after MG in ${path.basename(filePath)}`);
      }
    }
  }

  // 2. Add direct rules check for FASTSPIN in kc click handler
  if (!code.includes('E==="FASTSPIN"')) {
    if (code.includes('if(E==="JILI"||E==="FC"||E==="PP"||E==="PP_SLOT"||E==="PG"||E==="JDB"||E==="COMBO"||E==="LETSGO"||E==="MONOPOLY"||E==="MG"||E==="YELLOWBAT")')) {
      code = code.replace(
        'if(E==="JILI"||E==="FC"||E==="PP"||E==="PP_SLOT"||E==="PG"||E==="JDB"||E==="COMBO"||E==="LETSGO"||E==="MONOPOLY"||E==="MG"||E==="YELLOWBAT")',
        'if(E==="JILI"||E==="FC"||E==="PP"||E==="PP_SLOT"||E==="PG"||E==="JDB"||E==="COMBO"||E==="LETSGO"||E==="MONOPOLY"||E==="MG"||E==="YELLOWBAT"||E==="FASTSPIN")'
      );
      modified = true;
      console.log(`[FASTSPIN Slot Patch] Updated direct rules check for FASTSPIN in ${path.basename(filePath)}`);
    } else if (code.includes('if(E==="YELLOWBAT"){wr("YELLOWBAT");return}')) {
      code = code.replace('if(E==="YELLOWBAT"){wr("YELLOWBAT");return}', 'if(E==="YELLOWBAT"){wr("YELLOWBAT");return}if(E==="FASTSPIN"){wr("FASTSPIN");return}');
      modified = true;
      console.log(`[FASTSPIN Slot Patch] Added FASTSPIN click handler after YELLOWBAT in ${path.basename(filePath)}`);
    }
  }

  // 3. Add FASTSPIN games if not present
  if (!code.includes('category:"FASTSPIN"')) {
    const aztecRegex = /\{title:"Aztec Gems"[^}]+\}/;
    if (aztecRegex.test(code)) {
      code = code.replace(aztecRegex, match => `${match},${fastspinSlotGames.join(',')}`);
      modified = true;
      console.log(`[FASTSPIN Slot Patch] Added FASTSPIN slot games in ${path.basename(filePath)}`);
    }
  }

  if (modified) {
    fs.writeFileSync(filePath, code, 'utf8');
    console.log(`[FASTSPIN Slot Patch] Successfully updated ${path.basename(filePath)}`);
  }
});

// Update index.html files with new cache-busting timestamp
const newVersion = '20261023_slot_fastspin_v1';
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
    console.log(`[FASTSPIN Slot Patch] Updated version in ${f} to ${newVersion}`);
  }
});

// Update sw.js files with new cache name to wipe old cache
const newCacheName = 'sn777-v22';
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
    console.log(`[FASTSPIN Slot Patch] Updated cache name in ${f} to ${newCacheName}`);
  }
});

console.log('[FASTSPIN Slot Patch] Completed successfully!');
