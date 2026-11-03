const fs = require("fs");
const path = require("path");
const esbuild = require("esbuild");

console.log("[Fix All Syntax Errors Patch] Starting patch...");

const targets = [
  "dist/assets/index-sn777-v12.js",
  "dist_backup/assets/index-sn777-v12.js",
  "original-index-sn777-v5.js",
  "public/assets/index-sn777-v12.js"
];

targets.forEach(filePath => {
  if (!fs.existsSync(filePath)) return;
  let code = fs.readFileSync(filePath, "utf8");
  let modified = false;

  // Fix 1: Registration catch else structure
  const regOld = `:Fe("রেজিস্ট্রেশন ব্যর্থ হয়েছে: "+ee.message),Je(!0)}else Fe("`;
  const regNew = `:Fe("রেজিস্ট্রেশন ব্যর্থ হয়েছে: "+ee.message),Je(!0)}}else Fe("`;
  if (code.includes(regOld)) {
    code = code.replace(regOld, regNew);
    modified = true;
  }

  // Fix 2: Tawk.to dangling else block
  const tawkDangling = `default","_blank")}}else{window.open("https://t.me/sn777top","_blank")}`;
  const tawkClean = `default","_blank")}}`;
  if (code.includes(tawkDangling)) {
    code = code.replace(tawkDangling, tawkClean);
    modified = true;
  }

  // Fix 3: Comma sequence before jc=async()
  const seqOld = `,Je(!0)},jc=async()=>`;
  const seqNew = `,Je(!0)};const jc=async()=>`;
  if (code.includes(seqOld)) {
    code = code.replace(seqOld, seqNew);
    modified = true;
  }

  if (modified) {
    fs.writeFileSync(filePath, code, "utf8");
    console.log(`[Fix All Syntax Errors Patch] Updated ${path.basename(filePath)}`);
  }

  // Validate syntax
  try {
    esbuild.transformSync(code, { loader: "js" });
    console.log(`[VALIDATED OK] ${path.basename(filePath)} has 0 syntax errors!`);
  } catch (err) {
    console.error(`[VALIDATION ERROR] in ${path.basename(filePath)}:`, err.message);
  }
});

console.log("[Fix All Syntax Errors Patch] Completed successfully!");
