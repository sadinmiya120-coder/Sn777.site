const fs = require('fs');
const path = require('path');

console.log('[Slot PP Patch] Starting PP slot folder patch...');

const targets = [
  path.join(__dirname, 'dist/assets/index-sn777-v12.js'),
  path.join(__dirname, 'dist_backup/assets/index-sn777-v12.js'),
  path.join(__dirname, 'original-index-sn777-v5.js')
];

const cleanPpIcon = 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEiMPZWLFyD6YlVWO4bmuZXAxlCYR8pjpFZHlqviWga8hDmHzZwLiaSt6FeiGbfDwQxVXO34aqc-cHN9KqGfgSKbcyt-ehIM8mniu9AdsRpPfyemOXN__7WFexeZGgtHPp4wVtduP_xKX6xDnB25i4wyXbSNBhxEczajBFOnaGElEspurSpxOCgdfAGGpasr/s120/provider-awcv2_pp%20(1).png';

const ppProviderItem = `{title:"PP",image:"${cleanPpIcon}",category:"স্লট",isHot:!1}`;

let updatedCount = 0;

targets.forEach(filePath => {
  if (!fs.existsSync(filePath)) return;
  let code = fs.readFileSync(filePath, 'utf8');
  let changed = false;

  const hasSlotPp = new RegExp('\\{title:"PP",image:"[^"]+",category:"স্লট"').test(code);

  if (!hasSlotPp) {
    const fcRegex = /\{title:"FC",image:"[^"]+",category:"স্লট",isHot:[^}]+\}/;
    if (fcRegex.test(code)) {
      code = code.replace(fcRegex, (match) => `${match},${ppProviderItem}`);
      changed = true;
      console.log(`[Slot PP Patch] Added PP slot folder after FC in ${path.basename(filePath)}`);
    } else {
      const jiliRegex = /\{title:"JILI",image:"[^"]+",category:"স্লট",isHot:[^}]+\}/;
      if (jiliRegex.test(code)) {
        code = code.replace(jiliRegex, (match) => `${match},${ppProviderItem}`);
        changed = true;
        console.log(`[Slot PP Patch] Added PP slot folder after JILI in ${path.basename(filePath)}`);
      }
    }
  }

  // Also ensure click handler includes if(E==="PP"){wr("PP");return}
  if (!code.includes('if(E==="PP"){wr("PP");return}')) {
    const clickJili = 'if(E==="JILI"){wr("JILI");return}';
    if (code.includes(clickJili)) {
      code = code.replace(clickJili, `if(E==="PP"){wr("PP");return}${clickJili}`);
      changed = true;
      console.log(`[Slot PP Patch] Added PP click handler in ${path.basename(filePath)}`);
    }
  }

  if (changed) {
    fs.writeFileSync(filePath, code, 'utf8');
    updatedCount++;
  }
});

console.log(`[Slot PP Patch] Completed! Updated ${updatedCount} files.`);
