const fs = require("fs");
const esbuild = require("esbuild");

const filesToPatch = [
  "dist_backup/assets/index-sn777-v10.js",
  "dist_backup/assets/index-sn777-v9.js",
  "dist_backup/assets/index-sn777-v8.js",
  "dist_backup/assets/index-sn777-v7.js",
  "dist_backup/assets/index-sn777-v6.js",
  "dist_backup/assets/index-sn777-v5.js",
  "dist/assets/index-sn777-v10.js",
  "dist/assets/index-sn777-v9.js",
  "dist/assets/index-sn777-v8.js",
  "dist/assets/index-sn777-v7.js",
  "dist/assets/index-sn777-v6.js",
  "dist/assets/index-sn777-v5.js"
];

const imgNew = "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjQ_2GwdZzW2jPu6xtLZkJyGAt_8dHQr1_SEuwbbKrA-GHAkw4sljk7Wl7Bx9tXWF3Irr3zSpLW7hZrtuFaDBFObxrka93NWhtIejRqYsLKEVqmnKL346jkOM_qhyphenhypheneqsmRbTwj-JcctKz8gF-5VOVahb1vkiycuxmGUiVD_taYsJo6Hlxa9VdvIVeSR62bb/s1376/1790349046802.jpg";
const img1 = "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhVJcdFfqcPHmU_Gk6ebyWSLhFqbNlCZ3PURSlbZZPg7071Zjhp1oTL4P_6qLfXbfa6Z8EOmtIhPdnz7qxrRqJ7Vk-f6_w6gSLJTUM3ddpY4i0cpAKIQlQyOhBlvxHC0R2LW7OhzEN0yeu3xu32d7bMXtWMC-pxD5iBMIQMv6krx1Ys5Y-WdjOWuL91prg/s1408/IMG-20260703-WA0001.jpg";
const img2 = "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgTm5yxmmWUiX0xKpsVTypLUkh-ku1kN48zx16mbRDJn0cjIjrfoH2shep1f6rMFHuDih5vsn-IKVp2w3KzExnZMw7nqYjuR3J_yFlEwKV7-udeCs84s8EOlSyziC7Cl3Vl2hFntEo0kZ8zTT5ROtJDxouzR_CgZp7tyus-6s_VFsuUHkdSQwGmEqNxiw4/s1550/1783144937372.png";

// The desired 1st position banner array:
const targetBannerArray = `["${imgNew}","${img1}","${img2}"]`;

filesToPatch.forEach(filePath => {
  if (!fs.existsSync(filePath)) {
    return;
  }

  let code = fs.readFileSync(filePath, "utf8");
  let modified = false;

  // Replace any version of the banner array with the targetBannerArray
  const pattern1 = `["${img1}","${img2}","${imgNew}"]`;
  const pattern2 = `["${img1}","${img2}"]`;

  if (code.includes(pattern1)) {
    code = code.replace(pattern1, targetBannerArray);
    modified = true;
  } else if (code.includes(pattern2)) {
    code = code.replace(pattern2, targetBannerArray);
    modified = true;
  }

  if (modified) {
    try {
      esbuild.transformSync(code, { loader: "js" });
      fs.writeFileSync(filePath, code, "utf8");
      console.log(`[Banner Patch] Successfully updated banner order in ${filePath}`);
    } catch (err) {
      console.error(`[Banner Patch] Syntax error in ${filePath}:`, err);
    }
  }
});

console.log("[Banner Patch] Completed!");
