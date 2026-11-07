const fs = require('fs');
const path = require('path');

console.log('[Game Order Patch] Starting safe game sequencing patch...');

const targets = [
  path.join(__dirname, 'dist_backup/assets/index-sn777-v10.js'),
  path.join(__dirname, 'dist/assets/index-sn777-v10.js')
];

const aviatorGame = {
  title: "Aviator",
  image: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgxsYBYFOtvCQctwjjj4vv79pcgx-Dnsiz9k9h_wQzxvYyMFBj-CcTPUalx0nZ8gEn05mWeAVVobwKoQwO-qXw1EY5wnIoXrPJxkRAQ77QSBLpkN9f0c-ihUOFs7s-wsrfVM1I-H33QMt8SdqpiAwa03d8ftxQ8Z4zT1yDpp8jROvBylcJEq680AjtqC7sS/s554/images%20(5).jpeg",
  category: "ক্র্যাশ",
  isHot: true
};

const crashGame = {
  title: "Crash",
  image: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgAOKNUFq_8aXlR-0tsKxFaNoXJDJ0bm_noJoKTk1TT3CKE2y7CvDj4N9rf7zszlIDdYQlLskhjBk2cidZR-r58n6CiEVsHWPEzQSaVO73CckBy5xpPrwJ6V3tyvS9wEhxtA2oQ-IJng1GEXE2bTO5dpGpnuHNemUAzpx-om6g3l239hx16qZgybwQJRH9z/s447/images%20(6).jpeg",
  category: "ক্র্যাশ",
  isHot: true
};

const crazyTimeGame = {
  title: "Crazy Time",
  image: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEixWzxDauUd7BITjj2eGys3DLGZeBCYzni5tI2vn7FDIIwHUfhI2kLokOc3d1wbTuI0wVvfrhJEBO16PPC3MHT_-j1HOaJ4JPHVMzm-g_wPSEAf7Qj08t_XiMlhp1AEe7mIgH2d-Y1OTtMP02Y7SWyskYqcjuX4ZNEjlNu7mLAGXk8wtNPs2FjO7cKelCyZ/s297/Gallery_1776501161180.png",
  category: "হট গেম",
  isHot: true
};

const iceFishingGame = {
  title: "Ice Fishing",
  image: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjY1cgXbt5salki8dJ5DplKc7b4ljlhKZ0jfrpPppm4bbBBwVXY9IWVxr70g-OCkHLjN7Wxa0UGaTG7A9QaOyewXz0-mQfQQ3r11cYCEo8bUfDEP8TuLViUEq1KTMimIGOhH5AUia5KRtyNv3gUfHeqYo1mtMcFs3DXm8Kagk5x4gHGp1EdlJPltlwSHevK/s312/Gallery_1776505134330.png",
  category: "ফিশিং",
  isHot: true
};

const dummyTitles = ["Mega Fishing", "Happy Fishing", "Cai Shen Fishing", "Dragon Fortune", "Jackpot Fishing", "Fishing War", "Fishing God"];

targets.forEach(filePath => {
  if (!fs.existsSync(filePath)) return;
  let code = fs.readFileSync(filePath, 'utf8');

  // If Yz is missing in file, restore base from v5 backup first
  if (!code.includes('Yz=[') || !code.includes('...Yz')) {
    console.log(`[Game Order Patch] Restoring base structure for ${filePath}`);
    const v5 = fs.readFileSync(path.join(__dirname, 'dist_backup/assets/index-sn777-v5.js'), 'utf8');
    code = v5;
  }

  const startWz = code.indexOf('Wz=[');
  if (startWz === -1) return;
  const endWz = code.indexOf('],Yz=[', startWz);
  if (endWz === -1) return;

  const wzArrayString = code.slice(startWz + 4, endWz); // games inside Wz
  const itemRegex = /\{title:"([^"]+)",image:"([^"]+)",category:"([^"]+)"(?:,isHot:(!0|true|!1|false))?\}/g;
  let m;
  const otherGames = [];
  const seenKeys = new Set();
  
  seenKeys.add("Aviator|ক্র্যাশ");
  seenKeys.add("Crash|ক্র্যাশ");
  seenKeys.add("Crazy Time|হট গেম");
  seenKeys.add("Ice Fishing|ফিশিং");

  while ((m = itemRegex.exec(wzArrayString)) !== null) {
    const title = m[1];
    const image = m[2];
    const category = m[3];
    const isHot = m[4] === '!0' || m[4] === 'true';

    if (dummyTitles.includes(title)) continue;
    if (title === "Aviator" && category === "ক্র্যাশ") continue;
    if (title === "Crash" && category === "ক্র্যাশ") continue;
    if (title === "Crazy Time" && category === "হট গেম") continue;
    if (title === "Ice Fishing" && category === "ফিশিং") continue;

    const key = `${title}|${category}`;
    if (!seenKeys.has(key)) {
      seenKeys.add(key);
      otherGames.push({ title, image, category, isHot });
    }
  }

  // Exact 4 games in order
  const orderedList = [
    aviatorGame,
    crashGame,
    crazyTimeGame,
    iceFishingGame,
    ...otherGames
  ];

  const newWzJson = orderedList.map(g => 
    `{title:"${g.title}",image:"${g.image}",category:"${g.category}",isHot:${g.isHot ? '!0' : '!1'}}`
  ).join(',');

  code = code.slice(0, startWz) + `Wz=[${newWzJson}` + code.slice(endWz);

  // Ensure filter matches fishing category
  if (!code.includes('(E.category===Tt||(Tt==="ফিশিং"&&/fish/i.test(E.title)))')) {
    code = code.replace('E.category===Tt', '(E.category===Tt||(Tt==="ফিশিং"&&/fish/i.test(E.title)))');
  }

  fs.writeFileSync(filePath, code, 'utf8');
  console.log(`[Game Order Patch] Successfully applied exact sequence to ${filePath} with Yz fully intact!`);
});

console.log('[Game Order Patch] Finished successfully!');
