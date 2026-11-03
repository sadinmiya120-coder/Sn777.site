const fs = require('fs');
const path = require('path');

console.log('[Slot GTF Patch] Starting comprehensive GTF patch...');

const gtfIcon = 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgDCKkwLzALYoUXc0KzFU8AL-0qv806BQAWZlnNFsnMNVb81AEoc_FqCv-cuTkvdTUdokWfT8Bs9vHwEbT0uhIr9BtyqGDIuGr5dMgtMlGMtblhn79eYCgYU4MeOA-cS4OPLfQZL5fDypoDrPWNvv_i8N9VHfh7yjZBUjoLnhsZfsdmE3pJRxVfOYpd-pvb/s120/provider-awcv2_gtf.png';

const gtfProviderItem = `{title:"GTF",image:"${gtfIcon}",category:"স্লট",isHot:!1}`;

const gtfSlotGames = [
  `{title:"GTF Fortune",image:"${gtfIcon}",category:"GTF",isHot:!1}`,
  `{title:"GTF Deluxe",image:"${gtfIcon}",category:"GTF",isHot:!1}`
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

  // 1. Ensure GTF provider folder in category "স্লট"
  const gtfRegex = /\{title:"GTF",image:"[^"]+",category:"স্লট",isHot:[^}]+\}/;
  if (gtfRegex.test(code)) {
    code = code.replace(gtfRegex, gtfProviderItem);
    changed = true;
    console.log(`[Slot GTF Patch] Verified/Updated GTF slot folder in ${path.basename(filePath)}`);
  } else {
    const dsRegex = /\{title:"DRAGOONSOFT",image:"[^"]+",category:"স্লট",isHot:[^}]+\}/;
    if (dsRegex.test(code)) {
      code = code.replace(dsRegex, (match) => `${match},${gtfProviderItem}`);
      changed = true;
      console.log(`[Slot GTF Patch] Added GTF slot folder after DRAGOONSOFT in ${path.basename(filePath)}`);
    } else {
      const cgRegex = /\{title:"CG",image:"[^"]+",category:"স্লট",isHot:[^}]+\}/;
      if (cgRegex.test(code)) {
        code = code.replace(cgRegex, (match) => `${match},${gtfProviderItem}`);
        changed = true;
        console.log(`[Slot GTF Patch] Added GTF slot folder after CG in ${path.basename(filePath)}`);
      }
    }
  }

  // 2. Direct rules / folder click check for GTF
  if (!code.includes('E==="GTF"')) {
    if (code.includes('E==="DRAGOONSOFT")')) {
      code = code.replace(/E==="DRAGOONSOFT"\)/g, 'E==="DRAGOONSOFT"||E==="GTF")');
      changed = true;
      console.log(`[Slot GTF Patch] Added GTF to provider rules check after DRAGOONSOFT in ${path.basename(filePath)}`);
    } else if (code.includes('E==="CG")')) {
      code = code.replace(/E==="CG"\)/g, 'E==="CG"||E==="GTF")');
      changed = true;
      console.log(`[Slot GTF Patch] Added GTF to provider rules check after CG in ${path.basename(filePath)}`);
    }
  }

  // Replace any existing GTF Fortune with isHot:!1
  if (code.includes('title:"GTF Fortune"')) {
    code = code.replace(/\{title:"GTF Fortune",image:"[^"]+",category:"GTF",isHot:[^}]+\}/g, `{title:"GTF Fortune",image:"${gtfIcon}",category:"GTF",isHot:!1}`);
    changed = true;
  }

  // 3. Add GTF games if not present
  if (!code.includes('category:"GTF"')) {
    const dsGameRegex = /\{title:"Dragoonsoft Fortune"[^}]+\}/;
    if (dsGameRegex.test(code)) {
      code = code.replace(dsGameRegex, match => `${match},${gtfSlotGames.join(',')}`);
      changed = true;
      console.log(`[Slot GTF Patch] Added GTF slot games after DRAGOONSOFT in ${path.basename(filePath)}`);
    } else {
      const cgGameRegex = /\{title:"CG Fortune"[^}]+\}/;
      if (cgGameRegex.test(code)) {
        code = code.replace(cgGameRegex, match => `${match},${gtfSlotGames.join(',')}`);
        changed = true;
        console.log(`[Slot GTF Patch] Added GTF slot games after CG in ${path.basename(filePath)}`);
      }
    }
  }

  if (changed) {
    fs.writeFileSync(filePath, code, 'utf8');
  }
});

console.log('[Slot GTF Patch] Completed successfully!');
