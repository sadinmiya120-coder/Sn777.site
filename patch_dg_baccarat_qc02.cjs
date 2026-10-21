const fs = require('fs');
const path = require('path');

console.log('[DG, HOTROAD & PT Patch] Starting patch...');

// Ensure PT images are in dist and dist_backup assets
const srcImg = path.join(__dirname, 'src/assets/images/hotroad_pt_icon_1792501490333.jpg');
const distImgPng = path.join(__dirname, 'dist/assets/provider_pt.png');
const distBackupImgPng = path.join(__dirname, 'dist_backup/assets/provider_pt.png');
const distImgJpg = path.join(__dirname, 'dist/assets/provider_pt.jpg');
const distBackupImgJpg = path.join(__dirname, 'dist_backup/assets/provider_pt.jpg');

[path.dirname(distImgPng), path.dirname(distBackupImgPng)].forEach(dir => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

if (fs.existsSync(srcImg)) {
  try {
    if (!fs.existsSync(distBackupImgPng)) fs.copyFileSync(srcImg, distBackupImgPng);
    if (!fs.existsSync(distImgPng)) fs.copyFileSync(srcImg, distImgPng);
    if (!fs.existsSync(distBackupImgJpg)) fs.copyFileSync(srcImg, distBackupImgJpg);
    if (!fs.existsSync(distImgJpg)) fs.copyFileSync(srcImg, distImgJpg);
  } catch (e) {}
}

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

const threeFaceD20Game = `{title:"DG Three Face D20",image:"https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhZ2bliaS4zCWOg-e4ataddbBDnE7w8jxUj0sbIGm7Y2WM5i7suY3n1Kkh_X6A-U2ZxyLKD9MXQ-GOgcUBQ1T2IBU3e4Vttz4paH0NdQ7pYADrIQ4vJtXowhZmGLcxiE73Vt8869h-lQ0qQMr3LMDrxprDiwE1YnbTMTua0OnREQ1-M9FQAAcBax4ot0DnU/s500/DREAMGAMING-LIVE-020.png",category:"DG"}`;
const threeCardD19Game = `{title:"DG ThreeCard D19",image:"https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgeQQ5XY0j9L1vOHo60-zWdxbI5cITTAyE6HyCM3WUtYy6HAcOHGg9YjdHR75Bar3M6EK6n69BQUKERDi1da4g73DVCpuOpXaEprl_3cjsfVSaR4csCW-Vx1_LMEqIJPD1rxoZ-cgTQXunoY_nvKr1oC1-JUc5pm24iEqcc0xPf6QFx9E7reTN1HLSxr8Kb/s500/DREAMGAMING-LIVE-019.png",category:"DG"}`;

const hotroadIcon = 'https://hotroadofficial.com/assets/footer/footericon.png';
const hotroadProviderItem = `{title:"HOTROAD",image:"${hotroadIcon}",category:"ক্যাসিনো",isHot:!1}`;
const ptProviderItem = `{title:"PT",image:"/assets/provider_pt.png",category:"ক্যাসিনো",isHot:!0}`;

const hotroadNaturalGame = `{title:"HOTROAD (Natural) Multi-Pay",image:"https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEguC7T5Eal_llcd_LvXRZgF0foBO8G-VwX4wQ9RcaHQMzbw7hR2yR3GytCaFciFhQDHjyQD1-aUZ6a14XyVhdHcLdKeizVFah8fRaOvbeRyKa6ibbKrwg0dsrrzi-4L78r9S06insNpQ_Ymo_jurAgBYFA0_3syK87VOe3tIGi0ugGrOHkXwKaqxjQAKloL/s500/HOTROAD-LIVE-015.png",category:"HOTROAD"}`;
const hotroadBaccaratGame = `{title:"HOTROAD BACCARAT",image:"https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEidfZaFV4NoShcpGCIavqXva6fDBPdrM3Ednpd905nc7NwX5Dlz2NzO9GbEsHCH0WluvjXZU0IKbd3WbmrVM6_Pz57zdayGtSL-L_hvhcuhgU8d9nqe-m6nHxZHawKl8jmPjEwPLR7XbzGq2anmeAfWC4EmgYPikyTTJdAMYd7wVpiVyoBUtM4-lE69MoZt/s279/HOTROAD-LIVE-001.png",category:"HOTROAD"}`;
const hotroadBigAndSmallGame = `{title:"HOTROAD Big And Small",image:"https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhjaCwzmC2VNAkhtad3JmgoxrHe5a0-vj1J7uuQhISqRn0X90FJJoGnYutPK74-8uQTg6yMUNcnCNlDZ-Yj5nNWrSvIw7RZktGUs3RKUb-mm6yIsZHuPzf9bsG5Dbe2rs3Ol8n6xaZz-3eHu_eKn1LUgO2qy096JphGHKnbdTHDrWm3HbMauBJpXgImLg8-/s500/HOTROAD-LIVE-018.png",category:"HOTROAD"}`;
const hotroadDragonTigerGame = `{title:"HOTROAD Dragon Tiger",image:"https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjGUm2nH4SITa7Di1EX04jcH5AYNnFIdfYAk5RSl6kZeo0pyvTK9HznkCPHw0yOhYWi0qLGs57LYBxMpzJdkW0seI6DZrBMGqGen9Pcn9i3caLZNyGBUFP-ptYS327avHovaoOzr3W1PQQEeWl5AJsyOWfE3T1d-42dItrYf8mLIUAaJwcnNRkYYYMg_T-l/s279/HOTROAD-LIVE-003.png",category:"HOTROAD"}`;
const hotroadHot7up7downGame = `{title:"HOTROAD HOT 7up 7down",image:"https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhVBXu-whodgwuoFUi7KpyhH5JxmMWwA7vnI5F95BkdD6LohoMONp8pdFfB8vpX9I-URKMpAmF52UxpCqKNXrC6E9DhQ1hrr0kkihiSOhwQ9r10H9kybGS55xg0rVqtqIr27TC3U8lxT3pjspeFyyuFRXBH1i3ZaMrxZeAs62nXagxCnci3GS2if0UDyCY9/s500/HOTROAD-LIVE-008.HOT%207UP%207DOWN.png",category:"HOTROAD"}`;
const hotroadHotBaccaratGame = `{title:"HOTROAD HOT Baccarat",image:"https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhNQOKT_SzmDLXieS4OpbkPGLIEHFRfqvRdHxm6f4jUS8fMczbSiCKFdQ5u_QFAaGZeG6LQqjT1BuwE0DjTq6bBdgRduTiqCoU5Z9gqENv3OG2do7iVwYDiiP6tszdst6WN8RmiMRjuzFU0lwPnUOPwBb3mMjPfCdJjE1UR0QdyPQQm9UOQAf_dAvoK8qDA/s500/HOTROAD-LIVE-007.png",category:"HOTROAD"}`;
const hotroadHotColorGame = `{title:"HOTROAD HOT COLOR GAME",image:"https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjt8ng_QkHdUJORb_eDWznzcEKS-W9nkdCMkSAFqZpxoYaEd_fuM9F84OC2eWmhMcCwGuN7yQ8rcBNtIlkkEG_p3Mfi9iCsVeignuaVJrLDJU3IntPZQBIDk6T79Xwa4kEvyOY79DzmwTjnCMvGHA4i69x6FI4OQKhpVTE76jElwK9uztHwzomAnYgjvmM_/s500/HOTROAD-LIVE-005.png",category:"HOTROAD"}`;
const hotroadHotSicboGame = `{title:"HOTROAD HOT SICBO",image:"https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEj9Q0C-f-G4eqNHq5IiZynwABsJkVd_9FEfOMX1rQsyYxGlm9B2ANEY2rVpOgoCnOB10_Rx11PLHiCg-spG47dlC-XJ-aq8Xv6drFLV_qWUOR77SCMVu9qYaZxlGaFT4fANncD8cCS4i5Gh2QRE611VuBEdbC9muQnNdt0HyfG1eFNVPPVxpszzFzZnvKGZ/s500/HOTROAD-LIVE-006.png",category:"HOTROAD"}`;
const hotroadHotGame = `{title:"HOTROAD HOT",image:"https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgy2vTeRorrKWB7mUStCX6CVycWbsneJOmspWVWX9htuxCNeZ8doBKPB_TaWZ4rcL-DvOPzCe0nhEjA0iFzjwlEehHZcWtBIempuNDBxGoJPndD6fYjllFFUTZNrbuCboZvSRSvATNZKWmmQ73dFwZWWzX2NyZwqJjV6GSRWe44SaGeiVC3sYnr4aiFddUB/s450/HOTROAD-LIVE-009.png",category:"HOTROAD"}`;
const hotroadLuckyGame = `{title:"HOTROAD Lucky",image:"https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEi-_DNUWGcDH2m_KFXaIqdpNJGXlz3sko5LuUNaHP1XuoPxm-_1so2LoAEQSDX22OaLEy0mN6eXi1QevN5Lci7KcOyiyhyphenhyphenjaKrTVP_qAncxTy24In_TQnooqoQkDyQvgzHHCGxHEtYRtzUp7_TzTM2D9OJS_wZB81JR0eMdKA3W6mTFm7Q2dRXx1mHk3Tmy/s500/HOTROAD-LIVE-013.LUCKY%207%20BACCARAT.png",category:"HOTROAD"}`;
const hotroadSpeedGame = `{title:"HOTROAD SPEED",image:"https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgkQzDS68prfr1xxsdACx7R2xltDLQGoR07bzdC2iBSWPZQR4w4Bp_UT2kaC9dR8l3j6_7tG_3d5rCn751es6BgOe5l6LwUCIC2_UWz6jZfLWFiqBj4arvumd6b4xdlApikfizHmO0G6ee0kodxdINTF6AnSjlUdGHzcTKibrQe2JrkfsChP2Y9aMxdGrph/s500/HOTROAD-LIVE-017.png",category:"HOTROAD"}`;
const hotroadThreeGame = `{title:"HOTROAD THREE",image:"https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEig3m_N_PxFOdINNB7PCmTGrgJQYGw31-ZN_QbIQWUMkdyF3bb4ldiIe0VzzLhtJS-ulKAFogBjEsu5Sbm_ZHH4lbk-nJ7NKg5R7MgeQxSA2q7mRcuXkypRRoIwf6NZzqNE6Zc6tQPvyqfODwLBpEk_UHS7wrpYVV8KE2zQOUlQcCYsrRUFpggHiPWcbGbA/s500/HOTROAD-LIVE-014.Three%20Card%20Poker.png",category:"HOTROAD"}`;
const hotroadTigerBaccaratGame = `{title:"HOTROAD TIGER BACCARAT",image:"https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEimmGLobvCtB0nDM9l9R1haVnKTwHKPF4t4pD_1k0Y1ojn41lU2WbK94GlQxavuEdNkAg5PPeCQSpju6ZPNv90wlSJMQWEpXIjNEJLhbXTJewKcBmDzcWM7lR1zAab-CLpfmFunTAK_OjO_vSjKyjsaunnihgBTNYmWuRwg5_kNjfzyOTosNKw5feefRHDZ/s350/HOTROAD-LIVE-011.TIGER%20BACCARAT.png",category:"HOTROAD"}`;
const hotroadXocDiaGame = `{title:"HOTROAD Xoc Dia",image:"https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhtjCduCMS18MCq-PAsDenQRj6vJZJemPP9W8yXi7Z3yI40Delvzk-8AHiF8edTTso-s0rlvx4AONmlqZfcoVEEeKH0lwlFrTizO9HAXVGKmMfPzOVcVs6ydS2EuGRVagP_h0i9h9P9amMNlFq2fp7JzRoC7jS7wDmc-STeIE14lylH7jwG_NS2KxHNpUq6/s500/HOTROAD-LIVE-010.png",category:"HOTROAD"}`;

const ptLobbyItem = `{title:"PT Game Lobby",image:"/assets/provider_pt.png",category:"PT"}`;

let updatedCount = 0;

targets.forEach(filePath => {
  if (!fs.existsSync(filePath)) return;
  let code = fs.readFileSync(filePath, 'utf8');
  let changed = false;

  // 1. DG ThreeCard D19
  if (!code.includes('DG ThreeCard D19')) {
    if (code.includes(threeFaceD20Game)) {
      code = code.replace(threeFaceD20Game, `${threeFaceD20Game},${threeCardD19Game}`);
      changed = true;
    } else {
      const threeFaceD20Regex = /\{title:"DG Three Face D20",image:"[^"]+",category:"DG"\}/;
      if (threeFaceD20Regex.test(code)) {
        code = code.replace(threeFaceD20Regex, (match) => `${match},${threeCardD19Game}`);
        changed = true;
      }
    }
  }

  // 2. HOTROAD Provider folder icon right after DG in category "ক্যাসিনো"
  const dgProviderRegex = /\{title:"DG",image:"[^"]+",category:"ক্যাসিনো",isHot:(!0|true|!1|false)\}/;
  if (!code.includes('{title:"HOTROAD",image:')) {
    if (dgProviderRegex.test(code)) {
      code = code.replace(dgProviderRegex, (match) => `${match},${hotroadProviderItem}`);
      changed = true;
    }
  }

  // 3. PT Provider folder icon right after HOTROAD in category "ক্যাসিনো"
  if (!code.includes('{title:"PT",image:')) {
    const hotroadCasinoRegex = /\{title:"HOTROAD",image:"[^"]+",category:"ক্যাসিনো",isHot:(!0|true|!1|false)\}/;
    if (hotroadCasinoRegex.test(code)) {
      code = code.replace(hotroadCasinoRegex, (match) => `${match},${ptProviderItem}`);
      changed = true;
      console.log(`[PT Provider] Added PT folder icon after HOTROAD in ${path.basename(filePath)}`);
    }
  }
  // 4. HOTROAD (Natural) Multi-Pay item inside HOTROAD category
  if (code.includes('{title:"HOTROAD Game Lobby"')) {
    const lobbyRegex = /\{title:"HOTROAD Game Lobby",image:"[^"]+",category:"HOTROAD"\}/;
    code = code.replace(lobbyRegex, hotroadNaturalGame);
    changed = true;
  } else if (!code.includes('HOTROAD (Natural) Multi-Pay')) {
    const dgLobbyRegex = /\{title:"DG Game Lobby",image:"[^"]+",category:"DG"\}/;
    if (dgLobbyRegex.test(code)) {
      code = code.replace(dgLobbyRegex, (match) => `${match},${hotroadNaturalGame}`);
      changed = true;
    }
  }

  // 5. HOTROAD BACCARAT
  if (!code.includes('HOTROAD BACCARAT')) {
    if (code.includes(hotroadNaturalGame)) {
      code = code.replace(hotroadNaturalGame, `${hotroadNaturalGame},${hotroadBaccaratGame}`);
      changed = true;
    }
  }

  // 6. HOTROAD Big And Small
  if (!code.includes('HOTROAD Big And Small')) {
    if (code.includes(hotroadBaccaratGame)) {
      code = code.replace(hotroadBaccaratGame, `${hotroadBaccaratGame},${hotroadBigAndSmallGame}`);
      changed = true;
    }
  }

  // 7. HOTROAD Dragon Tiger
  if (!code.includes('HOTROAD Dragon Tiger')) {
    if (code.includes(hotroadBigAndSmallGame)) {
      code = code.replace(hotroadBigAndSmallGame, `${hotroadBigAndSmallGame},${hotroadDragonTigerGame}`);
      changed = true;
    }
  }

  // 8. HOTROAD HOT 7up 7down
  if (!code.includes('HOTROAD HOT 7up 7down')) {
    if (code.includes(hotroadDragonTigerGame)) {
      code = code.replace(hotroadDragonTigerGame, `${hotroadDragonTigerGame},${hotroadHot7up7downGame}`);
      changed = true;
    }
  }

  // 9. HOTROAD HOT Baccarat
  if (!code.includes('HOTROAD HOT Baccarat')) {
    if (code.includes(hotroadHot7up7downGame)) {
      code = code.replace(hotroadHot7up7downGame, `${hotroadHot7up7downGame},${hotroadHotBaccaratGame}`);
      changed = true;
    }
  }

  // 10. HOTROAD HOT COLOR GAME
  if (!code.includes('HOTROAD HOT COLOR GAME')) {
    if (code.includes(hotroadHotBaccaratGame)) {
      code = code.replace(hotroadHotBaccaratGame, `${hotroadHotBaccaratGame},${hotroadHotColorGame}`);
      changed = true;
    }
  }

  // 11. HOTROAD HOT SICBO
  if (!code.includes('HOTROAD HOT SICBO')) {
    if (code.includes(hotroadHotColorGame)) {
      code = code.replace(hotroadHotColorGame, `${hotroadHotColorGame},${hotroadHotSicboGame}`);
      changed = true;
    }
  }

  // 12. HOTROAD HOT
  if (!code.includes('HOTROAD HOT",image:')) {
    if (code.includes(hotroadHotSicboGame)) {
      code = code.replace(hotroadHotSicboGame, `${hotroadHotSicboGame},${hotroadHotGame}`);
      changed = true;
    }
  }

  // 13. HOTROAD Lucky
  if (!code.includes('HOTROAD Lucky')) {
    if (code.includes(hotroadHotGame)) {
      code = code.replace(hotroadHotGame, `${hotroadHotGame},${hotroadLuckyGame}`);
      changed = true;
    }
  }

  // 14. HOTROAD SPEED
  if (!code.includes('HOTROAD SPEED')) {
    if (code.includes(hotroadLuckyGame)) {
      code = code.replace(hotroadLuckyGame, `${hotroadLuckyGame},${hotroadSpeedGame}`);
      changed = true;
    }
  }

  // 15. HOTROAD THREE
  if (!code.includes('HOTROAD THREE')) {
    if (code.includes(hotroadSpeedGame)) {
      code = code.replace(hotroadSpeedGame, `${hotroadSpeedGame},${hotroadThreeGame}`);
      changed = true;
    }
  }

  // 16. HOTROAD TIGER BACCARAT
  if (!code.includes('HOTROAD TIGER BACCARAT')) {
    if (code.includes(hotroadThreeGame)) {
      code = code.replace(hotroadThreeGame, `${hotroadThreeGame},${hotroadTigerBaccaratGame}`);
      changed = true;
    }
  }

  // 17. HOTROAD Xoc Dia
  if (!code.includes('HOTROAD Xoc Dia')) {
    if (code.includes(hotroadTigerBaccaratGame)) {
      code = code.replace(hotroadTigerBaccaratGame, `${hotroadTigerBaccaratGame},${hotroadXocDiaGame}`);
      changed = true;
    }
  }

  // 18. PT Game Lobby in category "PT"
  if (!code.includes('category:"PT"')) {
    if (code.includes(hotroadXocDiaGame)) {
      code = code.replace(hotroadXocDiaGame, `${hotroadXocDiaGame},${ptLobbyItem}`);
      changed = true;
      console.log(`[PT Provider] Added PT Game Lobby in ${path.basename(filePath)}`);
    } else if (code.includes(hotroadTigerBaccaratGame)) {
      code = code.replace(hotroadTigerBaccaratGame, `${hotroadTigerBaccaratGame},${ptLobbyItem}`);
      changed = true;
    }
  }

  // 19. Click handlers for HOTROAD and PT
  if (!code.includes('if(E==="HOTROAD"){wr("HOTROAD");return}')) {
    const clickDg = 'if(E==="DG"){wr("DG");return}';
    if (code.includes(clickDg)) {
      code = code.replace(clickDg, `${clickDg}if(E==="HOTROAD"){wr("HOTROAD");return}`);
      changed = true;
    }
  }
  if (!code.includes('if(E==="PT"){wr("PT");return}')) {
    const clickHotroad = 'if(E==="HOTROAD"){wr("HOTROAD");return}';
    if (code.includes(clickHotroad)) {
      code = code.replace(clickHotroad, `${clickHotroad}if(E==="PT"){wr("PT");return}`);
      changed = true;
      console.log(`[PT Provider] Added PT click handler in ${path.basename(filePath)}`);
    }
  }

  // 20. Clean and unified Tt conditions
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

  if (changed) {
    fs.writeFileSync(filePath, code, 'utf8');
    updatedCount++;
  }
});

console.log(`[DG, HOTROAD & PT Patch] Completed! Updated ${updatedCount} files.`);
