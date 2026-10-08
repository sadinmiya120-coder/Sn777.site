const fs = require("fs");
const esbuild = require("esbuild");

const files = [
  "dist/assets/index-sn777-v10.js",
  "dist_backup/assets/index-sn777-v10.js",
  "dist/assets/index-sn777-v9.js",
  "dist_backup/assets/index-sn777-v9.js",
  "dist/assets/index-sn777-v8.js",
  "dist_backup/assets/index-sn777-v8.js",
  "dist/assets/index-sn777-v7.js",
  "dist_backup/assets/index-sn777-v7.js",
  "dist/assets/index-sn777-v6.js",
  "dist_backup/assets/index-sn777-v6.js",
  "dist/assets/index-sn777-v5.js",
  "dist_backup/assets/index-sn777-v5.js"
];

for (const file of files) {
  if (!fs.existsSync(file)) continue;

  let code = fs.readFileSync(file, "utf8");

  // Save order info into window and localStorage when order is returned via URL or auto-check
  if (!code.includes("window._sn_order_saved")) {
    code = code.replace(
      /let L=E\.get\("order_no"\)\|\|E\.get\("order_id"\)\|\|E\.get\("ref"\);/g,
      `let L=E.get("order_no")||E.get("order_id")||E.get("ref");try{if(L){window._lastDepositOrderId=L;localStorage.setItem("sn777_last_order_id",L);window._sn_order_saved=true;}}catch(e){}`
    );

    code = code.replace(
      /if\(_ordKey\)window\.__sn777_notified_orders\[_ordKey\]=true;/g,
      `if(_ordKey){window.__sn777_notified_orders[_ordKey]=true;try{window._lastDepositOrderId=_ordKey;window._lastDepositAmount=_depAmt;localStorage.setItem("sn777_last_order_id",_ordKey);}catch(e){}}`
    );
  }

  // Replace old simple no modal with complete beautiful modal that includes Order ID
  const startIdx = code.indexOf("o.jsx(tn,{children:no&&");
  const endIdx = code.indexOf(",o.jsx(tn,{children:zs&&", startIdx);

  if (startIdx !== -1 && endIdx !== -1) {
    const fullOldNoModal = code.substring(startIdx, endIdx);

    const isBonusExpr = `(Gr&&(Gr.includes("বোনাস")||Gr.includes("অভিনন্দন")||Gr.includes("প্রোমো")||Gr.includes("ভাউচার")))`;
    const curOidExpr = `((typeof window!=="undefined"&&window._lastDepositOrderId)||(typeof L!=="undefined"&&L)||localStorage.getItem("sn777_last_order_id")||"ORD"+Date.now())`;
    const curTrxExpr = `((typeof window!=="undefined"&&window._lastDepositTrxId)||(typeof oi!=="undefined"&&oi)||"যাচাইাধীন")`;
    const curMethodExpr = `((typeof window!=="undefined"&&window._lastDepositMethod)||(typeof Be!=="undefined"&&(Be==="bkash"?"bKash":Be==="nagad"?"Nagad":Be==="rocket"?"Rocket":Be))||"bKash")`;
    const curAmtExpr = `((typeof window!=="undefined"&&window._lastDepositAmount)||(typeof jt!=="undefined"&&jt)||(typeof Is!=="undefined"&&parseFloat(Is||"0"))||200)`;

    const newNoModal = `o.jsx(tn,{children:no&&o.jsxs("div",{className:"fixed inset-0 z-[99999999] flex items-center justify-center p-4 select-none overflow-y-auto overscroll-contain bg-slate-950/90 backdrop-blur-md",children:[` +
      `o.jsx(ce.div,{initial:{opacity:0},animate:{opacity:1},exit:{opacity:0},className:"fixed inset-0",onClick:()=>{try{localStorage.removeItem("sn777_persist_success");}catch(e){} Er(!1);sr("আপনার ডিপোজিট রিকোয়েস্টটি সফলভাবে জমা দেওয়া হয়েছে。")}}),` +
      `o.jsxs(ce.div,{initial:{scale:.85,opacity:0,y:25},animate:{scale:1,opacity:1,y:0},exit:{scale:.85,opacity:0,y:25},transition:{type:"spring",damping:22,stiffness:300},onClick:e=>e.stopPropagation(),className:"relative w-full max-w-[350px] overflow-hidden rounded-[2.5rem] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)] border border-emerald-500/50 bg-gradient-to-b from-slate-900 via-slate-950 to-black text-white p-6 flex flex-col items-center z-10 my-auto",children:[` +
        // Glowing top accent
        `o.jsx("div",{className:"absolute top-0 inset-x-0 h-32 bg-gradient-to-b from-emerald-500/20 via-transparent to-transparent pointer-events-none"}),` +
        // Close button
        `o.jsx("button",{type:"button",onClick:()=>{try{localStorage.removeItem("sn777_persist_success");}catch(e){} Er(!1);},className:"absolute right-4 top-4 text-slate-400 hover:text-white p-1.5 rounded-full hover:bg-white/10 transition-colors cursor-pointer z-20",children:"✕"}),` +
        // Animated icon
        `o.jsxs("div",{className:"relative my-1 flex items-center justify-center",children:[` +
          `o.jsx("div",{className:"w-16 h-16 rounded-full bg-gradient-to-br from-emerald-400 via-emerald-500 to-teal-600 flex items-center justify-center text-white shadow-[0_0_30px_rgba(16,185,129,0.5)] border-4 border-white/20 relative z-10",children:o.jsx(Vr,{size:36,strokeWidth:3.5})})` +
        `]}),` +
        // Title
        `o.jsx("h3",{className:"text-xl font-black text-emerald-400 mt-2 mb-1 tracking-tight text-center relative z-10",children:(${isBonusExpr}?"অভিনন্দন!":"ডিপোজিট সফল হয়েছে!")}),` +
        // Subtitle message
        `o.jsx("p",{className:"text-slate-300 text-center font-semibold text-xs mb-3.5 leading-relaxed px-1 relative z-10",children:Gr}),` +
        // Order ID box (if not bonus)
        `(!${isBonusExpr}?o.jsxs("div",{className:"w-full bg-slate-900/90 border border-emerald-500/40 rounded-2xl p-3 mb-3 flex items-center justify-between shadow-inner relative z-10",children:[` +
          `o.jsxs("div",{className:"text-left",children:[` +
            `o.jsx("span",{className:"text-[9px] font-black text-emerald-400 uppercase tracking-widest block mb-0.5",children:"অর্ডার আইডি (ORDER ID)"}),` +
            `o.jsx("span",{className:"text-sm font-black text-white font-mono select-all tracking-wider",children:${curOidExpr}})` +
          `]}),` +
          `o.jsxs("button",{type:"button",onClick:()=>{const _oid=${curOidExpr};try{navigator.clipboard.writeText(_oid);}catch(e){}try{Z(_oid,"order_id");}catch(e){}},className:"flex items-center gap-1 bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white text-xs font-bold px-3 py-1.5 rounded-xl shadow transition-all cursor-pointer",children:[` +
            `o.jsx("span",{children:(T==="order_id"?"✓ কপি হয়েছে":"📋 কপি")})` +
          `]})` +
        `]}):null),` +
        // Transaction Info Details Card
        `(!${isBonusExpr}?o.jsxs("div",{className:"w-full bg-black/40 border border-white/10 rounded-2xl p-3 mb-4 space-y-2 text-xs relative z-10",children:[` +
          `o.jsxs("div",{className:"flex items-center justify-between",children:[` +
            `o.jsx("span",{className:"text-slate-400 font-medium",children:"ট্রানজ্যাকশন আইডি:"}),` +
            `o.jsx("span",{className:"font-mono font-bold text-slate-200 uppercase bg-white/5 px-2 py-0.5 rounded border border-white/10",children:${curTrxExpr}})` +
          `]}),` +
          `o.jsxs("div",{className:"flex items-center justify-between border-t border-white/5 pt-1.5",children:[` +
            `o.jsx("span",{className:"text-slate-400 font-medium",children:"পেমেন্ট মেথড:"}),` +
            `o.jsx("span",{className:"font-bold text-emerald-400 uppercase",children:${curMethodExpr}})` +
          `]}),` +
          `o.jsxs("div",{className:"flex items-center justify-between border-t border-white/5 pt-1.5",children:[` +
            `o.jsx("span",{className:"text-slate-400 font-medium",children:"পরিমাণ:"}),` +
            `o.jsxs("span",{className:"text-emerald-400 font-black",children:["৳ ",parseFloat(${curAmtExpr}).toFixed(2)]})` +
          `]}),` +
          `o.jsxs("div",{className:"flex items-center justify-between border-t border-white/5 pt-1.5",children:[` +
            `o.jsx("span",{className:"text-slate-400 font-medium",children:"স্ট্যাটাস:"}),` +
            `o.jsx("span",{className:"text-amber-400 font-bold text-[10px] bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/20",children:"⏳ পর্যালোচনা হচ্ছে"})` +
          `]})` +
        `]}):null),` +
        // Buttons
        `o.jsxs("div",{className:"w-full grid grid-cols-2 gap-2 relative z-10",children:[` +
          `o.jsx("button",{type:"button",onClick:()=>{try{localStorage.removeItem("sn777_persist_success");}catch(e){} Er(!1);try{H("funds");O("history");}catch(e){}},className:"w-full bg-slate-800 hover:bg-slate-700 active:scale-95 text-slate-200 py-3 rounded-xl font-bold text-xs transition-all border border-slate-700 cursor-pointer flex items-center justify-center gap-1",children:"📜 হিস্টোরি"}),` +
          `o.jsx("button",{type:"button",onClick:()=>{try{localStorage.removeItem("sn777_persist_success");}catch(e){} Er(!1);sr("আপনার ডিপোজিট রিকোয়েস্টটি সফলভাবে জমা দেওয়া হয়েছে。")},className:"w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 active:scale-95 text-white py-3 rounded-xl font-bold text-xs shadow-lg shadow-emerald-500/25 transition-all flex items-center justify-center cursor-pointer",children:"✓ ঠিক আছে"})` +
        `]})` +
      `]})` +
    `]})})`;

    code = code.replace(fullOldNoModal, newNoModal);
    console.log(`[Popup Patch] Successfully upgraded no popup in ${file}`);
  }

  try {
    esbuild.transformSync(code, { loader: "js" });
    fs.writeFileSync(file, code, "utf8");
    console.log(`[Popup Patch] Validated and saved ${file}`);
  } catch (e) {
    console.error(`[Popup Patch] Error in ${file}:`, e.message);
  }
}

console.log("[Popup Patch] Done!");
