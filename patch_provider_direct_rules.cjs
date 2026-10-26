const fs = require('fs');
const path = require('path');

console.log('[Provider Direct Rules Patch] Starting patch...');

const jsTargets = [
  path.join(__dirname, 'dist/assets/index-sn777-v12.js'),
  path.join(__dirname, 'dist_backup/assets/index-sn777-v12.js'),
  path.join(__dirname, 'original-index-sn777-v5.js')
];

jsTargets.forEach(filePath => {
  if (!fs.existsSync(filePath)) return;
  let code = fs.readFileSync(filePath, 'utf8');

  // Find kc definition
  const kcStartIdx = code.indexOf('kc=async E=>{');
  if (kcStartIdx === -1) return;

  const ccIdx = code.indexOf(',Cc=async', kcStartIdx);
  if (ccIdx === -1) return;

  // We want wr("JILI"), wr("FC"), wr("PG"), wr("JDB"), wr("COMBO"), wr("PP_SLOT") to instead trigger the deposit rules modal directly!
  // The rules modal trigger logic is:
  /*
    if(!L){rr("FIRST");Wt(!0);return}
    xe(!0);
    try{
      const ee=await En(We(Ie,"users",L.uid));
      if(ee.exists()){
        const W=ee.data(),ye=await Gn(In(hn(Ie,"deposits"),Qt("uid","==",L.uid),Qt("status","==","approved"))),Te=await Gn(In(hn(Ie,"transactions"),Qt("uid","==",L.uid),Qt("type","==","deposit"),Qt("status","==","approved"))),Le=new Map;ye.forEach(ft=>{const Fn=Number(ft.data().amount||0);isNaN(Fn)||Le.set(ft.id,Fn)}),Te.forEach(ft=>{const Fn=Number(ft.data().amount||0);isNaN(Fn)||Le.set(ft.id,Fn)});let Ne=0;const depAmts=[];Le.forEach(ft=>{Ne+=ft,depAmts.push(ft)});depAmts.sort((a,b)=>b-a);const Ue=Math.max(Le.size,W.approvedDepositsCount||0),Ke=Math.max(Ne,W.totalDeposited||0),maxSingle=Math.max((depAmts[0]||0),W.maxDeposit||(W.totalDeposited>=550?550:W.totalDeposited)||0);
        (Ue===0&&Ke===0)?rr("FIRST"):maxSingle<550?rr("SECOND"):rr("THIRD");
      }else{rr("FIRST")}
    }catch(err){rr("FIRST")}
    xe(!1);
    Wt(!0);
    return;
  */

  const directRulesBlock = `
kc=async E=>{
  try {
    const L=gt.currentUser;
    if(E==="EVO"||E==="SEXY"||E==="DG"||E==="HOTROAD"||E==="PT"){
      if(E==="EVO"){wr("EVO");return}
      if(E==="SEXY"){wr("SEXY");return}
      if(E==="DG"){wr("DG");return}
      if(E==="HOTROAD"){wr("HOTROAD");return}
      if(E==="PT"){wr("PT");return}
    }
    // For JILI, FC, PP, PG, JDB, COMBO and PP_SLOT, open rules modal directly without entering folder
    if(E==="JILI"||E==="FC"||E==="PP"||E==="PP_SLOT"||E==="PG"||E==="JDB"||E==="COMBO"){
      if(!L){rr("FIRST");Wt(!0);return}
      xe(!0);
      try{
        const ee=await En(We(Ie,"users",L.uid));
        if(ee.exists()){
          const W=ee.data(),ye=await Gn(In(hn(Ie,"deposits"),Qt("uid","==",L.uid),Qt("status","==","approved"))),Te=await Gn(In(hn(Ie,"transactions"),Qt("uid","==",L.uid),Qt("type","==","deposit"),Qt("status","==","approved"))),Le=new Map;ye.forEach(ft=>{const Fn=Number(ft.data().amount||0);isNaN(Fn)||Le.set(ft.id,Fn)}),Te.forEach(ft=>{const Fn=Number(ft.data().amount||0);isNaN(Fn)||Le.set(ft.id,Fn)});let Ne=0;const depAmts=[];Le.forEach(ft=>{Ne+=ft,depAmts.push(ft)});depAmts.sort((a,b)=>b-a);const Ue=Math.max(Le.size,W.approvedDepositsCount||0),Ke=Math.max(Ne,W.totalDeposited||0),maxSingle=Math.max((depAmts[0]||0),W.maxDeposit||(W.totalDeposited>=550?550:W.totalDeposited)||0);
          (Ue===0&&Ke===0)?rr("FIRST"):maxSingle<550?rr("SECOND"):rr("THIRD");
        }else{rr("FIRST")}
      }catch(err){rr("FIRST")}
      xe(!1);
      Wt(!0);
      return;
    }
    if(!L){H("signup");return}
    if(E==="Aviator"||E==="Crash"){
      E==="Aviator"?Hr(!0):Nr(!0);
      return;
    }
    xe(!0);
    try{
      const ee=await En(We(Ie,"users",L.uid));
      if(ee.exists()){
        const W=ee.data(),ye=await Gn(In(hn(Ie,"deposits"),Qt("uid","==",L.uid),Qt("status","==","approved"))),Te=await Gn(In(hn(Ie,"transactions"),Qt("uid","==",L.uid),Qt("type","==","deposit"),Qt("status","==","approved"))),Le=new Map;ye.forEach(ft=>{const Fn=Number(ft.data().amount||0);isNaN(Fn)||Le.set(ft.id,Fn)}),Te.forEach(ft=>{const Fn=Number(ft.data().amount||0);isNaN(Fn)||Le.set(ft.id,Fn)});let Ne=0;const depAmts=[];Le.forEach(ft=>{Ne+=ft,depAmts.push(ft)});depAmts.sort((a,b)=>b-a);const Ue=Math.max(Le.size,W.approvedDepositsCount||0),Ke=Math.max(Ne,W.totalDeposited||0),maxSingle=Math.max((depAmts[0]||0),W.maxDeposit||(W.totalDeposited>=550?550:W.totalDeposited)||0);
        (Ue===0&&Ke===0)?rr("FIRST"):maxSingle<550?rr("SECOND"):rr("THIRD");
      }else{rr("FIRST")}
    }catch(err){rr("FIRST")}
    xe(!1);
    Wt(!0);
    return;
  }catch(L){
    xe(!1);
    console.error("Error checking deposit:",L);
  }
}
`;

  code = code.slice(0, kcStartIdx) + directRulesBlock + code.slice(ccIdx);

  fs.writeFileSync(filePath, code, 'utf8');
  console.log(`[Provider Direct Rules Patch] Patched kc in ${path.basename(filePath)}`);
});

// Update index.html files with new cache-busting timestamp
const newVersion = '20261023_slot_direct_rules_v1';
const htmlFiles = [
  path.join(__dirname, 'index.html'),
  path.join(__dirname, 'dist/index.html'),
  path.join(__dirname, 'dist_backup/index.html')
];

htmlFiles.forEach(f => {
  if (fs.existsSync(f)) {
    let content = fs.readFileSync(f, 'utf8');
    content = content.replace(/index-sn777-v12\.js\?v=[a-zA-Z0-9_-]+/g, `index-sn777-v12.js?v=${newVersion}`);
    fs.writeFileSync(f, content, 'utf8');
    console.log(`[Provider Direct Rules Patch] Updated version in ${f}`);
  }
});

// Update sw.js files with new cache name
const newCacheName = 'sn777-v16';
const swFiles = [
  path.join(__dirname, 'sw.js'),
  path.join(__dirname, 'public/sw.js'),
  path.join(__dirname, 'dist/sw.js')
];

swFiles.forEach(f => {
  if (fs.existsSync(f)) {
    let content = fs.readFileSync(f, 'utf8');
    content = content.replace(/const CACHE_NAME = "sn777-v[0-9]+";/, `const CACHE_NAME = "${newCacheName}";`);
    fs.writeFileSync(f, content, 'utf8');
    console.log(`[Provider Direct Rules Patch] Updated cache name in ${f} to ${newCacheName}`);
  }
});

console.log('[Provider Direct Rules Patch] Completed successfully!');
