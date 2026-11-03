const fs = require("fs");
const path = require("path");
const esbuild = require("esbuild");

console.log("[Repair Syntax Patch] Starting repair...");

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

  // Repair Fix 1: Registration catch else (remove extra brace)
  const regBad = `:Fe("রেজিস্ট্রেশন ব্যর্থ হয়েছে: "+ee.message),Je(!0)}}else`;
  const regRepair = `:Fe("রেজিস্ট্রেশন ব্যর্থ হয়েছে: "+ee.message),Je(!0)}else`;
  if (code.includes(regBad)) {
    code = code.replace(regBad, regRepair);
    modified = true;
  }

  // Repair Fix 3: Comma sequence before jc=async()
  // Revert ';const jc=async' back to ',jc=async'
  const seqBad = `};const jc=async()=>`;
  const seqRepair = `},jc=async()=>`;
  if (code.includes(seqBad)) {
    code = code.replace(seqBad, seqRepair);
    modified = true;
  }

  if (modified) {
    fs.writeFileSync(filePath, code, "utf8");
    console.log(`[Repair Syntax Patch] Repaired ${path.basename(filePath)}`);
  }

  // Validate syntax
  try {
    esbuild.transformSync(code, { loader: "js" });
    console.log(`[VALIDATED OK] ${path.basename(filePath)} has 0 syntax errors!`);
  } catch (err) {
    console.error(`[VALIDATION ERROR] in ${path.basename(filePath)}:`, err.message);
  }
});

console.log("[Repair Syntax Patch] Completed successfully!");
