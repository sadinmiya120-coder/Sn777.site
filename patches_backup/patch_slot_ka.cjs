const fs = require('fs');
const path = require('path');

console.log('[Slot KA Patch] Starting comprehensive KA patch...');

const kaIcon = 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEitM4XGbCyhebfMqXQfCR0NfDW9AV7K_O_NRpdNy0TMfQ9Iu81i0mN6qAL09mlkwOqSHEI673JfMFfNHw8UZam7JAfbkEyh1oiOi8EJknLC7aY1nFV65RXfMihqX3oc3jTyCmx0qHXOGPcSHaCcIZnkuGoX8gwUeXZu20sImJ4hWoMPrcrKVV0siPvQtlKt/s120/provider-ka.png';

const kaProviderItem = `{title:"KA",image:"${kaIcon}",category:"স্লট",isHot:!1}`;

const kaSlotGames = [
  `{title:"KA Fortune",image:"${kaIcon}",category:"KA",isHot:!1}`,
  `{title:"KA Deluxe",image:"${kaIcon}",category:"KA",isHot:!1}`
];

const jsTargets = [
  path.join(__dirname, 'dist/assets/index-sn777-v12.js'),
  path.join(__dirname, 'dist_backup/assets/index-sn777-v12.js'),
  path.join(__dirname, 'original-index-sn777-v5.js')
];

jsTargets.forEach(filePath => {
  if (!fs.existsSync(filePath)) return;
  let code = fs.readFileSync(filePath, 'utf8');
  let changed = false;

  // 1. Ensure KA provider folder in category "স্লট"
  const kaRegex = /\{title:"KA",image:"[^"]+",category:"স্লট",isHot:[^}]+\}/;
  if (kaRegex.test(code)) {
    code = code.replace(kaRegex, kaProviderItem);
    changed = true;
    console.log(`[Slot KA Patch] Verified/Updated KA slot folder in ${path.basename(filePath)}`);
  } else {
    const jokerRegex = /\{title:"JOKER",image:"[^"]+",category:"স্লট",isHot:[^}]+\}/;
    if (jokerRegex.test(code)) {
      code = code.replace(jokerRegex, (match) => `${match},${kaProviderItem}`);
      changed = true;
      console.log(`[Slot KA Patch] Added KA slot folder after JOKER in ${path.basename(filePath)}`);
    } else {
      const injoyRegex = /\{title:"INJOY",image:"[^"]+",category:"স্লট",isHot:[^}]+\}/;
      if (injoyRegex.test(code)) {
        code = code.replace(injoyRegex, (match) => `${match},${kaProviderItem}`);
        changed = true;
        console.log(`[Slot KA Patch] Added KA slot folder after INJOY in ${path.basename(filePath)}`);
      }
    }
  }

  // 2. Direct rules / folder click check for KA
  if (!code.includes('E==="KA"')) {
    if (code.includes('E==="JOKER")')) {
      code = code.replace(/E==="JOKER"\)/g, 'E==="JOKER"||E==="KA")');
      changed = true;
      console.log(`[Slot KA Patch] Added KA to provider rules check after JOKER in ${path.basename(filePath)}`);
    } else if (code.includes('E==="INJOY")')) {
      code = code.replace(/E==="INJOY"\)/g, 'E==="INJOY"||E==="KA")');
      changed = true;
      console.log(`[Slot KA Patch] Added KA to provider rules check after INJOY in ${path.basename(filePath)}`);
    }
  }

  // 3. Add KA games if not present
  if (!code.includes('category:"KA"')) {
    const jokerGameRegex = /\{title:"Joker Fortune"[^}]+\}/;
    if (jokerGameRegex.test(code)) {
      code = code.replace(jokerGameRegex, match => `${match},${kaSlotGames.join(',')}`);
      changed = true;
      console.log(`[Slot KA Patch] Added KA slot games after JOKER in ${path.basename(filePath)}`);
    } else {
      const injoyGameRegex = /\{title:"INJOY Fortune"[^}]+\}/;
      if (injoyGameRegex.test(code)) {
        code = code.replace(injoyGameRegex, match => `${match},${kaSlotGames.join(',')}`);
        changed = true;
        console.log(`[Slot KA Patch] Added KA slot games after INJOY in ${path.basename(filePath)}`);
      }
    }
  }

  if (changed) {
    fs.writeFileSync(filePath, code, 'utf8');
  }
});

// 4. Update Cache-busting version in HTML files
const newVersion = '20261101_slot_ka_v1';
const htmlFiles = [
  path.join(__dirname, 'index.html'),
  path.join(__dirname, 'dist/index.html'),
  path.join(__dirname, 'dist_backup/index.html')
];

htmlFiles.forEach(f => {
  if (fs.existsSync(f)) {
    let content = fs.readFileSync(f, 'utf8');
    content = content.replace(/index-sn777-v12\.js\?v=[a-zA-Z0-9_-]+/g, `index-sn777-v12.js?v=${newVersion}`);
    content = content.replace(/var APP_VER = "[^"]+";/, `var APP_VER = "${newVersion}";`);
    fs.writeFileSync(f, content, 'utf8');
    console.log(`[Slot KA Patch] Updated script version in ${path.basename(f)} to ${newVersion}`);
  }
});

// 5. Update Cache Name in Service Worker files
const newCacheName = 'sn777-v51';
const swFiles = [
  path.join(__dirname, 'sw.js'),
  path.join(__dirname, 'public/sw.js'),
  path.join(__dirname, 'dist/sw.js')
];

swFiles.forEach(f => {
  if (fs.existsSync(f)) {
    let content = fs.readFileSync(f, 'utf8');
    content = content.replace(/const CACHE_NAME = "sn777-v[0-9]+";/, `const CACHE_NAME = "${newCacheName}";`);
    if (f.endsWith('sw.js') && !content.includes(kaIcon)) {
      content = content.replace(/const CORE_ASSETS = \[/, `const CORE_ASSETS = [\n  "${kaIcon}",`);
    }
    fs.writeFileSync(f, content, 'utf8');
    console.log(`[Slot KA Patch] Updated cache name in ${f} to ${newCacheName}`);
  }
});

console.log('[Slot KA Patch] Completed successfully!');
