const fs = require('fs');
const path = require('path');

console.log('[HOTROAD Patch] Starting HOTROAD folder & icon patch...');

const targets = [
  path.join(__dirname, 'dist_backup/assets/index-sn777-v10.js'),
  path.join(__dirname, 'dist/assets/index-sn777-v10.js'),
  path.join(__dirname, 'original-index-sn777-v5.js')
];

const hotroadIcon = 'https://hotroadofficial.com/assets/footer/footericon.png';
const hotroadProviderItem = `{title:"HOTROAD",image:"${hotroadIcon}",category:"ক্যাসিনো",isHot:!1}`;
const hotroadLobbyItem = `{title:"HOTROAD Game Lobby",image:"${hotroadIcon}",category:"HOTROAD"}`;

let updatedCount = 0;

targets.forEach(filePath => {
  if (!fs.existsSync(filePath)) return;
  let code = fs.readFileSync(filePath, 'utf8');
  let changed = false;

  // 1. Add HOTROAD provider icon after DG in category "ক্যাসিনো"
  const dgProviderRegex = /\{title:"DG",image:"[^"]+",category:"ক্যাসিনো",isHot:(!0|true|!1|false)\}/;
  if (!code.includes('{title:"HOTROAD",image:')) {
    if (dgProviderRegex.test(code)) {
      code = code.replace(dgProviderRegex, (match) => `${match},${hotroadProviderItem}`);
      changed = true;
      console.log(`[HOTROAD Patch] Added HOTROAD provider folder icon after DG in ${path.basename(filePath)}`);
    }
  }

  // 2. Add HOTROAD Game Lobby to Yz (or Wz) so the folder has an initial lobby
  if (!code.includes('{title:"HOTROAD Game Lobby"')) {
    if (code.includes('category:"HOTROAD"')) {
      // already exists
    } else {
      // Add right after HOTROAD provider or in Yz
      const dgLobbyRegex = /\{title:"DG Game Lobby",image:"[^"]+",category:"DG"\}/;
      if (dgLobbyRegex.test(code)) {
        code = code.replace(dgLobbyRegex, (match) => `${match},${hotroadLobbyItem}`);
        changed = true;
        console.log(`[HOTROAD Patch] Added HOTROAD Game Lobby in ${path.basename(filePath)}`);
      }
    }
  }

  // 3. Update game click handler: if(E==="DG"){wr("DG");return} -> add HOTROAD
  if (!code.includes('if(E==="HOTROAD"){wr("HOTROAD");return}')) {
    const clickDg = 'if(E==="DG"){wr("DG");return}';
    if (code.includes(clickDg)) {
      code = code.replace(clickDg, `${clickDg}if(E==="HOTROAD"){wr("HOTROAD");return}`);
      changed = true;
      console.log(`[HOTROAD Patch] Added HOTROAD click handler in ${path.basename(filePath)}`);
    }
  }

  // 4. Update UI grid conditions for Tt:
  // ${Tt==="EVO"||Tt==="SEXY"||Tt==="PP"||Tt==="DG"
  const oldTtGrid = '${Tt==="EVO"||Tt==="SEXY"||Tt==="PP"||Tt==="DG"';
  const newTtGrid = '${Tt==="EVO"||Tt==="SEXY"||Tt==="PP"||Tt==="DG"||Tt==="HOTROAD"';
  if (code.includes(oldTtGrid)) {
    code = code.split(oldTtGrid).join(newTtGrid);
    changed = true;
    console.log(`[HOTROAD Patch] Updated Tt===HOTROAD grid checks in ${path.basename(filePath)}`);
  }

  const oldTtCheck = 'Tt==="EVO"||Tt==="SEXY"||Tt==="PP"||Tt==="DG"?';
  const newTtCheck = 'Tt==="EVO"||Tt==="SEXY"||Tt==="PP"||Tt==="DG"||Tt==="HOTROAD"?';
  if (code.includes(oldTtCheck)) {
    code = code.split(oldTtCheck).join(newTtCheck);
    changed = true;
    console.log(`[HOTROAD Patch] Updated Tt===HOTROAD ternary checks in ${path.basename(filePath)}`);
  }

  const oldTtNot = 'Tt!=="EVO"&&Tt!=="SEXY"&&Tt!=="PP"&&Tt!=="DG"';
  const newTtNot = 'Tt!=="EVO"&&Tt!=="SEXY"&&Tt!=="PP"&&Tt!=="DG"&&Tt!=="HOTROAD"';
  if (code.includes(oldTtNot)) {
    code = code.split(oldTtNot).join(newTtNot);
    changed = true;
    console.log(`[HOTROAD Patch] Updated Tt!==HOTROAD negations in ${path.basename(filePath)}`);
  }

  if (changed) {
    fs.writeFileSync(filePath, code, 'utf8');
    updatedCount++;
  }
});

console.log(`[HOTROAD Patch] Completed! Updated ${updatedCount} files.`);
