const fs = require('fs');
const path = require('path');

console.log('[Patch] Re-correcting JILI games table patch safely...');

const jiliIcon = 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjTjrqbBrMwileUvFPyFyvMCkCjV-O8nkMbJyP_9hEAR40ILnjbUiBhFIAOwP2zBFR59pVwprRTpejwJaASfKqx8xWqzt2R-XknWjhYtGUz5MZAvYLB96Pp9b7AZ8qxX2iCo7bJasPA-stIDbQBk9_vbBvtD4N1urpud_SND-xuyIhSoTzyZIriVSJvpz6x/s256/images%20(22).jpeg';

const jiliTableGames = [
  '{title:"Super Ace (Table)",image:"' + jiliIcon + '",category:"টেবিল",isHot:!1}',
  '{title:"Golden Empire (Table)",image:"' + jiliIcon + '",category:"টেবিল",isHot:!1}'
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

  // Cleanup: Remove existing JILI table games to re-add them cleanly
  code = code.replace(/\{title:"Super Ace \(Table\)",[^}]+(?=,|\})/g, '');
  code = code.replace(/\{title:"Golden Empire \(Table\)",[^}]+(?=,|\})/g, '');
  
  // Clean up commas caused by deletions
  code = code.replace(/,\s*,\s*/g, ',');
  code = code.replace(/,\s*\}/g, '}');

  // Ensure JILI games are present in the টেবিল category
  jiliTableGames.forEach(g => {
    // Look for last item in table category and append
    const tableCategoryRegex = /(category:"টেবিল",isHot:!1\})/g;
    if (tableCategoryRegex.test(code)) {
        code = code.replace(tableCategoryRegex, (match) => `${match},${g}`);
        changed = true;
    }
  });

  if (changed) {
    fs.writeFileSync(filePath, code, 'utf8');
    console.log(`[Patch] Saved safest changes to ${path.basename(filePath)}`);
  }
});

console.log('[Patch] JILI table games patch corrected successfully!');
