const fs = require('fs');
const path = require('path');

const targets = [
  path.join(__dirname, 'dist_backup/assets/index-sn777-v10.js'),
  path.join(__dirname, 'dist/assets/index-sn777-v10.js')
];

const ppItem = '{title:"PP",image:"https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEiMPZWLFyD6YlVWO4bmuZXAxlCYR8pjpFZHlqviWga8hDmHzZwLiaSt6FeiGbfDwQxVXO34aqc-cHN9KqGfgSKbcyt-ehIM8mniu9AdsRpPfyemOXN__7WFexeZGgtHPp4wVtduP_xKX6xDnB25i4wyXbSNBhxEczajBFOnaGElEspurSpxOCgdfAGGpasr/s120/provider-awcv2_pp%20(1).png",category:"স্লট",isHot:!0}';

targets.forEach(filePath => {
  if (!fs.existsSync(filePath)) return;
  let code = fs.readFileSync(filePath, 'utf8');
  
  // Search for the FC object in the slot category and add PP after it
  const fcRegex = /\{title:"FC"[^}]+\}/;
  if (code.includes('category:"স্লট"') && fcRegex.test(code) && !code.includes('{title:"PP"')) {
    code = code.replace(fcRegex, (match) => `${match},${ppItem}`);
    fs.writeFileSync(filePath, code, 'utf8');
    console.log(`[Patch] Added PP after FC in ${path.basename(filePath)}`);
  }
});
