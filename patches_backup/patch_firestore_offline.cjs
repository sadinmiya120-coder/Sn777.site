const fs = require("fs");
const esbuild = require("esbuild");
const jsFiles = [
  "dist/assets/index-sn777-v12.js",
  "dist_backup/assets/index-sn777-v12.js",
  "public/assets/index-sn777-v12.js",
  "original-index-sn777-v5.js"
];

jsFiles.forEach(filePath => {
  if (!fs.existsSync(filePath)) return;
  let code = fs.readFileSync(filePath, "utf8");

  // 1. Fix Firestore initialization: use auto-detect long polling rather than forcing long polling
  code = code.replace(
    /IR\(\$R,\{experimentalForceLongPolling:!0\}\)/g,
    'IR($R,{experimentalAutoDetectLongPolling:!0})'
  );

  // 2. Silence OnlineStateTracker offline warning
  const targetPattern = /la\(e\)\{const t=`Could not reach Cloud Firestore backend\.[^`]+`;this\.aa\?\(os\(t\),this\.aa=!1\):we\("OnlineStateTracker",t\)\}/g;
  if (targetPattern.test(code)) {
    code = code.replace(targetPattern, "la(e){this.aa=!1;return}");
    console.log(`[${filePath}] Silenced Firestore backend offline log.`);
  }

  try {
    esbuild.transformSync(code, { loader: "js" });
    fs.writeFileSync(filePath, code, "utf8");
    console.log(`[${filePath}] Successfully patched Firestore connection settings.`);
  } catch (err) {
    console.error(`[${filePath}] Syntax Error:`, err.message);
  }
});
