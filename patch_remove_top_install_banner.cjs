const fs = require("fs");
const esbuild = require("esbuild");

const files = ["dist/assets/index-sn777-v10.js", "dist_backup/assets/index-sn777-v10.js"];

for (const file of files) {
  if (!fs.existsSync(file)) continue;
  let code = fs.readFileSync(file, "utf8");
  let modified = false;

  // Replace [At,ze]=R.useState(...)
  const targetState = `[He,Pe]=R.useState(!1),[At,ze]=R.useState(!window.matchMedia("(display-mode: standalone)").matches)`;
  const replaceState = `[He,Pe]=R.useState(!1),[At,ze]=R.useState(!1)`;

  if (code.includes(targetState)) {
    code = code.replace(targetState, replaceState);
    modified = true;
  }

  // Replace header top-[64px]
  if (code.includes("${At?\"top-[64px]\":\"top-0\"}")) {
    code = code.replaceAll("${At?\"top-[64px]\":\"top-0\"}", "top-0");
    modified = true;
  }

  // Remove top banner JSX
  const bannerPos = code.indexOf("এখনি Sn777.top অ্যাপ ইন্সটল");
  if (bannerPos !== -1) {
    const startIdx = code.lastIndexOf("At&&o.jsxs(\"div\",{className:\"flex items-center justify-between bg-[#e5e5e5]", bannerPos);
    const endIdx = code.indexOf("children:\"ইন্সটল\"})})]}),", bannerPos) + "children:\"ইন্সটল\"})})]}),".length;
    if (startIdx !== -1 && endIdx !== -1) {
      const targetBanner = code.substring(startIdx, endIdx);
      code = code.replace(targetBanner, "null,");
      modified = true;
    }
  }

  if (modified) {
    try {
      esbuild.transformSync(code, { loader: "js" });
      fs.writeFileSync(file, code, "utf8");
      console.log(`[patch_remove_top_install_banner] Validated and wrote ${file}`);
    } catch (err) {
      console.error(`[patch_remove_top_install_banner] Error patching ${file}:`, err.message);
    }
  }
}
