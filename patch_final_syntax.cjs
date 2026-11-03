const fs = require("fs");
const path = require("path");
const esbuild = require("esbuild");

console.log("[Final Syntax Patch] Starting final syntax repair...");

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

  // Final fix for comma before jc
  // Try changing `,jc=async` to `;jc=async`
  const seqBad = `,jc=async`;
  const seqRepair = `;jc=async`;
  if (code.includes(seqBad)) {
    code = code.replace(seqBad, seqRepair);
    modified = true;
  }

  if (modified) {
    fs.writeFileSync(filePath, code, "utf8");
    console.log(`[Final Syntax Patch] Repaired ${path.basename(filePath)}`);
  }

  // Validate syntax
  try {
    esbuild.transformSync(code, { loader: "js" });
    console.log(`[VALIDATED OK] ${path.basename(filePath)} has 0 syntax errors!`);
  } catch (err) {
    console.error(`[VALIDATION ERROR] in ${path.basename(filePath)}:`, err.message);
  }
});

console.log("[Final Syntax Patch] Completed successfully!");
