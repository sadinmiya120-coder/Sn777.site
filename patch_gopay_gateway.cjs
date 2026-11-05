const fs = require("fs");
const path = require("path");
const esbuild = require("esbuild");

const filesToPatch = [
  "dist/assets/index-sn777-v12.js",
  "dist_backup/assets/index-sn777-v12.js",
  "public/assets/index-sn777-v12.js"
];

// New deposit handler (Kr)
const newKrFunction = `Kr=async()=>{
  window._sn777_dep_submitting=!1;
  const _effUid=(gt.currentUser&&gt.currentUser.uid)||(typeof ve!=="undefined"&&ve&&(ve.id||ve.uid))||(window.__sn777_user_profile&&(window.__sn777_user_profile.uid||window.__sn777_user_profile.id))||localStorage.getItem("sn777_user_id")||localStorage.getItem("sn777_username")||"";
  if(!_effUid){
    Fe("অনুগ্রহ করে প্রথমে লগইন করুন।");
    Je(!0);
    return;
  }
  const E=parseInt(Is||"0");
  if(E < 200){
    Fe("সর্বনিম্ন ডিপোজিট ২০০ টাকা।");
    Je(!0);
    return;
  }
  if(!Be){
    Fe("অনুগ্রহ করে একটি মেথড নির্বাচন করুন।");
    Je(!0);
    return;
  }
  xe(!0);
  window._sn777_dep_submitting=!0;
  setTimeout(()=>{try{window._sn777_dep_submitting=!1;xe(!1)}catch(e){}},3000);
  
  const Te="ORD"+Date.now();
  const _uName=(typeof ve!=="undefined"&&ve&&(ve.username||ve.name))||(gt.currentUser&&(gt.currentUser.displayName||gt.currentUser.email))||localStorage.getItem("sn777_username")||"User";
  
  // Use new integration script
  const _gopayUrl="/gopay_integration.php?uid="+encodeURIComponent(_effUid)+"&username="+encodeURIComponent(_uName)+"&amount="+encodeURIComponent(E)+"&method="+encodeURIComponent(Be);
  
  try{
    window.location.href=_gopayUrl;
  }catch(e){
    window.location.href=_gopayUrl;
  }
},[zs,lo]`;

for (const relPath of filesToPatch) {
  const filePath = path.join(__dirname, relPath);
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, "utf8");
    const krRegex = /Kr\s*=\s*async\s*\(\)\s*=>\s*\{[\s\S]*?\}\s*,\s*\[zs\s*,\s*lo\]/;
    if (krRegex.test(content)) {
      content = content.replace(krRegex, newKrFunction);
      esbuild.transformSync(content, { loader: "js" });
      fs.writeFileSync(filePath, content, "utf8");
      console.log(`[GoPay Patch] Replaced Kr deposit handler in ${relPath}`);
    }
  }
}
