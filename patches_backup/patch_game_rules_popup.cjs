const fs = require('fs');
const path = require('path');

console.log('[Game Rules Popup Patch] Starting patch...');

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
  if (kcStartIdx === -1) {
    console.warn(`[Game Rules Popup Patch] kc not found in ${path.basename(filePath)}`);
    return;
  }

  // Find the end of kc function before Cc=async
  const ccIdx = code.indexOf(',Cc=async', kcStartIdx);
  if (ccIdx === -1) {
    console.warn(`[Game Rules Popup Patch] Cc not found after kc in ${path.basename(filePath)}`);
    return;
  }

  const newKc = `kc=async E=>{try{const L=gt.currentUser;if(E==="EVO"){wr("EVO");return}if(E==="SEXY"){wr("SEXY");return}if(E==="PP"){if(Tt==="স্লট"||Tt==="PP_SLOT"){wr("PP_SLOT");return}wr("PP");return}if(E==="DG"){wr("DG");return}if(E==="HOTROAD"){wr("HOTROAD");return}if(E==="PT"){wr("PT");return}if(E==="JILI"){wr("JILI");return}if(E==="FC"){wr("FC");return}if(E==="PG"){wr("PG");return}if(!L){rr("FIRST");Wt(!0);return}if(E==="Aviator"||E==="Crash"){E==="Aviator"?Hr(!0):Nr(!0);return}xe(!0);try{const ee=await En(We(Ie,"users",L.uid));if(ee.exists()){const W=ee.data(),ye=await Gn(In(hn(Ie,"deposits"),Qt("uid","==",L.uid),Qt("status","==","approved"))),Te=await Gn(In(hn(Ie,"transactions"),Qt("uid","==",L.uid),Qt("type","==","deposit"),Qt("status","==","approved"))),Le=new Map;ye.forEach(ft=>{const Fn=Number(ft.data().amount||0);isNaN(Fn)||Le.set(ft.id,Fn)}),Te.forEach(ft=>{const Fn=Number(ft.data().amount||0);isNaN(Fn)||Le.set(ft.id,Fn)});let Ne=0;const depAmts=[];Le.forEach(ft=>{Ne+=ft,depAmts.push(ft)});depAmts.sort((a,b)=>b-a);const Ue=Math.max(Le.size,W.approvedDepositsCount||0),Ke=Math.max(Ne,W.totalDeposited||0),maxSingle=Math.max((depAmts[0]||0),W.maxDeposit||(W.totalDeposited>=550?550:W.totalDeposited)||0);(Ue===0&&Ke===0)?rr("FIRST"):maxSingle<550?rr("SECOND"):rr("THIRD")}else rr("FIRST")}catch(err){rr("FIRST")}xe(!1);Wt(!0);return}catch(L){xe(!1);rr("FIRST");Wt(!0)}}`;

  code = code.slice(0, kcStartIdx) + newKc + code.slice(ccIdx);

  fs.writeFileSync(filePath, code, 'utf8');
  console.log(`[Game Rules Popup Patch] Successfully patched kc in ${path.basename(filePath)}`);
});

// Update index.html files with new cache-busting timestamp
const newVersion = '20261023_slot_rules_popup_v1';
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
    console.log(`[Game Rules Popup Patch] Updated version in ${f} to ${newVersion}`);
  }
});

// Update sw.js files with new cache name to wipe old cache
const newCacheName = 'sn777-v13';
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
    console.log(`[Game Rules Popup Patch] Updated cache name in ${f} to ${newCacheName}`);
  }
});

console.log('[Game Rules Popup Patch] Completed successfully!');
