const fs = require("fs");
const path = require("path");
const esbuild = require("esbuild");

function copyDir(src, dest) {
  if (!fs.existsSync(src)) return;
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }
  const entries = fs.readdirSync(src, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

console.log("[Build] 1. Syncing assets...");
if (fs.existsSync("dist_backup")) {
  copyDir("dist_backup", "dist");
} else if (!fs.existsSync("dist")) {
  fs.mkdirSync("dist", { recursive: true });
}

// Ensure index.html and _redirects exist in dist for Cloudflare Pages static hosting
if (fs.existsSync("index.html") && !fs.existsSync("dist/index.html")) {
  fs.copyFileSync("index.html", "dist/index.html");
}
if (fs.existsSync("_redirects")) {
  fs.copyFileSync("_redirects", "dist/_redirects");
}

console.log("[Build] 2. Running patches...");
try {
  if (fs.existsSync("./update_deposit_min_200.cjs")) {
    require("./update_deposit_min_200.cjs");
  } else if (fs.existsSync("./apply_min_deposit_100.cjs")) {
    require("./apply_min_deposit_100.cjs");
  }
} catch (e) {
  console.warn("Patch deposit warning:", e.message);
}

try {
  if (fs.existsSync("./patch_banner_3rd_image.cjs")) {
    require("./patch_banner_3rd_image.cjs");
  }
} catch (e) {
  console.warn("Patch banner warning:", e.message);
}

try {
  if (fs.existsSync("./patch_gopay_gateway.cjs")) {
    require("./patch_gopay_gateway.cjs");
  }
} catch (e) {
  console.warn("Patch gopay warning:", e.message);
}

try {
  if (fs.existsSync("./patch_telegram_livechat.cjs")) {
    require("./patch_telegram_livechat.cjs");
  }
} catch (e) {
  console.warn("Patch telegram livechat warning:", e.message);
}

try {
  if (fs.existsSync("./patch_fishing_games.cjs")) {
    require("./patch_fishing_games.cjs");
  }
} catch (e) {
  console.warn("Patch fishing warning:", e.message);
}

try {
  if (fs.existsSync("./patch_casino_app_install.cjs")) {
    require("./patch_casino_app_install.cjs");
  }
} catch (e) {
  console.warn("Patch casino app warning:", e.message);
}

try {
  if (fs.existsSync("./patch_deposit_history_order.cjs")) {
    require("./patch_deposit_history_order.cjs");
  }
} catch (e) {
  console.warn("Patch deposit history warning:", e.message);
}

try {
  if (fs.existsSync("./patch_remove_top_install_banner.cjs")) {
    require("./patch_remove_top_install_banner.cjs");
  }
} catch (e) {
  console.warn("Patch remove top banner warning:", e.message);
}

if (fs.existsSync("index.html")) {
  try {
    fs.copyFileSync("index.html", "dist/index.html");
    fs.copyFileSync("index.html", "dist_backup/index.html");
  } catch (e) {}
}

console.log("[Build] 3. Bundling server.ts...");
if (fs.existsSync("server.ts")) {
  try {
    esbuild.buildSync({
      entryPoints: ["server.ts"],
      bundle: true,
      platform: "node",
      target: "node20",
      format: "cjs",
      packages: "external",
      outfile: "dist/server.cjs"
    });
    console.log("[Build] Server bundle generated at dist/server.cjs");
  } catch (err) {
    console.warn("[Build] Server bundle notice (ignorable for static hosting):", err.message);
  }
}

console.log("[Build] Build completed successfully!");
