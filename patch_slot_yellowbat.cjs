const fs = require('fs');
const path = require('path');

console.log('[YELLOWBAT Slot Patch] Starting execution...');

const yellowbatIconUrl = 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEj-8Fm0wrTld_zhkleR7eYF9tZhsV5dGAPpWypYrBeWS9xB-VoKzL6bf8ZQGE4RoA-J3mkFFFuTyOXmpaEaITjlF1NE-RyR9yVQ3jr_HuVaQ0QxV2HK3d9va3yOpFhmofxYFOQTh4SAKkTVs9BuYMcymXQh5_YR_6B8E6XxJdZLSRtzfFZ5WEzP8vFbe6wZ/s120/provider-awcv2_yesbingo.png';

const yellowbatSlotProviderItem = `{title:"YELLOWBAT",image:"${yellowbatIconUrl}",category:"স্লট",isHot:!1}`;

const yellowbatSlotGames = [
  `{title:"Yellowbat Rush",image:"https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhfWL1oXVK-cXPNStj4_NPXCW_KM0f64f8QAKSbr10PoR74XR8O_s50sKpTZ7Tsid_qkkFNHnl9aW9K2-Ncogso481X9XTTiCR8nd76nSL_oyL86BBvNsmmFBbim52HAPxKsNSs3aqcD1PPhmEDvPmrtm326-15qRoivyaydTKpMED6nlXuxh_Dvhx3WvNg/s120/lightIcon%20(9).webp",category:"YELLOWBAT",isHot:!0}`,
  `{title:"Yellowbat Fortune",image:"https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjTjrqbBrMwileUvFPyFyvMCkCjV-O8nkMbJyP_9hEAR40ILnjbUiBhFIAOwP2zBFR59pVwprRTpejwJaASfKqx8xWqzt2R-XknWjhYtGUz5MZAvYLB96Pp9b7AZ8qxX2iCo7bJasPA-stIDbQBk9_vbBvtD4N1urpud_SND-xuyIhSoTzyZIriVSJvpz6x/s256/images%20(22).jpeg",category:"YELLOWBAT",isHot:!0}`
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

  // 1. Add or update YELLOWBAT provider into category: "স্লট"
  const yellowbatRegex = /\{title:"YELLOWBAT",image:"[^"]+",category:"স্লট",isHot:[^}]+\}/;
  if (yellowbatRegex.test(code)) {
    code = code.replace(yellowbatRegex, yellowbatSlotProviderItem);
    modified = true;
    console.log(`[YELLOWBAT Slot Patch] Updated YELLOWBAT image URL in ${path.basename(filePath)}`);
  } else {
    const mgRegex = /\{title:"MG",image:"[^"]+",category:"স্লট",isHot:[^}]+\}/;
    if (mgRegex.test(code)) {
      code = code.replace(mgRegex, match => `${match},${yellowbatSlotProviderItem}`);
      modified = true;
      console.log(`[YELLOWBAT Slot Patch] Added YELLOWBAT folder after MG in ${path.basename(filePath)}`);
    } else {
      const monopolyRegex = /\{title:"MONOPOLY",image:"[^"]+",category:"স্লট",isHot:[^}]+\}/;
      if (monopolyRegex.test(code)) {
        code = code.replace(monopolyRegex, match => `${match},${yellowbatSlotProviderItem}`);
        modified = true;
        console.log(`[YELLOWBAT Slot Patch] Added YELLOWBAT folder after MONOPOLY in ${path.basename(filePath)}`);
      }
    }
  }

  // 2. Add direct rules check for YELLOWBAT in kc click handler
  if (!code.includes('E==="YELLOWBAT"')) {
    if (code.includes('if(E==="JILI"||E==="FC"||E==="PP"||E==="PP_SLOT"||E==="PG"||E==="JDB"||E==="COMBO"||E==="LETSGO"||E==="MONOPOLY"||E==="MG")')) {
      code = code.replace(
        'if(E==="JILI"||E==="FC"||E==="PP"||E==="PP_SLOT"||E==="PG"||E==="JDB"||E==="COMBO"||E==="LETSGO"||E==="MONOPOLY"||E==="MG")',
        'if(E==="JILI"||E==="FC"||E==="PP"||E==="PP_SLOT"||E==="PG"||E==="JDB"||E==="COMBO"||E==="LETSGO"||E==="MONOPOLY"||E==="MG"||E==="YELLOWBAT")'
      );
      modified = true;
      console.log(`[YELLOWBAT Slot Patch] Updated direct rules check for YELLOWBAT in ${path.basename(filePath)}`);
    } else if (code.includes('if(E==="MG"){wr("MG");return}')) {
      code = code.replace('if(E==="MG"){wr("MG");return}', 'if(E==="MG"){wr("MG");return}if(E==="YELLOWBAT"){wr("YELLOWBAT");return}');
      modified = true;
      console.log(`[YELLOWBAT Slot Patch] Added YELLOWBAT click handler after MG in ${path.basename(filePath)}`);
    }
  }

  // 3. Add YELLOWBAT games if not present
  if (!code.includes('category:"YELLOWBAT"')) {
    const aztecRegex = /\{title:"Aztec Gems"[^}]+\}/;
    if (aztecRegex.test(code)) {
      code = code.replace(aztecRegex, match => `${match},${yellowbatSlotGames.join(',')}`);
      modified = true;
      console.log(`[YELLOWBAT Slot Patch] Added YELLOWBAT slot games in ${path.basename(filePath)}`);
    }
  }

  if (modified) {
    fs.writeFileSync(filePath, code, 'utf8');
    console.log(`[YELLOWBAT Slot Patch] Successfully updated ${path.basename(filePath)}`);
  }
});

// Update index.html files with new cache-busting timestamp
const newVersion = '20261023_slot_yellowbat_v1';
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
    console.log(`[YELLOWBAT Slot Patch] Updated version in ${f} to ${newVersion}`);
  }
});

// Update sw.js files with new cache name to wipe old cache
const newCacheName = 'sn777-v21';
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
    console.log(`[YELLOWBAT Slot Patch] Updated cache name in ${f} to ${newCacheName}`);
  }
});

console.log('[YELLOWBAT Slot Patch] Completed successfully!');
