const fs = require("fs");
const path = require("path");

const filesToPatch = [
  "dist/assets/index-sn777-v12.js",
  "dist_backup/assets/index-sn777-v12.js",
  "public/assets/index-sn777-v12.js"
];

// 1. Strict bKash and Nagad methods only
const oldBiStart = 'Bi=[{id:"bkash",name:"বিকাশ",color:"#e2136e",logo:"https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEi4UEkhLBUdrPpR2LIahMVOX-QLJ1WG4J1qhr1UUXqDsJYu30zIBFnIuzxDCs5GXkxhvfbjYiiWUNi8hxAFjGCVyntU1_eJ0aGlAjBCPy_0sUgYbyViV9dinzv32zD9fJrdTHUv-sWXy-3AVQwxByAJYVKepxzGIOs6eri4O_UgKPUxSa5Gqkm_t4AbMuny/s554/images%20(18).jpeg"},{id:"nagad",name:"নগদ",color:"#f7941d",logo:"https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEi-QTVs9eBas6GpK2ydqhcGMQylNU_pN-s36BYRmohiHGhQ1WatvM-iqpa1sjGrZIMl2qw0UNhtBFMeNATQy3PJW5z8Eet99916DdaTFQ7fXTGyfEthPITh57pDMhcU4aPXAVvXwMNCmF_h5xSOBP_tRoUzfED_jRU-tzOU0vJx19y_FYAe6C-7Z_7ajilj/s447/images%20(1).png"},{id:"usdt"';
const newBi = 'Bi=[{id:"bkash",name:"বিকাশ",color:"#e2136e",logo:"https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEi4UEkhLBUdrPpR2LIahMVOX-QLJ1WG4J1qhr1UUXqDsJYu30zIBFnIuzxDCs5GXkxhvfbjYiiWUNi8hxAFjGCVyntU1_eJ0aGlAjBCPy_0sUgYbyViV9dinzv32zD9fJrdTHUv-sWXy-3AVQwxByAJYVKepxzGIOs6eri4O_UgKPUxSa5Gqkm_t4AbMuny/s554/images%20(18).jpeg"},{id:"nagad",name:"নগদ",color:"#f7941d",logo:"https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEi-QTVs9eBas6GpK2ydqhcGMQylNU_pN-s36BYRmohiHGhQ1WatvM-iqpa1sjGrZIMl2qw0UNhtBFMeNATQy3PJW5z8Eet99916DdaTFQ7fXTGyfEthPITh57pDMhcU4aPXAVvXwMNCmF_h5xSOBP_tRoUzfED_jRU-tzOU0vJx19y_FYAe6C-7Z_7ajilj/s447/images%20(1).png"}]';

// 2. Strict Quick Deposit Chips starting at 500 (matching GoPay single transaction limit)
const oldYa = 'ya=[{amount:"200",displayOrig:"200",total:"200",bonusPercent:""},{amount:"300",displayOrig:"300",total:"300",bonusPercent:""},{amount:"400",displayOrig:"400",total:"400",bonusPercent:""},{amount:"500",displayOrig:"500",total:"500",bonusPercent:""},{amount:"550",displayOrig:"550",total:"1,100",bonusPercent:"100%"},{amount:"1000",displayOrig:"1,000",total:"2,000",bonusPercent:"100%"},{amount:"2000",displayOrig:"2,000",total:"4,000",bonusPercent:"100%"},{amount:"5000",displayOrig:"5,000",total:"10,000",bonusPercent:"100%"},{amount:"10000",displayOrig:"10,000",total:"20,000",bonusPercent:"100%"},{amount:"15000",displayOrig:"15,000",total:"30,000",bonusPercent:"100%"},{amount:"20000",displayOrig:"20,000",total:"40,000",bonusPercent:"100%"},{amount:"25000",displayOrig:"25,000",total:"50,000",bonusPercent:"100%"}]';
const newYa = 'ya=[{amount:"500",displayOrig:"500",total:"500",bonusPercent:""},{amount:"1000",displayOrig:"1,000",total:"2,000",bonusPercent:"100%"},{amount:"2000",displayOrig:"2,000",total:"4,000",bonusPercent:"100%"},{amount:"5000",displayOrig:"5,000",total:"10,000",bonusPercent:"100%"},{amount:"10000",displayOrig:"10,000",total:"20,000",bonusPercent:"100%"},{amount:"15000",displayOrig:"15,000",total:"30,000",bonusPercent:"100%"},{amount:"20000",displayOrig:"20,000",total:"40,000",bonusPercent:"100%"},{amount:"25000",displayOrig:"25,000",total:"50,000",bonusPercent:"100%"}]';

// 3. Deposit Submit button handler (Kr)
const newKrFunction = `Kr=async()=>{
  window._sn777_dep_submitting=!1;
  const _effUid=(gt.currentUser&&gt.currentUser.uid)||(typeof ve!=="undefined"&&ve&&(ve.id||ve.uid))||(window.__sn777_user_profile&&(window.__sn777_user_profile.uid||window.__sn777_user_profile.id))||localStorage.getItem("sn777_user_id")||localStorage.getItem("sn777_username")||"";
  if(!_effUid){
    Fe("অনুগ্রহ করে প্রথমে লগইন করুন।");
    Je(!0);
    return;
  }
  const E=parseInt(Is||"0"),ee=500,W=25000;
  if(isNaN(E) || E<ee){
    Fe("সর্বনিম্ন ডিপোজিট ৫০০ টাকা।");
    Je(!0);
    return;
  }
  if(E>W){
    Fe("সর্বোচ্চ ডিপোজিট ২৫,০০০ টাকা।");
    Je(!0);
    return;
  }
  if(!Be || !["bkash","nagad"].includes(Be.toLowerCase())){
    Fe("অনুগ্রহ করে বিকাশ বা নগদ নির্বাচন করুন।");
    Je(!0);
    return;
  }
  xe(!0);
  window._sn777_dep_submitting=!0;
  const Te="ORD"+Date.now();
  const _nowIso=new Date().toISOString();
  const _newDepTx={
    id:Te,order_no:Te,uid:_effUid,
    type:"deposit",amount:E,method:Be,status:"pending",
    gateway:"gopay",timestamp:_nowIso,createdAt:_nowIso,
    description:"Deposit Integration (Pay-in) "+E+" টাকা ("+Be.toUpperCase()+")"
  };
  try{
    localStorage.setItem("sn777_pending_order",JSON.stringify({order_no:Te,amount:Number(E),time:Date.now()}));
    const _arr=JSON.parse(localStorage.getItem("sn777_tx_list_"+_effUid)||"[]");
    _arr.unshift(_newDepTx);
    localStorage.setItem("sn777_tx_list_"+_effUid,JSON.stringify(_arr));
    typeof gs=="function"&&gs(_arr);
  }catch(e){}

  const _gopayUrl="/pay.php?uid="+encodeURIComponent(_effUid)+"&amount="+encodeURIComponent(E)+"&method="+encodeURIComponent(Be.toLowerCase())+"&order_no="+encodeURIComponent(Te);
  try{
    window.location.assign(_gopayUrl);
  }catch(e){
    window.location.href=_gopayUrl;
  }
},[zs,lo]`;

for (const relPath of filesToPatch) {
  const filePath = path.join(__dirname, relPath);
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, "utf8");
    let changed = false;

    // 1. Replace Bi (Keep only bKash and Nagad)
    if (content.includes(oldBiStart)) {
      const biStartIdx = content.indexOf('Bi=[{id:"bkash"');
      if (biStartIdx !== -1) {
        const biEndIdx = content.indexOf(']', biStartIdx);
        if (biEndIdx !== -1) {
          content = content.slice(0, biStartIdx) + newBi + content.slice(biEndIdx + 1);
          changed = true;
          console.log(`[GoPay Patch] Filtered deposit methods to bKash & Nagad in ${relPath}`);
        }
      }
    }

    // 2. Replace ya (Quick deposit amounts starting from 500)
    if (content.includes(oldYa)) {
      content = content.replace(oldYa, newYa);
      changed = true;
      console.log(`[GoPay Patch] Updated quick deposit chips to start at 500 in ${relPath}`);
    }

    // 3. Replace Kr function
    const krRegex = /Kr\s*=\s*async\s*\(\)\s*=>\s*\{[\s\S]*?\}\s*,\s*\[zs\s*,\s*lo\]/;
    if (krRegex.test(content)) {
      content = content.replace(krRegex, newKrFunction);
      changed = true;
      console.log(`[GoPay Patch] Replaced Kr deposit submit handler in ${relPath}`);
    }

    // 4. Update limit label text
    const limitPatterns = [
      'children:"সীমা: ৳"+(Be==="bkash"||Be==="usdt"||Be==="usdterc20"?"৫০০":"২০০")+" - ৳২৫,০০০"',
      'children:"সীমা: ৳২০০ - ৳২৫,০০০"'
    ];
    for (const pat of limitPatterns) {
      if (content.includes(pat)) {
        content = content.replace(pat, 'children:"সীমা: ৳৫০০ - ৳২৫,০০০"');
        changed = true;
        console.log(`[GoPay Patch] Updated limit label to 500 BDT in ${relPath}`);
      }
    }

    // 5. Fix verify-payment unexpected end of JSON error
    const oldVerifyCall = 'const resp=await fetch("/api/verify-payment",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({order_no:L})});const resData=await resp.json();';
    const safeVerifyCall = 'const resp=await fetch("/api/verify-payment",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({order_no:L})});let resData={};try{const _rt=await resp.text();resData=_rt?JSON.parse(_rt):{}}catch(e){resData={}}';
    if (content.includes(oldVerifyCall)) {
      content = content.replace(oldVerifyCall, safeVerifyCall);
      changed = true;
      console.log(`[GoPay Patch] Protected verify-payment JSON parsing in ${relPath}`);
    }

    if (changed) {
      fs.writeFileSync(filePath, content, "utf8");
      console.log(`[GoPay Patch] Saved changes to ${relPath}`);
    }
  }
}

console.log("[GoPay Patch] Complete.");
