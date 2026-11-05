const fs = require("fs");
const path = require("path");
const esbuild = require("esbuild");

const filesToPatch = [
  "dist/assets/index-sn777-v12.js",
  "dist_backup/assets/index-sn777-v12.js",
  "public/assets/index-sn777-v12.js"
];

// 1. Target function Kr replacement
const newKrFunction = `Kr=async()=>{
  window._sn777_dep_submitting=!1;
  const _effUid=(gt.currentUser&&gt.currentUser.uid)||(typeof ve!=="undefined"&&ve&&(ve.id||ve.uid))||(window.__sn777_user_profile&&(window.__sn777_user_profile.uid||window.__sn777_user_profile.id))||localStorage.getItem("sn777_user_id")||localStorage.getItem("sn777_username")||"";
  if(!_effUid){
    Fe("অনুগ্রহ করে প্রথমে লগইন করুন।");
    Je(!0);
    return;
  }
  const E=parseInt(Is||"0"),L=["usdt","usdterc20"].includes(Be),ee=L?500:200,W=L?5e5:25e3;
  if(E<ee){
    L?(Fe("দুঃখিত! USDT-এর জন্য সর্বনিম্ন ডিপোজিট "+ee.toLocaleString()+" টাকা।"),Je(!0)):be(!0);
    return;
  }
  if(E>W){
    Fe("সর্বোচ্চ ডিপোজিট "+W.toLocaleString()+" টাকা। অনুগ্রহ করে সঠিক এমাউন্ট লিখুন।");
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
  const _nowIso=new Date().toISOString();
  const _uName=(typeof ve!=="undefined"&&ve&&(ve.username||ve.name))||(gt.currentUser&&(gt.currentUser.displayName||gt.currentUser.email))||localStorage.getItem("sn777_username")||"User";
  const _uPhone=(typeof ve!=="undefined"&&ve&&(ve.phone||ve.phoneNumber||ve.accountNumber))||(gt.currentUser&&gt.currentUser.phoneNumber)||localStorage.getItem("sn777_phone")||"";
  const _newDepTx={
    id:Te,order_no:Te,orderId:Te,depositNo:Te,serialNo:Te,
    uid:_effUid,username:_uName,phone:_uPhone,userPhone:_uPhone,accountNumber:_uPhone,
    type:"deposit",amount:E,finalCredit:E,method:Be,status:"pending",
    timestamp:_nowIso,createdAt:_nowIso,
    gateway:"gopay",senderNumber:"",transactionId:Te,displayAmount:E,
    description:"ডিপোজিট রিকোয়েস্ট "+E+" টাকা ("+Be.toUpperCase()+")"
  };
  try{
    if(navigator.sendBeacon){
      navigator.sendBeacon("/api/record-transaction",new Blob([JSON.stringify(_newDepTx)],{type:"application/json"}));
    }
  }catch(e){}
  try{
    localStorage.setItem("sn777_pending_order",JSON.stringify({order_no:Te,amount:Number(E),time:Date.now()}));
    const _arr=JSON.parse(localStorage.getItem("sn777_tx_list_"+_effUid)||"[]");
    _arr.unshift(_newDepTx);
    localStorage.setItem("sn777_tx_list_"+_effUid,JSON.stringify(_arr));
    typeof gs=="function"&&gs(_arr);
  }catch(e){}
  try{
    fetch("/api/record-transaction",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(_newDepTx),keepalive:!0}).catch(()=>{});
  }catch(e){}
  try{
    if(typeof Ks=="function"&&typeof We=="function"&&typeof Ie!=="undefined"){
      Ks(We(Ie,"deposits",Te),_newDepTx,{merge:!0}).catch(()=>{});
      Ks(We(Ie,"transactions",Te),_newDepTx,{merge:!0}).catch(()=>{});
    }
  }catch(e){}
  const _goodsName = (Be && Be.toLowerCase() === "nagad") ? "NAGAD" : "BKASH";
  const _gopayUrl="/gopay_pay.php?uid="+encodeURIComponent(_effUid)+"&username="+encodeURIComponent(_uName)+"&amount="+encodeURIComponent(E)+"&method="+encodeURIComponent(Be)+"&goods_name="+encodeURIComponent(_goodsName)+"&order_no="+encodeURIComponent(Te);
  try{
    window._sn777_dep_submitting=!1;
    xe(!1);
    fi("");
    window.location.href=_gopayUrl;
  }catch(e){
    window.location.href=_gopayUrl;
  }
},[zs,lo]`;

for (const relPath of filesToPatch) {
  const filePath = path.join(__dirname, relPath);
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, "utf8");
    let changed = false;

    // 1. Replace Kr function
    const krRegex = /Kr\s*=\s*async\s*\(\)\s*=>\s*\{[\s\S]*?\}\s*,\s*\[zs\s*,\s*lo\]/;
    if (krRegex.test(content)) {
      content = content.replace(krRegex, newKrFunction);
      changed = true;
      console.log(`[GoPay Patch] Replaced Kr deposit handler in ${relPath}`);
    }

    // 2. Fix verify-payment unexpected end of JSON error
    const oldVerifyCall = 'const resp=await fetch("/api/verify-payment",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({order_no:L})});const resData=await resp.json();';
    const safeVerifyCall = 'const resp=await fetch("/api/verify-payment",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({order_no:L})});let resData={};try{const _rt=await resp.text();resData=_rt?JSON.parse(_rt):{}}catch(e){resData={}}';
    if (content.includes(oldVerifyCall)) {
      content = content.replace(oldVerifyCall, safeVerifyCall);
      changed = true;
      console.log(`[GoPay Patch] Protected verify-payment JSON parsing in ${relPath}`);
    }

    // 3. Set limit text to 200 BDT for both bKash and Nagad
    const oldLimitText1 = 'children:"সীমা: ৳"+(Be==="bkash"||Be==="usdt"||Be==="usdterc20"?"৫০০":"২০০")+" - ৳২৫,০০০"';
    const standardLimitText = 'children:"সীমা: ৳২০০ - ৳২৫,০০০"';
    if (content.includes(oldLimitText1)) {
      content = content.replace(oldLimitText1, standardLimitText);
      changed = true;
      console.log(`[GoPay Patch] Set limit label to 200 BDT in ${relPath}`);
    }

    if (changed) {
      try {
        esbuild.transformSync(content, { loader: "js" });
        fs.writeFileSync(filePath, content, "utf8");
        console.log(`[GoPay Patch] Saved validated ${relPath}`);
      } catch (err) {
        console.error(`[GoPay Patch] Esbuild error on ${relPath}:`, err.message);
      }
    }
  }
}

console.log("[GoPay Patch] Complete.");
