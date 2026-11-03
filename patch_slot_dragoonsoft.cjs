const fs = require('fs');
const path = require('path');

console.log('[Slot DRAGOONSOFT Patch] Starting comprehensive DRAGOONSOFT patch...');

const dragoonsoftIcon = 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgZqhRtLb8kxjY7FPvK3JFnt9d7vGiAF_9zdrBlwUKScLYAOgvXjazblTTb6jFSBYPtNpi69PdJgGOKlrUIALmsgNoKzcg5Ui0ys-2GiRiOGcGqKMhOcw_jY_AZg2jvSA1k3kbKWREpwmoCFiZCbBvq_VDQWxEVBtxRYbL5o-lC5-Tsnre60lPgHqSILkBZ/s120/provider-awcv2_dragoonsoft.png';

const dragoonsoftProviderItem = `{title:"DRAGOONSOFT",image:"${dragoonsoftIcon}",category:"স্লট",isHot:!1}`;
const dragoonsoftSlotGames = [
  `{title:"Dragoonsoft Fortune",image:"${dragoonsoftIcon}",category:"DRAGOONSOFT",isHot:!1}`,
  `{title:"Dragoonsoft Deluxe",image:"${dragoonsoftIcon}",category:"DRAGOONSOFT",isHot:!1}`
];

const jsTargets = [
  path.join(__dirname, 'dist/assets/index-sn777-v12.js'),
  path.join(__dirname, 'dist_backup/assets/index-sn777-v12.js'),
  path.join(__dirname, 'original-index-sn777-v5.js'),
  path.join(__dirname, 'public/assets/index-sn777-v12.js')
];

jsTargets.forEach(filePath => {
  if (!fs.existsSync(filePath)) return;
  let code = fs.readFileSync(filePath, 'utf8');
  let changed = false;

  // 1. Ensure DRAGOONSOFT provider folder in category "স্লট"
  const dsRegex = /\{title:"DRAGOONSOFT",image:"[^"]+",category:"স্লট",isHot:[^}]+\}/;
  if (dsRegex.test(code)) {
    code = code.replace(dsRegex, dragoonsoftProviderItem);
    changed = true;
    console.log(`[Slot DRAGOONSOFT Patch] Verified/Updated DRAGOONSOFT slot folder in ${path.basename(filePath)}`);
  } else {
    const cgRegex = /\{title:"CG",image:"[^"]+",category:"স্লট",isHot:[^}]+\}/;
    if (cgRegex.test(code)) {
      code = code.replace(cgRegex, (match) => `${match},${dragoonsoftProviderItem}`);
      changed = true;
      console.log(`[Slot DRAGOONSOFT Patch] Added DRAGOONSOFT slot folder after CG in ${path.basename(filePath)}`);
    } else {
      const btgRegex = /\{title:"BTG",image:"[^"]+",category:"স্লট",isHot:[^}]+\}/;
      if (btgRegex.test(code)) {
        code = code.replace(btgRegex, (match) => `${match},${dragoonsoftProviderItem}`);
        changed = true;
        console.log(`[Slot DRAGOONSOFT Patch] Added DRAGOONSOFT slot folder after BTG in ${path.basename(filePath)}`);
      }
    }
  }

  // 2. Direct rules / folder click check for DRAGOONSOFT
  if (!code.includes('E==="DRAGOONSOFT"')) {
    if (code.includes('E==="CG")')) {
      code = code.replace(/E==="CG"\)/g, 'E==="CG"||E==="DRAGOONSOFT")');
      changed = true;
      console.log(`[Slot DRAGOONSOFT Patch] Added DRAGOONSOFT to provider rules check after CG in ${path.basename(filePath)}`);
    } else if (code.includes('E==="BTG")')) {
      code = code.replace(/E==="BTG"\)/g, 'E==="BTG"||E==="DRAGOONSOFT")');
      changed = true;
      console.log(`[Slot DRAGOONSOFT Patch] Added DRAGOONSOFT to provider rules check after BTG in ${path.basename(filePath)}`);
    }
  }

  // Replace any existing Dragoonsoft Fortune with isHot:!1
  if (code.includes('title:"Dragoonsoft Fortune"')) {
    code = code.replace(/\{title:"Dragoonsoft Fortune",image:"[^"]+",category:"DRAGOONSOFT",isHot:[^}]+\}/g, `{title:"Dragoonsoft Fortune",image:"${dragoonsoftIcon}",category:"DRAGOONSOFT",isHot:!1}`);
    changed = true;
  }

  // 3. Add DRAGOONSOFT games if not present
  if (!code.includes('category:"DRAGOONSOFT"')) {
    const cgGameRegex = /\{title:"CG Fortune"[^}]+\}/;
    if (cgGameRegex.test(code)) {
      code = code.replace(cgGameRegex, match => `${match},${dragoonsoftSlotGames.join(',')}`);
      changed = true;
      console.log(`[Slot DRAGOONSOFT Patch] Added DRAGOONSOFT slot games after CG in ${path.basename(filePath)}`);
    } else {
      const btgGameRegex = /\{title:"BTG Bonanza"[^}]+\}/;
      if (btgGameRegex.test(code)) {
        code = code.replace(btgGameRegex, match => `${match},${dragoonsoftSlotGames.join(',')}`);
        changed = true;
        console.log(`[Slot DRAGOONSOFT Patch] Added DRAGOONSOFT slot games after BTG in ${path.basename(filePath)}`);
      }
    }
  }

  if (changed) {
    fs.writeFileSync(filePath, code, 'utf8');
  }
});

console.log('[Slot DRAGOONSOFT Patch] Completed successfully!');
