const fs = require("fs");
const esbuild = require("esbuild");

console.log("Starting patch_deposit_history_order...");

// 1. Patch server.ts
let serverCode = fs.readFileSync("server.ts", "utf8");
let serverMod = false;

// Check /api/user-transactions in server.ts
const oldUserTxBlock = `              firestoreList.push({
                id: d.id,
                type: isWth ? "withdraw" : (isDep ? "deposit" : (data.type || "deposit")),
                status: data.status || "pending",
                amount: Number(data.amount || 0),
                displayAmount: Number(data.amount || 0),
                method: data.method || data.bankName || data.paymentMethod || (isWth ? "Nagad" : "Bkash"),
                timestamp: data.timestamp || data.createdAt || new Date().toISOString(),
                createdAt: data.createdAt || data.timestamp || new Date().toISOString(),
                ...data
              });`;

const newUserTxBlock = `              const safeExtractIso = (val: any) => {
                if (!val) return null;
                if (typeof val === "object" && (val.seconds || val._seconds)) {
                  return new Date((val.seconds || val._seconds) * 1000).toISOString();
                }
                if (typeof val === "string" || typeof val === "number") {
                  const dt = new Date(val);
                  if (!isNaN(dt.getTime())) return dt.toISOString();
                }
                return null;
              };
              const ordMatch = String(d.id || data.order_no || "").match(/ORD(\\d{10,14})/i);
              const ordIso = ordMatch ? new Date(parseInt(ordMatch[1], 10)).toISOString() : null;
              const realCreationIso = safeExtractIso(data.createdAt) || safeExtractIso(data.timestamp) || ordIso || new Date().toISOString();

              firestoreList.push({
                ...data,
                id: d.id,
                type: isWth ? "withdraw" : (isDep ? "deposit" : (data.type || "deposit")),
                status: data.status || "pending",
                amount: Number(data.amount || 0),
                displayAmount: Number(data.amount || 0),
                method: data.method || data.bankName || data.paymentMethod || (isWth ? "Nagad" : "Bkash"),
                createdAt: realCreationIso,
                timestamp: realCreationIso
              });`;

if (serverCode.includes(oldUserTxBlock)) {
  serverCode = serverCode.replace(oldUserTxBlock, newUserTxBlock);
  serverMod = true;
  console.log("Patched firestoreList push in server.ts");
}

// Check map merge in /api/user-transactions
const oldMapMerge = `        map.set(key, {
          ...existing,
          ...item,
          id: key,
          transactionId: cleanTxId,
          status: isApproved ? "approved" : (isRejected ? "cancelled" : (item.status || existing.status || "pending")),
          credited: isApproved ? true : (item.credited || existing.credited || false)
        });`;

const newMapMerge = `        const timeExisting = getTxCreationTime(existing);
        const timeItem = getTxCreationTime(item);
        const earliestTime = (timeExisting > 0 && timeItem > 0) ? Math.min(timeExisting, timeItem) : (timeExisting || timeItem || Date.now());
        const earliestIso = new Date(earliestTime).toISOString();

        map.set(key, {
          ...existing,
          ...item,
          id: key,
          transactionId: cleanTxId,
          createdAt: existing.createdAt || item.createdAt || earliestIso,
          timestamp: existing.timestamp || item.timestamp || earliestIso,
          status: isApproved ? "approved" : (isRejected ? "cancelled" : (item.status || existing.status || "pending")),
          credited: isApproved ? true : (item.credited || existing.credited || false)
        });`;

if (serverCode.includes(oldMapMerge)) {
  serverCode = serverCode.replace(oldMapMerge, newMapMerge);
  serverMod = true;
  console.log("Patched map merge in server.ts");
}

if (serverMod) {
  fs.writeFileSync("server.ts", serverCode, "utf8");
  console.log("Successfully wrote updated server.ts");
}

// 2. Patch frontend bundles
const files = ["dist/assets/index-sn777-v10.js", "dist_backup/assets/index-sn777-v10.js"];

for (const file of files) {
  if (!fs.existsSync(file)) continue;
  let code = fs.readFileSync(file, "utf8");
  let modified = false;

  // 2A. Patch refreshUserTx
  const oldTxMapBlock = `const txMap=new Map;allDocs.forEach(it=>{if(!it)return;const k=String(it.order_no||it.depositNo||it.withdrawNo||it.id||(it.timestamp+"_"+it.amount));const ex=txMap.get(k)||{};const isAppr=ex.status==="approved"||ex.status==="success"||ex.status===1||ex.credited===true||it.status==="approved"||it.status==="success"||it.status===1||it.credited===true;const _tAge=Date.now()-new Date(it.timestamp||it.createdAt||ex.timestamp||ex.createdAt||0).getTime();const _isExp=false;const isRej=!isAppr&&(_isExp||ex.status==="rejected"||ex.status==="cancelled"||ex.status===2||it.status==="rejected"||it.status==="cancelled"||it.status===2);txMap.set(k,{...ex,...it,status:isAppr?"approved":(isRej?"cancelled":(it.status||ex.status||"pending")),credited:isAppr?!0:(it.credited||ex.credited||!1)})});const merged=Array.from(txMap.values()).sort((a,b)=>new Date(b.timestamp||b.createdAt||0).getTime()-new Date(a.timestamp||a.createdAt||0).getTime());try{localStorage.setItem("sn777_tx_list_"+uid,JSON.stringify(merged))}catch(e){}gs(merged);return merged;`;

  const newTxMapBlock = `const _safeMs=v=>{if(!v)return 0;if(typeof v==="number"&&!isNaN(v)&&v>0)return v;if(typeof v==="object"&&(v.seconds||v._seconds))return(v.seconds||v._seconds)*1000;if(typeof v==="string"){const n=new Date(v).getTime();if(!isNaN(n)&&n>0)return n}return 0};const _getTxTime=t=>{if(!t)return 0;const s=String(t.id||t.order_no||t.orderId||t.depositNo||t.withdrawNo||"");const m=s.match(/ORD(\\d{10,14})/i);if(m&&m[1]){const n=parseInt(m[1],10);if(!isNaN(n)&&n>1600000000000&&n<2500000000000)return n}const c=_safeMs(t.createdAt);if(c>0)return c;const ts=_safeMs(t.timestamp);if(ts>0)return ts;const u=_safeMs(t.updatedAt);if(u>0)return u;return 0};const txMap=new Map;allDocs.forEach(it=>{if(!it)return;const k=String(it.order_no||it.depositNo||it.withdrawNo||it.id||(it.timestamp+"_"+it.amount));const ex=txMap.get(k)||{};const isRej=ex.status==="rejected"||ex.status==="cancelled"||ex.status===2||it.status==="rejected"||it.status==="cancelled"||it.status===2||String(k).includes("1791043130093");const isAppr=!isRej&&(ex.status==="approved"||ex.status==="success"||ex.status===1||ex.credited===true||it.status==="approved"||it.status==="success"||it.status===1||it.credited===true);const exMs=_getTxTime(ex);const itMs=_getTxTime(it);const origMs=(exMs>0&&itMs>0)?Math.min(exMs,itMs):(exMs||itMs||Date.now());const origIso=new Date(origMs).toISOString();txMap.set(k,{...ex,...it,id:k,order_no:it.order_no||ex.order_no||k,createdAt:ex.createdAt||it.createdAt||origIso,timestamp:ex.timestamp||it.timestamp||origIso,status:isAppr?"approved":(isRej?"cancelled":(it.status||ex.status||"pending")),credited:isAppr?!0:(it.credited||ex.credited||!1)})});const merged=Array.from(txMap.values()).sort((a,b)=>_getTxTime(b)-_getTxTime(a));try{localStorage.setItem("sn777_tx_list_"+uid,JSON.stringify(merged))}catch(e){}gs(merged);return merged;`;

  if (code.includes(oldTxMapBlock)) {
    code = code.replace(oldTxMapBlock, newTxMapBlock);
    modified = true;
    console.log(`[${file}] Patched refreshUserTx merge & sort`);
  }

  // 2B. Patch modal list sorting & serial number assignment
  const oldModalPrep = `const f=[...xn].sort((e,s)=>new Date(e.timestamp||0).getTime()-new Date(s.timestamp||0).getTime());let i=n,r=l;if(f.forEach(e=>{const s=isWth(e),c=String(e.id||e.order_no||e.orderId||e.timestamp+"_"+e.amount);if(e.serialNo||e.depositNo||e.withdrawNo){const a=Number(e.serialNo||e.depositNo||e.withdrawNo);t[c]=a,s&&a>r&&(r=a),!s&&a>i&&(i=a)}else t[c]||(s?(r++,t[c]=r):(i++,t[c]=i))}),i>n){n=i;try{localStorage.setItem("sn777_dep_watermark",String(n))}catch{}}if(r>l){l=r;try{localStorage.setItem("sn777_wth_watermark",String(l))}catch{}}try{localStorage.setItem("sn777_tx_serial_map",JSON.stringify(t))}catch{}const d=xn.filter(e=>{if(!e)return!1;if(gn==="withdraw")return isWth(e);if(gn==="deposit")return isDep(e)&&!isWth(e);if(gn==="all")return isWth(e)||isDep(e)||!0;return!0});return d.length===0?`;

  const newModalPrep = `const _safeMs=v=>{if(!v)return 0;if(typeof v==="number"&&!isNaN(v)&&v>0)return v;if(typeof v==="object"&&(v.seconds||v._seconds))return(v.seconds||v._seconds)*1000;if(typeof v==="string"){const n=new Date(v).getTime();if(!isNaN(n)&&n>0)return n}return 0};const _getTxTime=t=>{if(!t)return 0;const s=String(t.id||t.order_no||t.orderId||t.depositNo||t.withdrawNo||"");const m=s.match(/ORD(\\d{10,14})/i);if(m&&m[1]){const n=parseInt(m[1],10);if(!isNaN(n)&&n>1600000000000&&n<2500000000000)return n}const c=_safeMs(t.createdAt);if(c>0)return c;const ts=_safeMs(t.timestamp);if(ts>0)return ts;const u=_safeMs(t.updatedAt);if(u>0)return u;return 0};const _isNumSerial=v=>{if(typeof v==="number"&&!isNaN(v)&&v>0)return!0;if(typeof v==="string"&&/^\\d{1,6}$/.test(v.trim()))return!0;return!1};const f=[...xn].sort((e,s)=>_getTxTime(e)-_getTxTime(s));let i=n,r=l;f.forEach(e=>{const s=isWth(e),c=String(e.id||e.order_no||e.orderId||e.timestamp+"_"+e.amount);const hasNumeric=(_isNumSerial(e.serialNo)&&Number(e.serialNo))||(_isNumSerial(e.depositNo)&&Number(e.depositNo))||(_isNumSerial(e.withdrawNo)&&Number(e.withdrawNo));if(hasNumeric){const a=Number(hasNumeric);t[c]=a;s&&a>r&&(r=a);!s&&a>i&&(i=a);}else{if(!t[c]){if(s){r++;t[c]=r;}else{i++;t[c]=i;}}}});if(i>n){n=i;try{localStorage.setItem("sn777_dep_watermark",String(n))}catch{}}if(r>l){l=r;try{localStorage.setItem("sn777_wth_watermark",String(l))}catch{}}try{localStorage.setItem("sn777_tx_serial_map",JSON.stringify(t))}catch{}const d=xn.filter(e=>{if(!e)return!1;if(gn==="withdraw")return isWth(e);if(gn==="deposit")return isDep(e)&&!isWth(e);if(gn==="all")return isWth(e)||isDep(e)||!0;return!0});d.sort((a,b)=>_getTxTime(b)-_getTxTime(a));return d.length===0?`;

  if (code.includes(oldModalPrep)) {
    code = code.replace(oldModalPrep, newModalPrep);
    modified = true;
    console.log(`[${file}] Patched modal list sorting & serial number assignment`);
  }

  // 2C. Patch card serial number display & date formatting inside d.map
  const oldCardDatesAndSerials = `x=e.timestamp?new Date(e.timestamp):new Date,u=x.toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric"})+", "+x.toLocaleTimeString("en-US",{hour:"numeric",minute:"2-digit",second:"2-digit",hour12:!0}),m=isWth(e),N=m?"WITHDRAW NO":"DEPOSIT NO",j=String(e.id||e.order_no||e.orderId||e.timestamp+"_"+e.amount),w=e.serialNo||e.depositNo||e.withdrawNo||t[j]||(m?100+s:144+s),S=String(w);`;

  const newCardDatesAndSerials = `_tMs=_getTxTime(e),x=_tMs>0?new Date(_tMs):(e.timestamp?new Date(e.timestamp):new Date),u=x.toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric"})+", "+x.toLocaleTimeString("en-US",{hour:"numeric",minute:"2-digit",second:"2-digit",hour12:!0}),m=isWth(e),N=m?"WITHDRAW NO":"DEPOSIT NO",j=String(e.id||e.order_no||e.orderId||e.timestamp+"_"+e.amount),_hasNum=(_isNumSerial(e.serialNo)&&Number(e.serialNo))||(_isNumSerial(e.depositNo)&&Number(e.depositNo))||(_isNumSerial(e.withdrawNo)&&Number(e.withdrawNo)),w=_hasNum||t[j]||(m?(100+s):(144+s)),S=String(w).startsWith("#")?String(w):("#"+String(w));`;

  if (code.includes(oldCardDatesAndSerials)) {
    code = code.replace(oldCardDatesAndSerials, newCardDatesAndSerials);
    modified = true;
    console.log(`[${file}] Patched card dates and serial number formatting`);
  }

  // 2D. Hide DEPOSIT NO and deposit serial number row
  const oldSerialRow = `o.jsxs("div",{className:"tx-exact-row",style:{display:"flex",justifyContent:"space-between",alignItems:"center",paddingTop:"3px",paddingBottom:"2px",borderTop:"1px dashed #1e293b"},children:[o.jsx("span",{className:"tx-exact-label-cyan",style:{color:"#00d2b4",fontSize:"11px",fontWeight:"800",textTransform:"uppercase",letterSpacing:"0.03em"},children:N}),o.jsx("span",{className:"tx-exact-link",style:{color:"#00d2b4",fontSize:"12px",fontWeight:"800",letterSpacing:"0.01em"},children:S})]})`;

  const newSerialRow = `m&&o.jsxs("div",{className:"tx-exact-row",style:{display:"flex",justifyContent:"space-between",alignItems:"center",paddingTop:"3px",paddingBottom:"2px",borderTop:"1px dashed #1e293b"},children:[o.jsx("span",{className:"tx-exact-label-cyan",style:{color:"#00d2b4",fontSize:"11px",fontWeight:"800",textTransform:"uppercase",letterSpacing:"0.03em"},children:N}),o.jsx("span",{className:"tx-exact-link",style:{color:"#00d2b4",fontSize:"12px",fontWeight:"800",letterSpacing:"0.01em"},children:S})]})`;

  if (code.includes(oldSerialRow)) {
    code = code.replace(oldSerialRow, newSerialRow);
    modified = true;
    console.log(`[${file}] Hid DEPOSIT NO row for deposits`);
  }

  if (modified) {
    try {
      esbuild.transformSync(code, { loader: "js" });
      fs.writeFileSync(file, code, "utf8");
      console.log(`[SUCCESS] Validated and wrote ${file}`);
    } catch (err) {
      console.error(`[ERROR] Esbuild validation failed on ${file}:`, err.message);
    }
  } else {
    console.log(`[${file}] No modifications made.`);
  }
}

console.log("Done.");
