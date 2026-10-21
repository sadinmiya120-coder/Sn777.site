const fs = require('fs');
const path = require('path');

console.log('[PT Full Fix] Starting PT folder & icon fix...');

// 1. Assets sync
const srcJpg = path.join(__dirname, 'src/assets/images/hotroad_pt_icon_1792501490333.jpg');
const distPng = path.join(__dirname, 'dist/assets/provider_pt.png');
const distBackupPng = path.join(__dirname, 'dist_backup/assets/provider_pt.png');
const distJpg = path.join(__dirname, 'dist/assets/provider_pt.jpg');
const distBackupJpg = path.join(__dirname, 'dist_backup/assets/provider_pt.jpg');
const publicPng = path.join(__dirname, 'public/assets/provider_pt.png');

[
  path.dirname(distPng),
  path.dirname(distBackupPng),
  path.dirname(publicPng)
].forEach(dir => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

if (fs.existsSync(srcJpg)) {
  try {
    fs.copyFileSync(srcJpg, distJpg);
    fs.copyFileSync(srcJpg, distBackupJpg);
  } catch (e) {}
}

if (fs.existsSync(distPng)) {
  try {
    fs.copyFileSync(distPng, distBackupPng);
    fs.copyFileSync(distPng, publicPng);
  } catch (e) {}
}

// 2. Cache-bust index.html files
const htmlFiles = [
  path.join(__dirname, 'index.html'),
  path.join(__dirname, 'dist/index.html'),
  path.join(__dirname, 'dist_backup/index.html')
];

htmlFiles.forEach(htmlPath => {
  if (!fs.existsSync(htmlPath)) return;
  let html = fs.readFileSync(htmlPath, 'utf8');
  if (html.includes('index-sn777-v10.js?v=')) {
    html = html.replace(/index-sn777-v10\.js\?v=[^"'\s]+/g, 'index-sn777-v10.js?v=20261021_pt_v10');
    fs.writeFileSync(htmlPath, html, 'utf8');
    console.log(`[PT Full Fix] Cache-busted script in ${path.basename(htmlPath)}`);
  }
});

// 3. Targets for JS bundle patches
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

const ptCasinoItem = `{title:"PT",image:"/assets/provider_pt.png",category:"ক্যাসিনো",isHot:!0}`;
const ptSlotItem = `{title:"PT",image:"/assets/provider_pt.png",category:"স্লট",isHot:!0}`;

const ptGames = [
  `{title:"PT Game Lobby",image:"/assets/provider_pt.png",category:"PT"}`,
  `{title:"PT Buffalo Blitz",image:"https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEiDnZkpYqwEk1-jxXApuur04c9Xku9k6xkW7ZqYjeD8apOawODZrJZyezdkRUBJVraaYRzr3W3y6tj5kbQRkpFhHaQue6R2cSFeKCyV8lBVxZKFI7t7_KNgwyAEWRdkqNWHTiEUwRZ1yI8CYWJSpY84MnYdcV-L2EX8EspattaZewYPlBnR0gZ9H3SQ6zDg/s512/com.fufafa.jogo.superace.ace.free.games.icon.2024-06-15-05-57-29.png",category:"PT"}`,
  `{title:"PT Age of the Gods",image:"https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgCAfKpW7GvtcwGo5WQru5TGiNRIH9l0ZeH4WUaUkjEC4j9ks8K1Rk8GaqvqW52Jq-gs5j4XRQ5dCZMjgV2p5NhgMv7dc5b1OqyDziTnt1-2n9JEVXudQvz7nHyYyNXStyKzuxJdgi7YPHbuU4E41Z_CL8Lm2XZj3tpa3-h-zBbRt7Xgv8AkVdN9g6MKuZr/s425/images%20(19).jpeg",category:"PT"}`,
  `{title:"PT Great Blue",image:"https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhfWL1oXVK-cXPNStj4_NPXCW_KM0f64f8QAKSbr10PoR74XR8O_s50sKpTZ7Tsid_qkkFNHnl9aW9K2-Ncogso481X9XTTiCR8nd76nSL_oyL86BBvNsmmFBbim52HAPxKsNSs3aqcD1PPhmEDvPmrtm326-15qRoivyaydTKpMED6nlXuxh_Dvhx3WvNg/s120/lightIcon%20(9).webp",category:"PT"}`,
  `{title:"PT Highway Kings",image:"https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhrOcP39YtECViikHSp87p49UyiGzSTOzaBMT_itBirEQcrdbm6L32OM1oy2Ce-kz3BzwR9TiD98MiOXQxBkax544H_-O9Cb4DFC1R1G_cd3M_QQdEwr76MPTmWuYP_biycunQjQCZKbDrGOc4ToADk-lvRwrS_ZQz10E-wf6Q5sbX8MdemXKooq80P7YR9/s120/lightIcon%20(10).webp",category:"PT"}`,
  `{title:"PT Safari Heat",image:"https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhoTlILdIymPMEb13u6GWo55Ph1AYc9VdD7Uge3OyV7Uaxqf8sC13BIY4y-D3QuO5UpVU7bRYQmnv-SHqmfT8kg7NN4Op8HvONlwP66E80PTJMCbf4XU-c7RhxNfQWZ8wLYC59HXqkHCBYxG0Va6xBguhYJDn5TGnZrfsXEIDpdL5zpijKXqj8kURqAENlq/s120/lightIcon%20(2).webp",category:"PT"}`
].join(',');

let updatedCount = 0;

targets.forEach(filePath => {
  if (!fs.existsSync(filePath)) return;
  let code = fs.readFileSync(filePath, 'utf8');
  let changed = false;

  // A. Ensure PT is in category "ক্যাসিনো" and marked isHot:!0 (so it appears on Home Page & Casino)
  if (code.includes('{title:"PT",image:"/assets/provider_pt.png",category:"ক্যাসিনো",isHot:!1}')) {
    code = code.replace(
      '{title:"PT",image:"/assets/provider_pt.png",category:"ক্যাসিনো",isHot:!1}',
      ptCasinoItem
    );
    changed = true;
    console.log(`[PT Full Fix] Changed PT isHot to !0 in ${path.basename(filePath)}`);
  } else if (!code.includes('{title:"PT",image:"/assets/provider_pt.png",category:"ক্যাসিনো"')) {
    const hotroadProviderRegex = /\{title:"HOTROAD",image:"[^"]+",category:"ক্যাসিনো",isHot:(!0|true|!1|false)\}/;
    if (hotroadProviderRegex.test(code)) {
      code = code.replace(hotroadProviderRegex, (match) => `${match},${ptCasinoItem}`);
      changed = true;
      console.log(`[PT Full Fix] Added PT in category ক্যাসিনো in ${path.basename(filePath)}`);
    }
  }

  // B. Ensure PT is also in category "স্লট" so slot players see PT folder
  if (!code.includes('category:"স্লট",isHot:!0},{title:"PT"')) {
    const magicAceRegex = /\{title:"Magic Ace Wild Lock"[^}]+\}/;
    if (magicAceRegex.test(code) && !code.includes(`{title:"PT",image:"/assets/provider_pt.png",category:"স্লট"`)) {
      code = code.replace(magicAceRegex, (match) => `${match},${ptSlotItem}`);
      changed = true;
      console.log(`[PT Full Fix] Added PT in category স্লট in ${path.basename(filePath)}`);
    }
  }

  // C. Click handler
  if (!code.includes('if(E==="PT"){wr("PT");return}')) {
    const hotroadClick = 'if(E==="HOTROAD"){wr("HOTROAD");return}';
    if (code.includes(hotroadClick)) {
      code = code.replace(hotroadClick, `${hotroadClick}if(E==="PT"){wr("PT");return}`);
      changed = true;
      console.log(`[PT Full Fix] Added PT click handler in ${path.basename(filePath)}`);
    }
  }

  // D. PT Games in category "PT"
  if (code.includes('{title:"PT Game Lobby",image:"/assets/provider_pt.png",category:"PT"}')) {
    // Replace single lobby with full PT games list if not already expanded
    if (!code.includes('{title:"PT Buffalo Blitz"')) {
      code = code.replace(
        '{title:"PT Game Lobby",image:"/assets/provider_pt.png",category:"PT"}',
        ptGames
      );
      changed = true;
      console.log(`[PT Full Fix] Expanded PT games in ${path.basename(filePath)}`);
    }
  } else {
    // Insert after HOTROAD Xoc Dia
    const xocDiaGame = '{title:"HOTROAD Xoc Dia",image:"https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhtjCduCMS18MCq-PAsDenQRj6vJZJemPP9W8yXi7Z3yI40Delvzk-8AHiF8edTTso-s0rlvx4AONmlqZfcoVEEeKH0lwlFrTizO9HAXVGKmMfPzOVcVs6ydS2EuGRVagP_h0i9h9P9amMNlFq2fp7JzRoC7jS7wDmc-STeIE14lylH7jwG_NS2KxHNpUq6/s500/HOTROAD-LIVE-010.png",category:"HOTROAD"}';
    if (code.includes(xocDiaGame)) {
      code = code.replace(xocDiaGame, `${xocDiaGame},${ptGames}`);
      changed = true;
      console.log(`[PT Full Fix] Inserted PT games after Xoc Dia in ${path.basename(filePath)}`);
    }
  }

  // E. Tt grid checks
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

console.log(`[PT Full Fix] Completed! Updated ${updatedCount} files.`);
