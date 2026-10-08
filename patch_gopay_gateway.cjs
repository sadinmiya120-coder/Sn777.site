const fs = require("fs");
const path = require("path");
const vm = require("vm");

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

const exactOldSnippet = `try{const _gopayUrl=(window.BACKEND_API_BASE||"")+"/gopay_pay.php?uid="+encodeURIComponent((gt.currentUser?gt.currentUser.uid:(ve?(ve.id||ve.uid):"")||""))+"&amount="+encodeURIComponent(E)+"&method="+encodeURIComponent(Be)+"&goods_name="+encodeURIComponent(Be.toUpperCase())+"&order_no="+encodeURIComponent(Te);fetch(_gopayUrl,{headers:{Accept:"application/json"}}).then(r=>r.json()).then(d=>{if(d&&(d.redirect_url||d.payInfo)){window.location.assign(d.redirect_url||d.payInfo);}else{window.location.assign(_gopayUrl);}}).catch(()=>{window.location.assign(_gopayUrl);});window._sn777_dep_submitting=!1;xe(!1);fi("");}catch(e){window.location.assign("/gopay_pay.php?uid="+encodeURIComponent((gt.currentUser?gt.currentUser.uid:(ve?(ve.id||ve.uid):"")||""))+"&amount="+encodeURIComponent(E)+"&method="+encodeURIComponent(Be)+"&order_no="+encodeURIComponent(Te));}}`;

const exactBBaseSnippet = `try{const _bBase=(window.location.hostname==="localhost"||window.location.hostname==="127.0.0.1")?"":"";const _gopayUrl=_bBase+"/gopay_pay.php?uid="+encodeURIComponent((gt.currentUser?gt.currentUser.uid:(ve?(ve.id||ve.uid):"")||""))+"&amount="+encodeURIComponent(E)+"&method="+encodeURIComponent(Be)+"&goods_name="+encodeURIComponent(Be.toUpperCase())+"&order_no="+encodeURIComponent(Te);window._sn777_dep_submitting=!1;xe(!1);fi("");window.location.assign(_gopayUrl);}catch(e){const _bBase2=(window.location.hostname==="localhost"||window.location.hostname==="127.0.0.1")?"":"";window.location.assign(_bBase2+"/gopay_pay.php?uid="+encodeURIComponent((gt.currentUser?gt.currentUser.uid:(ve?(ve.id||ve.uid):"")||""))+"&amount="+encodeURIComponent(E)+"&method="+encodeURIComponent(Be)+"&order_no="+encodeURIComponent(Te));}}`;

const exactTargetSnippet = `try{const _gopayUrl="/gopay_pay.php?uid="+encodeURIComponent((gt.currentUser?gt.currentUser.uid:(ve?(ve.id||ve.uid):"")||""))+"&amount="+encodeURIComponent(E)+"&method="+encodeURIComponent(Be)+"&goods_name="+encodeURIComponent(Be.toUpperCase())+"&order_no="+encodeURIComponent(Te);window._sn777_dep_submitting=!1;xe(!1);fi("");window.location.assign(_gopayUrl);}catch(e){window.location.assign("/gopay_pay.php?uid="+encodeURIComponent((gt.currentUser?gt.currentUser.uid:(ve?(ve.id||ve.uid):"")||""))+"&amount="+encodeURIComponent(E)+"&method="+encodeURIComponent(Be)+"&order_no="+encodeURIComponent(Te));}}`;

const originalManualSnippet = `try{  window._sn777_dep_submitting=!1;  xe(!1);  qr(Te);  Ls(!0);}catch(e){}}`;

for (const filePath of filesToPatch) {
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, "utf8");
    let changed = false;

    if (content.includes(exactBBaseSnippet)) {
      content = content.replace(exactBBaseSnippet, exactTargetSnippet);
      changed = true;
    }

    if (content.includes(exactOldSnippet)) {
      content = content.replace(exactOldSnippet, exactTargetSnippet);
      changed = true;
    }

    if (content.includes(originalManualSnippet)) {
      content = content.replace(originalManualSnippet, exactTargetSnippet);
      changed = true;
    }

    // Ensure gateway is gopay
    if (content.includes('gateway:"manual",senderNumber:"Manual"')) {
      content = content.replace(/gateway:"manual",senderNumber:"Manual"/g, 'gateway:"gopay",senderNumber:""');
      changed = true;
    }

    // Verify syntax using Node vm
    try {
      new vm.Script(content);
      if (changed) {
        fs.writeFileSync(filePath, content, "utf8");
        console.log(`[GoPay Patch] Successfully updated and verified ${filePath}`);
      }
    } catch (e) {
      console.error(`[GoPay Patch] Syntax validation error on ${filePath}: ${e.message}`);
    }
  }
}

// Make sure v10 exists in backup
const v9PathBackup = "dist_backup/assets/index-sn777-v9.js";
const v10PathBackup = "dist_backup/assets/index-sn777-v10.js";
if (fs.existsSync(v9PathBackup)) {
  fs.copyFileSync(v9PathBackup, v10PathBackup);
  console.log(`[GoPay Patch] Synced ${v10PathBackup}`);
}

// Update script tag in index.html in dist_backup and dist
const htmlFiles = ["dist_backup/index.html", "dist/index.html"];
for (const htmlFile of htmlFiles) {
  if (fs.existsSync(htmlFile)) {
    let html = fs.readFileSync(htmlFile, "utf8");
    let changed = false;
    
    // Replace script src to v10 with cache-busting timestamp
    if (html.includes("index-sn777-v9.js")) {
      html = html.replace(/\/assets\/index-sn777-v9\.js(\?[^"]*)?/g, "/assets/index-sn777-v10.js?v=20260925_gopay");
      changed = true;
    }
    
    if (changed) {
      fs.writeFileSync(htmlFile, html, "utf8");
      console.log(`[GoPay Patch] Updated script tag in ${htmlFile}`);
    }
  }
}

// Sync dist_backup to dist
if (fs.existsSync("dist_backup")) {
  if (!fs.existsSync("dist")) {
    fs.mkdirSync("dist", { recursive: true });
  }
  fs.cpSync("dist_backup", "dist", { recursive: true });
  console.log("[GoPay Patch] Synced dist_backup to dist successfully.");
}
