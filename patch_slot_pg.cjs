const fs = require('fs');
const path = require('path');

console.log('[PG Slot Patch] Starting execution...');

const pgIconUrl = 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEiSVKhAnrlFv-ZatgcAKGZ3m0b8JGJRCuERTUi5aCb3qER7RlEad-r1l6at218Uk2YwUpom4aN6fCquRaWXUfXKo5ZVHTIjbLi1dDQGIHB9Q4O8F1TALtIaeqUFd78lMI0MV9YiuIHyQq6YZ7ufIC6BPq7-RRqUey9-T93d1n6wND_cio20hCm8I4_vmc-N/s120/provider-awcv2_pg.png';

const pgSlotProviderItem = `{title:"PG",image:"${pgIconUrl}",category:"স্লট",isHot:!1}`;

const pgSlotGames = [
  `{title:"Mahjong Ways 2",image:"https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhfWL1oXVK-cXPNStj4_NPXCW_KM0f64f8QAKSbr10PoR74XR8O_s50sKpTZ7Tsid_qkkFNHnl9aW9K2-Ncogso481X9XTTiCR8nd76nSL_oyL86BBvNsmmFBbim52HAPxKsNSs3aqcD1PPhmEDvPmrtm326-15qRoivyaydTKpMED6nlXuxh_Dvhx3WvNg/s120/lightIcon%20(9).webp",category:"PG",isHot:!0}`,
  `{title:"Fortune Tiger",image:"https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjTjrqbBrMwileUvFPyFyvMCkCjV-O8nkMbJyP_9hEAR40ILnjbUiBhFIAOwP2zBFR59pVwprRTpejwJaASfKqx8xWqzt2R-XknWjhYtGUz5MZAvYLB96Pp9b7AZ8qxX2iCo7bJasPA-stIDbQBk9_vbBvtD4N1urpud_SND-xuyIhSoTzyZIriVSJvpz6x/s256/images%20(22).jpeg",category:"PG",isHot:!0}`,
  `{title:"Wild Bounty Showdown",image:"https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhoTlILdIymPMEb13u6GWo55Ph1AYc9VdD7Uge3OyV7Uaxqf8sC13BIY4y-D3QuO5UpVU7bRYQmnv-SHqmfT8kg7NN4Op8HvONlwP66E80PTJMCbf4XU-c7RhxNfQWZ8wLYC59HXqkHCBYxG0Va6xBguhYJDn5TGnZrfsXEIDpdL5zpijKXqj8kURqAENlq/s120/lightIcon%20(2).webp",category:"PG",isHot:!0}`
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

  // 1. Add PG provider into category: "স্লট" after PP
  const hasPgInSlot = code.includes('category:"স্লট"') && code.includes(`{title:"PG",image:"${pgIconUrl}",category:"স্লট"`);
  if (!hasPgInSlot) {
    const ppRegex = /\{title:"PP",image:"[^"]+",category:"স্লট",isHot:[^}]+\}/;
    if (ppRegex.test(code)) {
      code = code.replace(ppRegex, match => `${match},${pgSlotProviderItem}`);
      modified = true;
      console.log(`[PG Slot Patch] Added PG folder after PP in ${path.basename(filePath)}`);
    } else {
      const fcRegex = /\{title:"FC",image:"[^"]+",category:"স্লট",isHot:[^}]+\}/;
      if (fcRegex.test(code)) {
        code = code.replace(fcRegex, match => `${match},${pgSlotProviderItem}`);
        modified = true;
        console.log(`[PG Slot Patch] Added PG folder after FC in ${path.basename(filePath)}`);
      }
    }
  }

  // 2. Add click handler for PG
  if (!code.includes('if(E==="PG"){wr("PG");return}')) {
    const fcClick = 'if(E==="FC"){wr("FC");return}';
    if (code.includes(fcClick)) {
      code = code.replace(fcClick, `${fcClick}if(E==="PG"){wr("PG");return}`);
      modified = true;
      console.log(`[PG Slot Patch] Added PG click handler in ${path.basename(filePath)}`);
    }
  }

  // 3. Add PG games if not present
  if (!code.includes('category:"PG"')) {
    const aztecRegex = /\{title:"Aztec Gems"[^}]+\}/;
    if (aztecRegex.test(code)) {
      code = code.replace(aztecRegex, match => `${match},${pgSlotGames.join(',')}`);
      modified = true;
      console.log(`[PG Slot Patch] Added PG slot games after Aztec Gems in ${path.basename(filePath)}`);
    }
  }

  if (modified) {
    fs.writeFileSync(filePath, code, 'utf8');
    console.log(`[PG Slot Patch] Successfully updated ${path.basename(filePath)}`);
  }
});

// Update index.html files with new cache-busting timestamp
const newVersion = '20261023_slot_pg_v1';
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
    console.log(`[PG Slot Patch] Updated version in ${f} to ${newVersion}`);
  }
});

// Update sw.js files with new cache name to wipe old cache
const newCacheName = 'sn777-v12';
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
    console.log(`[PG Slot Patch] Updated cache name in ${f} to ${newCacheName}`);
  }
});

console.log('[PG Slot Patch] Completed successfully!');
