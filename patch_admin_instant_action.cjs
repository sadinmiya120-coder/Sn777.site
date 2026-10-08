const fs = require("fs");

const files = [
  "dist/assets/index-sn777-v5.js",
  "dist_backup/assets/index-sn777-v5.js",
  "dist/assets/index-sn777-v6.js",
  "dist_backup/assets/index-sn777-v6.js"
];

for (const file of files) {
  if (!fs.existsSync(file)) continue;
  let code = fs.readFileSync(file, "utf8");
  let modified = false;

  const posXe = code.indexOf("const xe=async(");
  const posPt = code.indexOf(",Pt=async(");
  const posCt = code.indexOf(",Ct=async V=>");

  if (posXe !== -1 && posPt !== -1 && posCt !== -1 && posXe < posPt && posPt < posCt) {
    const newXe = `const xe=async(V,be,je)=>{try{const orderNo=V.order_no||V.id;if(be==="delete"){if(!confirm("আপনি কি নিশ্চিতভাবে এই রিকোয়েস্টটি ডিলিট করতে চান?"))return;H(prev=>(prev||[]).filter(d=>d.id!==V.id&&d.order_no!==orderNo));try{await Ab(We(Ie,"deposits",V.id))}catch(e){}return}if(be==="approve"){let De=je!==void 0?je:Number(V.amount);if(De===0){const gn=prompt("ডিপোজিটের পরিমাণ লিখুন:");gn&&(De=Number(gn))}H(prev=>(prev||[]).map(d=>(d.id===V.id||d.order_no===orderNo)?{...d,status:"approved",credited:true}:d));fetch("/api/admin/approve-deposit",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({order_no:orderNo,doc_id:V.id,uid:V.uid,amount:De})}).catch(()=>{})}else if(be==="reject"){H(prev=>(prev||[]).map(d=>(d.id===V.id||d.order_no===orderNo)?{...d,status:"rejected",cancelled:true}:d));fetch("/api/admin/reject-deposit",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({order_no:orderNo,doc_id:V.id,uid:V.uid})}).catch(()=>{})}}catch(ct){console.error("Error updating deposit:",ct)}}`;

    const newPt = `,Pt=async(V,be)=>{try{const cleanId=V.withdrawNo||V.serialNo||V.id;if(be==="delete"){if(!confirm("আপনি কি নিশ্চিতভাবে এই রিকোয়েস্টটি ডিলিট করতে চান?"))return;D(prev=>(prev||[]).filter(d=>d.id!==V.id&&d.withdrawNo!==cleanId));try{await Ab(We(Ie,"withdrawals",V.id))}catch(e){}return}if(be==="approve"){D(prev=>(prev||[]).map(d=>(d.id===V.id||d.withdrawNo===cleanId)?{...d,status:"approved"}:d));fetch("/api/admin/approve-withdrawal",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({id:V.id,doc_id:V.id,withdrawNo:cleanId,uid:V.uid})}).catch(()=>{})}else if(be==="reject"){D(prev=>(prev||[]).map(d=>(d.id===V.id||d.withdrawNo===cleanId)?{...d,status:"rejected",cancelled:true}:d));fetch("/api/admin/reject-withdrawal",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({id:V.id,doc_id:V.id,withdrawNo:cleanId,uid:V.uid,amount:Number(V.amount)})}).catch(()=>{})}}catch(e){console.error(e)}}`;

    code = code.substring(0, posXe) + newXe + newPt + code.substring(posCt);
    modified = true;
    console.log(`[${file}] Cleanly replaced xe and Pt with instant actions`);
  }

  if (modified) {
    fs.writeFileSync(file, code, "utf8");
    console.log(`[${file}] Saved file successfully!`);
  }
}
