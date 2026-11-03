const fs = require('fs');
const path = require('path');

console.log('[Slot CG Patch] Starting comprehensive CG patch...');

const cgIcon = 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjmRzqJ5P-T6ApnaWtJP3bZQ9eMjj3OmuSMLweIs0AQ0sk2II301CPukfjCSefKg23LU_ktCbnl3iVIeP4IfkI91xm9lHjfb_l1vqvspjtYvV8EFEiUlpkd5PSS66UVdG7pswaeoQTwsc1f4NQvMHEW7AgfZogvKRK26c9HP6ARnbqKMrywdRzz5aq845z9/s120/provider-awcv2_cg.png';

const cgProviderItem = `{title:"CG",image:"${cgIcon}",category:"স্লট",isHot:!1}`;
const cgSlotGames = [
  `{title:"CG Fortune",image:"${cgIcon}",category:"CG",isHot:!1}`,
  `{title:"CG Deluxe",image:"${cgIcon}",category:"CG",isHot:!1}`
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

  // 1. Ensure CG provider folder in category "স্লট"
  const cgRegex = /\{title:"CG",image:"[^"]+",category:"স্লট",isHot:[^}]+\}/;
  if (cgRegex.test(code)) {
    code = code.replace(cgRegex, cgProviderItem);
    changed = true;
    console.log(`[Slot CG Patch] Verified/Updated CG slot folder in ${path.basename(filePath)}`);
  } else {
    const btgRegex = /\{title:"BTG",image:"[^"]+",category:"স্লট",isHot:[^}]+\}/;
    if (btgRegex.test(code)) {
      code = code.replace(btgRegex, (match) => `${match},${cgProviderItem}`);
      changed = true;
      console.log(`[Slot CG Patch] Added CG slot folder after BTG in ${path.basename(filePath)}`);
    } else {
      const acewinRegex = /\{title:"ACEWIN",image:"[^"]+",category:"স্লট",isHot:[^}]+\}/;
      if (acewinRegex.test(code)) {
        code = code.replace(acewinRegex, (match) => `${match},${cgProviderItem}`);
        changed = true;
        console.log(`[Slot CG Patch] Added CG slot folder after ACEWIN in ${path.basename(filePath)}`);
      } else {
        const rich88Regex = /\{title:"RICH88",image:"[^"]+",category:"স্লট",isHot:[^}]+\}/;
        if (rich88Regex.test(code)) {
          code = code.replace(rich88Regex, (match) => `${match},${cgProviderItem}`);
          changed = true;
          console.log(`[Slot CG Patch] Added CG slot folder after RICH88 in ${path.basename(filePath)}`);
        }
      }
    }
  }

  // 2. Direct rules / folder click check for CG
  if (!code.includes('E==="CG"')) {
    if (code.includes('E==="BTG")')) {
      code = code.replace(/E==="BTG"\)/g, 'E==="BTG"||E==="CG")');
      changed = true;
      console.log(`[Slot CG Patch] Added CG to provider rules check after BTG in ${path.basename(filePath)}`);
    } else if (code.includes('E==="ACEWIN")')) {
      code = code.replace(/E==="ACEWIN"\)/g, 'E==="ACEWIN"||E==="CG")');
      changed = true;
      console.log(`[Slot CG Patch] Added CG to provider rules check after ACEWIN in ${path.basename(filePath)}`);
    } else if (code.includes('E==="RICH88")')) {
      code = code.replace(/E==="RICH88"\)/g, 'E==="RICH88"||E==="CG")');
      changed = true;
      console.log(`[Slot CG Patch] Added CG to provider rules check after RICH88 in ${path.basename(filePath)}`);
    }
  }

  // Replace any existing CG Fortune with isHot:!1
  if (code.includes('title:"CG Fortune"')) {
    code = code.replace(/\{title:"CG Fortune",image:"[^"]+",category:"CG",isHot:[^}]+\}/g, `{title:"CG Fortune",image:"${cgIcon}",category:"CG",isHot:!1}`);
    changed = true;
  }

  // 3. Add CG games if not present
  if (!code.includes('category:"CG"')) {
    const btgGameRegex = /\{title:"BTG Bonanza"[^}]+\}/;
    if (btgGameRegex.test(code)) {
      code = code.replace(btgGameRegex, match => `${match},${cgSlotGames.join(',')}`);
      changed = true;
      console.log(`[Slot CG Patch] Added CG slot games after BTG in ${path.basename(filePath)}`);
    } else {
      const acewinGameRegex = /\{title:"Acewin Fortune"[^}]+\}/;
      if (acewinGameRegex.test(code)) {
        code = code.replace(acewinGameRegex, match => `${match},${cgSlotGames.join(',')}`);
        changed = true;
        console.log(`[Slot CG Patch] Added CG slot games after Acewin in ${path.basename(filePath)}`);
      }
    }
  }

  if (changed) {
    fs.writeFileSync(filePath, code, 'utf8');
  }
});

console.log('[Slot CG Patch] Completed successfully!');
