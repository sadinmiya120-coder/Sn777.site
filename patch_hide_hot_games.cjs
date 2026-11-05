const fs = require("fs");
const path = require("path");

console.log("[Hide Hot Games Patch] Starting permanent patch...");

const targets = [
  "dist/assets/index-sn777-v12.js",
  "dist_backup/assets/index-sn777-v12.js",
  "original-index-sn777-v5.js",
  "public/assets/index-sn777-v12.js"
];

// Titles of games/folders that must be hidden ONLY from Hot games permanently
const titlesToHideFromHot = [
  "Acewin Fortune",
  "BTG Bonanza",
  "CG Fortune",
  "Dragoonsoft Fortune",
  "GTF Fortune",
  "AVIATOR2",
  "CRASH88",
  "Hacksaw Fortune",
  "Kingmaker Fortune",
  "Microslot Fortune",
  "Mimi Fortune",
  "Netent Starburst",
  "NLC Fortune",
  "Octoplay Fortune",
  "P8 Fortune",
  "Playstar Fortune",
  "PT Fortune",
  "Relax Fortune",
  "RT Fortune",
  "Yggdrasil Fortune",
  "YL Fortune",
  "CQ9 Fortune",
  "INJOY Fortune",
  "Joker Fortune",
  "KA Fortune",
  "INJOY Deluxe",
  "CQ9 Deluxe",
  "YL Deluxe",
  "Yggdrasil Deluxe",
  "RT Deluxe",
  "Relax Deluxe",
  "PT Deluxe",
  "Playstar Deluxe",
  "P8 Deluxe",
  "Octoplay Deluxe",
  "NLC Deluxe",
  "Netent Gonzo",
  "Mimi Deluxe",
  "Microslot Deluxe",
  "Kingmaker Deluxe",
  "Hacksaw Deluxe",
  "GTF Deluxe",
  "Dragoonsoft Deluxe",
  "CG Deluxe",
  "BTG Extra Chilli",
  "MAHA Fortune",
  "Worldmatch Fortune",
  "Habanero Fortune",
  "Habanero Deluxe",
  "Worldmatch Deluxe",
  "MAHA Deluxe",
  "KA Deluxe",
  "Joker Deluxe",
  "Acewin Deluxe"
];

targets.forEach(filePath => {
  if (!fs.existsSync(filePath)) return;
  let code = fs.readFileSync(filePath, "utf8");
  let modified = false;

  titlesToHideFromHot.forEach(title => {
    // Regex matches {title:"TITLE", ... isHot:!0} or {title:"TITLE", ... isHot:true}
    const regex = new RegExp(`(\\{title:"${title}",[^}]*?)isHot:(?:!0|true)`, 'g');
    if (regex.test(code)) {
      code = code.replace(regex, '$1isHot:!1');
      modified = true;
      console.log(`[Hide Hot Games Patch] Hidden "${title}" from Hot games in ${path.basename(filePath)}`);
    }
  });

  if (modified) {
    fs.writeFileSync(filePath, code, "utf8");
  }
});

console.log("[Hide Hot Games Patch] Completed successfully!");
