const fs = require("fs");
const esbuild = require("esbuild");

const files = [
  "dist/assets/index-sn777-v10.js",
  "dist_backup/assets/index-sn777-v10.js",
  "dist/assets/index-sn777-v9.js",
  "dist_backup/assets/index-sn777-v9.js",
  "dist/assets/index-sn777-v8.js",
  "dist_backup/assets/index-sn777-v8.js",
  "dist/assets/index-sn777-v7.js",
  "dist_backup/assets/index-sn777-v7.js",
  "dist/assets/index-sn777-v6.js",
  "dist_backup/assets/index-sn777-v6.js",
  "dist/assets/index-sn777-v5.js",
  "dist_backup/assets/index-sn777-v5.js"
];

for (const file of files) {
  if (!fs.existsSync(file)) continue;

  let code = fs.readFileSync(file, "utf8");

  // Ensure window._lastDeposit variables & showSnDepositModal are called on submit
  const targetPattern = `catch(_e){}to(!0)}Zs(""),Tr(!1),Xt("")`;
  const replacement = `catch(_e){}try{if(typeof window!=="undefined"&&typeof window.showSnDepositModal==="function"){window.showSnDepositModal((typeof window!=="undefined"&&window._lastDepositOrderId)||Oi||("ORD"+Date.now()),(typeof window!=="undefined"&&window._lastDepositTrxId)||oi||"",(typeof window!=="undefined"&&window._lastDepositAmount)||jt||parseFloat(Is||ys||"0"),(typeof window!=="undefined"&&window._lastDepositMethod)||Be)}}catch(_err){}to(!0)}Zs(""),Tr(!1),Xt("")`;

  if (code.includes(targetPattern) && !code.includes("window.showSnDepositModal")) {
    code = code.replace(targetPattern, replacement);
  }

  try {
    esbuild.transformSync(code, { loader: "js" });
    fs.writeFileSync(file, code, "utf8");
    console.log(`[Tx Modal Patch] Successfully validated and updated ${file}`);
  } catch (e) {
    console.error(`[Tx Modal Patch] Error in ${file}:`, e.message);
  }
}

console.log("[Tx Modal Patch] Done!");
