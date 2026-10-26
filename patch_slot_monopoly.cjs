const fs = require('fs');
const path = require('path');

console.log('[MONOPOLY Slot Patch] Starting execution...');

const monopolyIconUrl = 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEiOkyplq5U_mbnfFkb_heLxDN__Kh7h7GfwOAR1w_EzAnLOiLxXEGfHWZtctDTO_jU0TTzCpbPkxezuGZBZU1kew_2h2LHCI2b6I8uU5QFhyphenhyphenXxShDVqlxSSGMBpoQVI37Vx76RjeabnTV4lUtoSuFIzCI8uzTES5FIlFfL3VEOyjFmLZI_bxpYxml1AeiMT/s120/provider-monopoly.png';

const monopolySlotProviderItem = `{title:"MONOPOLY",image:"${monopolyIconUrl}",category:"স্লট",isHot:!1}`;

const monopolySlotGames = [
  `{title:"Monopoly Megaways",image:"https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhfWL1oXVK-cXPNStj4_NPXCW_KM0f64f8QAKSbr10PoR74XR8O_s50sKpTZ7Tsid_qkkFNHnl9aW9K2-Ncogso481X9XTTiCR8nd76nSL_oyL86BBvNsmmFBbim52HAPxKsNSs3aqcD1PPhmEDvPmrtm326-15qRoivyaydTKpMED6nlXuxh_Dvhx3WvNg/s120/lightIcon%20(9).webp",category:"MONOPOLY",isHot:!0}`,
  `{title:"Monopoly Live Spin",image:"https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjTjrqbBrMwileUvFPyFyvMCkCjV-O8nkMbJyP_9hEAR40ILnjbUiBhFIAOwP2zBFR59pVwprRTpejwJaASfKqx8xWqzt2R-XknWjhYtGUz5MZAvYLB96Pp9b7AZ8qxX2iCo7bJasPA-stIDbQBk9_vbBvtD4N1urpud_SND-xuyIhSoTzyZIriVSJvpz6x/s256/images%20(22).jpeg",category:"MONOPOLY",isHot:!0}`
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

  // 1. Add or update MONOPOLY provider into category: "স্লট"
  const monopolyRegex = /\{title:"MONOPOLY",image:"[^"]+",category:"স্লট",isHot:[^}]+\}/;
  if (monopolyRegex.test(code)) {
    code = code.replace(monopolyRegex, monopolySlotProviderItem);
    modified = true;
    console.log(`[MONOPOLY Slot Patch] Updated MONOPOLY image URL in ${path.basename(filePath)}`);
  } else {
    const letsgoRegex = /\{title:"LETSGO",image:"[^"]+",category:"স্লট",isHot:[^}]+\}/;
    if (letsgoRegex.test(code)) {
      code = code.replace(letsgoRegex, match => `${match},${monopolySlotProviderItem}`);
      modified = true;
      console.log(`[MONOPOLY Slot Patch] Added MONOPOLY folder after LETSGO in ${path.basename(filePath)}`);
    } else {
      const comboRegex = /\{title:"COMBO",image:"[^"]+",category:"স্লট",isHot:[^}]+\}/;
      if (comboRegex.test(code)) {
        code = code.replace(comboRegex, match => `${match},${monopolySlotProviderItem}`);
        modified = true;
        console.log(`[MONOPOLY Slot Patch] Added MONOPOLY folder after COMBO in ${path.basename(filePath)}`);
      }
    }
  }

  // 2. Add direct rules check for MONOPOLY in kc click handler
  if (!code.includes('E==="MONOPOLY"')) {
    if (code.includes('if(E==="JILI"||E==="FC"||E==="PP"||E==="PP_SLOT"||E==="PG"||E==="JDB"||E==="COMBO"||E==="LETSGO")')) {
      code = code.replace(
        'if(E==="JILI"||E==="FC"||E==="PP"||E==="PP_SLOT"||E==="PG"||E==="JDB"||E==="COMBO"||E==="LETSGO")',
        'if(E==="JILI"||E==="FC"||E==="PP"||E==="PP_SLOT"||E==="PG"||E==="JDB"||E==="COMBO"||E==="LETSGO"||E==="MONOPOLY")'
      );
      modified = true;
      console.log(`[MONOPOLY Slot Patch] Updated direct rules check for MONOPOLY in ${path.basename(filePath)}`);
    } else if (code.includes('if(E==="LETSGO"){wr("LETSGO");return}')) {
      code = code.replace('if(E==="LETSGO"){wr("LETSGO");return}', 'if(E==="LETSGO"){wr("LETSGO");return}if(E==="MONOPOLY"){wr("MONOPOLY");return}');
      modified = true;
      console.log(`[MONOPOLY Slot Patch] Added MONOPOLY click handler after LETSGO in ${path.basename(filePath)}`);
    }
  }

  // 3. Add MONOPOLY games if not present
  if (!code.includes('category:"MONOPOLY"')) {
    const aztecRegex = /\{title:"Aztec Gems"[^}]+\}/;
    if (aztecRegex.test(code)) {
      code = code.replace(aztecRegex, match => `${match},${monopolySlotGames.join(',')}`);
      modified = true;
      console.log(`[MONOPOLY Slot Patch] Added MONOPOLY slot games in ${path.basename(filePath)}`);
    }
  }

  if (modified) {
    fs.writeFileSync(filePath, code, 'utf8');
    console.log(`[MONOPOLY Slot Patch] Successfully updated ${path.basename(filePath)}`);
  }
});

// Update index.html files with new cache-busting timestamp
const newVersion = '20261023_slot_monopoly_v1';
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
    console.log(`[MONOPOLY Slot Patch] Updated version in ${f} to ${newVersion}`);
  }
});

// Update sw.js files with new cache name to wipe old cache
const newCacheName = 'sn777-v19';
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
    console.log(`[MONOPOLY Slot Patch] Updated cache name in ${f} to ${newCacheName}`);
  }
});

console.log('[MONOPOLY Slot Patch] Completed successfully!');
