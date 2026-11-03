const fs = require('fs');
const path = require('path');

console.log('[Crash AVIATOR Patch] Starting comprehensive AVIATOR folder & game patch...');

const aviatorFolderIcon = 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgH0YR5LiIg87XHNLnRDzuQd0CIuLXXmzCRb9kwC20-d39yKye-Qk5P_SeeKyPybUhFOGGgMAcKG75RMOJlmEpJ5X2fUK7gJPyYsah2DJTouA7typnmR9QmK-5k3sLLt6NLI1YoziUA-TnYLttAtSH0mjukhtevNpf8s1fIJE8AIZj74Frs8FbTtJMM9sFA/s120/provider-awcv2_spribe.png';
const aviatorGamePoster = 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgxsYBYFOtvCQctwjjj4vv79pcgx-Dnsiz9k9h_wQzxvYyMFBj-CcTPUalx0nZ8gEn05mWeAVVobwKoQwO-qXw1EY5wnIoXrPJxkRAQ77QSBLpkN9f0c-ihUOFs7s-wsrfVM1I-H33QMt8SdqpiAwa03d8ftxQ8Z4zT1yDpp8jROvBylcJEq680AjtqC7sS/s554/images%20(5).jpeg';

// The folder only appears in the "ক্র্যাশ" category (isHot: !1 ensures it does NOT spill into "জনপ্রিয়"/Hot)
const aviatorFolderItem = `{title:"AVIATOR",image:"${aviatorFolderIcon}",category:"ক্র্যাশ",isHot:!1}`;

// The actual Aviator airplane game
const aviatorGameItem = `{title:"Aviator",image:"${aviatorGamePoster}",category:"ক্র্যাশ",isHot:!0}`;

const jsTargets = [
  path.join(__dirname, 'dist/assets/index-sn777-v12.js'),
  path.join(__dirname, 'dist_backup/assets/index-sn777-v12.js'),
  path.join(__dirname, 'original-index-sn777-v5.js')
];

jsTargets.forEach(filePath => {
  if (!fs.existsSync(filePath)) return;
  let code = fs.readFileSync(filePath, 'utf8');
  let changed = false;

  // 1. Ensure BOTH the folder (only in ক্র্যাশ, isHot:!1) and the original Aviator game (isHot:!0) exist
  const bothItems = `${aviatorFolderItem},${aviatorGameItem}`;

  // If already both exist in current format, verify isHot:!1 for the folder
  if (code.includes('title:"AVIATOR"') && code.includes('title:"Aviator"')) {
    const aviatorFolderRegex = /\{title:"AVIATOR",image:"[^"]+",category:"ক্র্যাশ",isHot:[^}]+\}/;
    if (aviatorFolderRegex.test(code)) {
      code = code.replace(aviatorFolderRegex, aviatorFolderItem);
      changed = true;
      console.log(`[Crash AVIATOR Patch] Verified AVIATOR folder isHot:!1 in ${path.basename(filePath)}`);
    }
    const aviatorGameRegex = /\{title:"Aviator",image:"[^"]+",category:"ক্র্যাশ",isHot:[^}]+\}/;
    if (aviatorGameRegex.test(code)) {
      code = code.replace(aviatorGameRegex, aviatorGameItem);
      changed = true;
      console.log(`[Crash AVIATOR Patch] Verified Aviator game item in ${path.basename(filePath)}`);
    }
  } else if (code.includes('title:"AVIATOR"')) {
    // Only AVIATOR exists, replace it with folder + restored Aviator game
    const aviatorOnlyRegex = /\{title:"AVIATOR",image:"[^"]+",category:"ক্র্যাশ",isHot:[^}]+\}/;
    if (aviatorOnlyRegex.test(code)) {
      code = code.replace(aviatorOnlyRegex, bothItems);
      changed = true;
      console.log(`[Crash AVIATOR Patch] Restored Aviator game and kept AVIATOR folder in ${path.basename(filePath)}`);
    }
  } else if (code.includes('title:"Aviator"')) {
    // Only Aviator exists, replace it with folder + Aviator game
    const aviatorOnlyRegex = /\{title:"Aviator",image:"[^"]+",category:"ক্র্যাশ",isHot:[^}]+\}/;
    if (aviatorOnlyRegex.test(code)) {
      code = code.replace(aviatorOnlyRegex, bothItems);
      changed = true;
      console.log(`[Crash AVIATOR Patch] Added AVIATOR folder and kept Aviator game in ${path.basename(filePath)}`);
    }
  }

  // 2. AVIATOR is a FOLDER (not a direct game launch). Remove E==="AVIATOR" from game launcher so it triggers folder rules
  const aviatorLaunchRegex = /if\s*\(\s*E\s*===\s*["']Aviator["']\s*\|\|\s*E\s*===\s*["']AVIATOR["']\s*\|\|\s*E\s*===\s*["']Crash["']\s*\)\s*\{[^}]*return;?\s*\}/;
  if (aviatorLaunchRegex.test(code)) {
    code = code.replace(
      aviatorLaunchRegex,
      'if(E==="Aviator"||E==="Crash"){ E==="Aviator"?Hr(!0):Nr(!0); return; }'
    );
    changed = true;
    console.log(`[Crash AVIATOR Patch] Removed AVIATOR from direct game launch in ${path.basename(filePath)}`);
  }

  // Ensure AVIATOR is in the folder rules check (alongside JILI, FC, PP, etc.)
  if (code.includes('||E==="HABANERO"') && !code.includes('||E==="AVIATOR")')) {
    code = code.replace('||E==="HABANERO")', '||E==="HABANERO"||E==="AVIATOR")');
    changed = true;
    console.log(`[Crash AVIATOR Patch] Added AVIATOR to provider folder rules in ${path.basename(filePath)}`);
  }

  if (changed) {
    fs.writeFileSync(filePath, code, 'utf8');
  }
});

// 3. Update Cache-busting version in HTML files
const newVersion = '20261101_crash_aviator_v2';
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
    console.log(`[Crash AVIATOR Patch] Updated script version in ${path.basename(f)} to ${newVersion}`);
  }
});

// 4. Update Cache Name in Service Worker files
const newCacheName = 'sn777-v56';
const swFiles = [
  path.join(__dirname, 'sw.js'),
  path.join(__dirname, 'public/sw.js'),
  path.join(__dirname, 'dist/sw.js')
];

swFiles.forEach(f => {
  if (fs.existsSync(f)) {
    let content = fs.readFileSync(f, 'utf8');
    content = content.replace(/const CACHE_NAME = "sn777-v[0-9]+";/, `const CACHE_NAME = "${newCacheName}";`);
    if (f.endsWith('sw.js') && !content.includes(aviatorFolderIcon)) {
      content = content.replace(/const CORE_ASSETS = \[/, `const CORE_ASSETS = [\n  "${aviatorFolderIcon}",`);
    }
    fs.writeFileSync(f, content, 'utf8');
    console.log(`[Crash AVIATOR Patch] Updated cache name in ${f} to ${newCacheName}`);
  }
});

console.log('[Crash AVIATOR Patch] Completed successfully!');
