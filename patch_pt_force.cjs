const fs = require('fs');
const path = require('path');

console.log('[PT Force Patch] Running...');
const targets = [
  path.join(__dirname, 'dist/assets/index-sn777-v10.js'),
  path.join(__dirname, 'dist_backup/assets/index-sn777-v10.js')
];

const ptCasinoItem = `{title:"PT",image:"/assets/provider_pt.png",category:"ক্যাসিনো",isHot:!0}`;

targets.forEach(filePath => {
  if (!fs.existsSync(filePath)) return;
  let code = fs.readFileSync(filePath, 'utf8');
  if (!code.includes('{title:"PT",image:"/assets/provider_pt.png",category:"ক্যাসিনো"')) {
    const hotroadRegex = /\{title:"HOTROAD",image:"[^"]+",category:"ক্যাসিনো",isHot:(!0|true|!1|false)\}/;
    if (hotroadRegex.test(code)) {
      code = code.replace(hotroadRegex, match => `${match},${ptCasinoItem}`);
      fs.writeFileSync(filePath, code, 'utf8');
      console.log(`[PT Force Patch] Added PT in ক্যাসিনো to ${path.basename(filePath)}`);
    }
  }
});
console.log('[PT Force Patch] Done.');
