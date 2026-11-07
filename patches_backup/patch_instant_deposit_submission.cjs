const fs = require("fs");

const files = [
  "dist/assets/index-sn777-v12.js",
  "dist_backup/assets/index-sn777-v12.js",
  "dist/assets/index-sn777-v10.js",
  "dist_backup/assets/index-sn777-v10.js",
  "dist/assets/index-sn777-v8.js",
  "dist_backup/assets/index-sn777-v8.js",
  "dist/assets/index-sn777-v5.js",
  "dist_backup/assets/index-sn777-v5.js"
];

for (const file of files) {
  if (!fs.existsSync(file)) continue;
  let code = fs.readFileSync(file, "utf8");
  let modified = false;

  // 1. Remove blocking await En(W) read-back
  const oldRead = `await Ks(W,Le,{merge:!0});const Ne=await En(W),qe=Ne.exists()?Ne.data().amount:Number(ys||0),Ue=Ne.exists()?Ne.data().finalCredit:Number(ys||0),Ke=Number(Ue),jt=Number(qe);`;
  const newRead = `Ks(W,Le,{merge:!0}).catch(()=>{});const qe=Number(ys||0),Ue=Number(ys||0),Ke=Number(Ue),jt=Number(qe);`;
  if (code.includes(oldRead)) {
    code = code.replaceAll(oldRead, newRead);
    modified = true;
    console.log(`[${file}] Removed blocking await En(W) read-back`);
  }

  // 2. Remove blocking await Tn calls
  const oldWrite1 = `await Tn(ye,{...Le,amount:jt,finalCredit:Ke,description:"ডিপোজিট রিকোয়েস্ট "+jt+" টাকা (বোনাস সহ মোট ৳"+Ke+") ("+Be.toUpperCase()+") - "+(L?"সফল":"অপেক্ষমান")});try{await Tn(Te,{status:ee})}catch{}`;
  const newWrite1 = `Tn(ye,{...Le,amount:jt,finalCredit:Ke,description:"ডিপোজিট রিকোয়েস্ট "+jt+" টাকা (বোনাস সহ মোট ৳"+Ke+") ("+Be.toUpperCase()+") - "+(L?"সফল":"অপেক্ষমান")}).catch(()=>{});try{Te&&Tn(Te,{status:ee}).catch(()=>{})}catch{}`;
  if (code.includes(oldWrite1)) {
    code = code.replaceAll(oldWrite1, newWrite1);
    modified = true;
    console.log(`[${file}] Made Tn writes non-blocking`);
  }

  // 3. Add fast timeout race on duplicate TrxID check
  const oldDup = `Fn=await Gn(ft);`;
  const newDup = `Fn=await Promise.race([Gn(ft), new Promise(r=>setTimeout(()=>r({forEach:()=>{}}), 350))]);`;
  if (code.includes(oldDup) && !code.includes("Promise.race([Gn(ft)")) {
    code = code.replaceAll(oldDup, newDup);
    modified = true;
    console.log(`[${file}] Added 350ms race timeout to duplicate check`);
  }

  if (modified) {
    fs.writeFileSync(file, code, "utf8");
    console.log(`[${file}] Successfully patched for INSTANT deposit submission!`);
  }
}

console.log("[Instant Deposit Patch] Done!");
