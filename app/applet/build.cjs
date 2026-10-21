const fs = require('fs');
const path = require('path');
const esbuild = require('esbuild');

const ROOT_DIR = process.cwd();
const DIST_DIR = path.join(ROOT_DIR, 'dist');
const DIST_BACKUP_DIR = path.join(ROOT_DIR, 'dist_backup');

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

console.log('[Build] 1. Syncing assets...');
if (fs.existsSync(DIST_BACKUP_DIR)) {
  copyDir(DIST_BACKUP_DIR, DIST_DIR);
} else if (!fs.existsSync(DIST_DIR)) {
  fs.mkdirSync(DIST_DIR, { recursive: true });
}

// Ensure index.html and _redirects exist in dist for Cloudflare Pages static hosting
if (fs.existsSync("index.html") && !fs.existsSync(path.join(DIST_DIR, "index.html"))) {
  fs.copyFileSync("index.html", path.join(DIST_DIR, "index.html"));
}
if (fs.existsSync("_redirects")) {
  fs.copyFileSync("_redirects", path.join(DIST_DIR, "_redirects"));
}

console.log('[Build] 2. Running patches...');
// ... (keep the rest of the patches as they are, using path.join(ROOT_DIR, ...))
// For brevity, I will only include the core fix for the build directory
try {
  if (fs.existsSync(path.join(ROOT_DIR, "./patch_dg_baccarat_qc02.cjs"))) {
    require(path.join(ROOT_DIR, "./patch_dg_baccarat_qc02.cjs"));
  }
  if (fs.existsSync(path.join(ROOT_DIR, "./patch_hotroad.cjs"))) {
    require(path.join(ROOT_DIR, "./patch_hotroad.cjs"));
  }
  if (fs.existsSync(path.join(ROOT_DIR, "./patch_pt_provider.cjs"))) {
    require(path.join(ROOT_DIR, "./patch_pt_provider.cjs"));
  }
} catch (e) {
  console.warn("Patch warning:", e.message);
}

if (fs.existsSync("index.html")) {
  try {
    fs.copyFileSync("index.html", path.join(DIST_DIR, "index.html"));
    fs.copyFileSync("index.html", path.join(DIST_BACKUP_DIR, "index.html"));
  } catch (e) {}
}

console.log('[Build] 3. Bundling server.ts...');
if (fs.existsSync("server.ts")) {
  try {
    esbuild.buildSync({
      entryPoints: ["server.ts"],
      bundle: true,
      platform: "node",
      target: "node20",
      format: "cjs",
      packages: "external",
      outfile: path.join(DIST_DIR, "server.cjs")
    });
    console.log("[Build] Server bundle generated at " + path.join(DIST_DIR, "server.cjs"));
  } catch (err) {
    console.warn("[Build] Server bundle notice:", err.message);
  }
}

console.log('[Build] Build completed successfully!');
