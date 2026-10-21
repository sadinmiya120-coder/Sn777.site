const fs = require('fs');
const path = require('path');

console.log('[PT Provider Patch] Starting patch...');

// 1. Ensure image assets are in place
const srcImg = path.join(__dirname, 'src/assets/images/hotroad_pt_icon_1792501490333.jpg');
const distImgPng = path.join(__dirname, 'dist/assets/provider_pt.png');
const distBackupImgPng = path.join(__dirname, 'dist_backup/assets/provider_pt.png');
const distImgJpg = path.join(__dirname, 'dist/assets/provider_pt.jpg');
const distBackupImgJpg = path.join(__dirname, 'dist_backup/assets/provider_pt.jpg');

[path.dirname(distImgPng), path.dirname(distBackupImgPng)].forEach(dir => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

if (fs.existsSync(srcImg)) {
  if (!fs.existsSync(distBackupImgPng) || !fs.existsSync(distImgPng)) {
    try {
      fs.copyFileSync(srcImg, distBackupImgPng);
      fs.copyFileSync(srcImg, distImgPng);
    } catch (e) {}
  }
  if (!fs.existsSync(distBackupImgJpg) || !fs.existsSync(distImgJpg)) {
    try {
      fs.copyFileSync(srcImg, distBackupImgJpg);
      fs.copyFileSync(srcImg, distImgJpg);
    } catch (e) {}
  }
}

// 2. Target files to patch
const targets = [
  path.join(__dirname, 'dist_backup/assets/index-sn777-v10.js'),
  path.join(__dirname, 'dist/assets/index-sn777-v10.js'),
  path.join(__dirname, 'dist_backup/assets/index-sn777-v9.js'),
  path.join(__dirname, 'dist/assets/index-sn777-v9.js'),
  path.join(__dirname, 'dist_backup/assets/index-sn777-v8.js'),
  path.join(__dirname, 'dist/assets/index-sn777-v8.js'),
  path.join(__dirname, 'dist_backup/assets/index-sn777-v7.js'),
  path.join(__dirname, 'dist/assets/index-sn777-v7.js'),
  path.join(__dirname, 'dist_backup/assets/index-sn777-v6.js'),
  path.join(__dirname, 'dist/assets/index-sn777-v6.js'),
  path.join(__dirname, 'dist_backup/assets/index-sn777-v5.js'),
  path.join(__dirname, 'dist/assets/index-sn777-v5.js'),
  path.join(__dirname, 'original-index-sn777-v5.js')
];

const ptProviderItem = `{title:"PT",image:"/assets/provider_pt.png",category:"ক্যাসিনো",isHot:!1}`;
const ptLobbyItem = `{title:"PT Game Lobby",image:"/assets/provider_pt.png",category:"PT"}`;

let updatedCount = 0;

targets.forEach(filePath => {
  if (!fs.existsSync(filePath)) return;
  let code = fs.readFileSync(filePath, 'utf8');
  let changed = false;

  // A. Clean up duplicated Tt conditions and add PT
  const regexTtOr = /Tt==="EVO"\|\|Tt==="SEXY"\|\|Tt==="PP"\|\|Tt==="DG"(?:\|\|Tt==="HOTROAD"|\|\|Tt==="PT")+/g;
  if (regexTtOr.test(code)) {
    code = code.replace(regexTtOr, 'Tt==="EVO"||Tt==="SEXY"||Tt==="PP"||Tt==="DG"||Tt==="HOTROAD"||Tt==="PT"');
    changed = true;
  }

  const regexTtAnd = /Tt!=="EVO"&&Tt!=="SEXY"&&Tt!=="PP"&&Tt!=="DG"(?:&&Tt!=="HOTROAD"|&&Tt!=="PT")+/g;
  if (regexTtAnd.test(code)) {
    code = code.replace(regexTtAnd, 'Tt!=="EVO"&&Tt!=="SEXY"&&Tt!=="PP"&&Tt!=="DG"&&Tt!=="HOTROAD"&&Tt!=="PT"');
    changed = true;
  }

  // B. Add PT Provider in category "ক্যাসিনো" after HOTROAD
  if (!code.includes('{title:"PT",image:')) {
    const hotroadProviderRegex = /\{title:"HOTROAD",image:"[^"]+",category:"ক্যাসিনো",isHot:(!0|true|!1|false)\}/;
    if (hotroadProviderRegex.test(code)) {
      code = code.replace(hotroadProviderRegex, (match) => `${match},${ptProviderItem}`);
      changed = true;
      console.log(`[PT Provider Patch] Added PT folder icon after HOTROAD in ${path.basename(filePath)}`);
    }
  }

  // C. Add click handler: if(E==="PT"){wr("PT");return}
  if (!code.includes('if(E==="PT"){wr("PT");return}')) {
    const hotroadClick = 'if(E==="HOTROAD"){wr("HOTROAD");return}';
    if (code.includes(hotroadClick)) {
      code = code.replace(hotroadClick, `${hotroadClick}if(E==="PT"){wr("PT");return}`);
      changed = true;
      console.log(`[PT Provider Patch] Added PT click handler in ${path.basename(filePath)}`);
    }
  }

  // D. Add PT Game Lobby in category "PT"
  if (!code.includes('category:"PT"')) {
    const xocDiaGame = '{title:"HOTROAD Xoc Dia",image:"https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhtjCduCMS18MCq-PAsDenQRj6vJZJemPP9W8yXi7Z3yI40Delvzk-8AHiF8edTTso-s0rlvx4AONmlqZfcoVEEeKH0lwlFrTizO9HAXVGKmMfPzOVcVs6ydS2EuGRVagP_h0i9h9P9amMNlFq2fp7JzRoC7jS7wDmc-STeIE14lylH7jwG_NS2KxHNpUq6/s500/HOTROAD-LIVE-010.png",category:"HOTROAD"}';
    if (code.includes(xocDiaGame)) {
      code = code.replace(xocDiaGame, `${xocDiaGame},${ptLobbyItem}`);
      changed = true;
      console.log(`[PT Provider Patch] Added PT Game Lobby in ${path.basename(filePath)}`);
    } else {
      const tigerRegex = /\{title:"HOTROAD TIGER BACCARAT"[^}]+\}/;
      if (tigerRegex.test(code)) {
        code = code.replace(tigerRegex, (match) => `${match},${ptLobbyItem}`);
        changed = true;
        console.log(`[PT Provider Patch] Added PT Game Lobby after TIGER BACCARAT in ${path.basename(filePath)}`);
      }
    }
  }

  if (changed) {
    fs.writeFileSync(filePath, code, 'utf8');
    updatedCount++;
  }
});

console.log(`[PT Provider Patch] Completed! Updated ${updatedCount} files.`);
