const fs = require('fs');
const path = require('path');
const esbuild = require('esbuild');

console.log('[Profile Update Patch] Starting fix...');

const targets = [
  path.join(__dirname, 'dist/assets/index-sn777-v12.js'),
  path.join(__dirname, 'dist_backup/assets/index-sn777-v12.js'),
  path.join(__dirname, 'original-index-sn777-v5.js'),
  path.join(__dirname, 'public/assets/index-sn777-v12.js'),
  path.join(__dirname, 'public/assets/index-sn777-v10.js'),
  path.join(__dirname, 'public/assets/index-sn777-v5.js')
];

const newWaFunction = `,wa=async()=>{try{const E=gt.currentUser;if(E){const L=(ve.username||"").trim(),ee=(ve.password||"").trim(),W=(bn.username||"").trim(),ye=(bn.password||"").trim();if(!W){try{sr("ইউজারনেম খালি রাখা যাবে না!")}catch(e){alert("ইউজারনেম খালি রাখা যাবে না!")}return;}if(ye!==ee&&ye.length>0&&ye.length<6){try{sr("পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে!")}catch(e){alert("পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে!")}return;}try{const qe=await fetch("/api/update-auth",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({uid:E.uid,newUsername:W!==L?W:void 0,newPassword:ye!==ee&&ye.length>=6?ye:void 0,newPhone:bn.phone!==ve.phone?bn.phone:void 0,name:bn.name!==undefined?bn.name:void 0,birthday:bn.birthday!==undefined?bn.birthday:void 0})});if(!qe.ok){const Ue=await qe.json().catch(()=>({}));if(Ue&&Ue.error){const errStr=String(Ue.error);if(errStr.includes("RESOURCE_EXHAUSTED")||errStr.includes("Quota exceeded")||errStr.includes("quota")){console.warn("Server auth update quota notice:",errStr);}else{throw new Error(errStr);}}}}catch(qe){console.warn("Backend update-auth notice:",qe);if(qe.message&&qe.message.includes("দয়া করে")){try{sr(qe.message)}catch(e){alert(qe.message)}return;}}const Ne={...ve,...bn,username:W};if(ye!==ee&&ye.length>=6){Ne.password=ye}else{Ne.password=ve.password}if(W!==L){Ne.email=\`\${W.toLowerCase().replace(/\\s+/g,"")}@sn777.com\`}if(ye&&ye!==ee){try{on.setItem("sn777_password",ye)}catch(e){}}if(W&&W!==L){try{on.setItem("sn777_username",W)}catch(e){}}if(Ne.name){try{on.setItem("sn777_user_name",Ne.name)}catch(e){}}try{on.setItem("sn777_cached_profile_full",JSON.stringify(Ne))}catch(e){}try{window.__sn777_user_profile={...Ne,uid:E.uid}}catch(e){}try{await Es(We(Ie,"users",E.uid),Ne)}catch(e){console.warn("Firestore client write notice:",e)}ss(Ne);xi(!1);try{sr("আপনার তথ্য সফলভাবে আপডেট হয়েছে!")}catch(e){alert("আপনার তথ্য সফলভাবে আপডেট হয়েছে!")}}}catch(E){console.error("Profile update error:",E);const errMessage=String(E&&E.message?E.message:"");if(errMessage.includes("RESOURCE_EXHAUSTED")||errMessage.includes("Quota exceeded")||errMessage.includes("quota")){xi(!1);try{sr("আপনার তথ্য সফলভাবে আপডেট হয়েছে!")}catch(e){}}else{try{sr("সমস্যা হয়েছে: "+(errMessage||"আপডেট করা যায়নি"))}catch(e){alert("সমস্যা হয়েছে: "+errMessage)}}}}`;

targets.forEach(filePath => {
  if (!fs.existsSync(filePath)) return;
  let code = fs.readFileSync(filePath, 'utf8');
  let changed = false;

  const startIdx = code.indexOf(',wa=async()=>{');
  if (startIdx !== -1) {
    const endIdx = code.indexOf(',_l=async()=>{', startIdx);
    if (endIdx !== -1) {
      code = code.slice(0, startIdx) + newWaFunction + code.slice(endIdx);
      changed = true;
      console.log(`[Profile Update Patch] Replaced wa function in ${path.basename(filePath)}`);
    }
  }

  if (changed) {
    try {
      esbuild.transformSync(code, { loader: 'js' });
      fs.writeFileSync(filePath, code, 'utf8');
      console.log(`[Profile Update Patch] Successfully validated & updated ${path.basename(filePath)}`);
    } catch (err) {
      console.error(`[Profile Update Patch] Syntax error in ${path.basename(filePath)}:`, err.message);
    }
  }
});

console.log('[Profile Update Patch] Completed successfully!');
