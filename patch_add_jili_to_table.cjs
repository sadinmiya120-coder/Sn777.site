const fs = require('fs');
const path = require('path');

console.log('[Patch] Adding JILI games to টেবিল category...');

const jiliIcon = 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjTjrqbBrMwileUvFPyFyvMCkCjV-O8nkMbJyP_9hEAR40ILnjbUiBhFIAOwP2zBFR59pVwprRTpejwJaASfKqx8xWqzt2R-XknWjhYtGUz5MZAvYLB96Pp9b7AZ8qxX2iCo7bJasPA-stIDbQBk9_vbBvtD4N1urpud_SND-xuyIhSoTzyZIriVSJvpz6x/s256/images%20(22).jpeg';

const jiliTableGames = [
  `{title:"Super Ace (Table)",image:"${jiliIcon}",category:"টেবিল",isHot:!1}`,
  `{title:"Golden Empire (Table)",image:"${jiliIcon}",category:"টেবিল",isHot:!1}`
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

  // Add JILI games to টেবিল category if not present
  jiliTableGames.forEach(g => {
    if (!code.includes(g)) {
        // Find existing table games to append after
        const tableGamesRegex = /category:"টেবিল"/;
        if (tableGamesRegex.test(code)) {
            code = code.replace(tableGamesRegex, (match) => `${match}},${g},{title:"`); // Simple append
            changed = true;
        } else {
            // If no table games, just add them
            code = code.replace(/category:"আর্কেড"/, (match) => `${match}},${jiliTableGames.join(',')},{title:"`);
            changed = true;
        }
    }
  });

  if (changed) {
    fs.writeFileSync(filePath, code, 'utf8');
    console.log(`[Patch] Saved changes to ${path.basename(filePath)}`);
  }
});

console.log('[Patch] Added JILI games to টেবিল category successfully!');
