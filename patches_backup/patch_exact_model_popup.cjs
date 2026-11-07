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

  const startIdx = code.indexOf("o.jsx(tn,{children:vl&&");
  const endIdx = code.indexOf(",o.jsx(tn,{children:no&&", startIdx);

  if (startIdx !== -1 && endIdx !== -1) {
    const fullOldVlModal = code.substring(startIdx, endIdx);

    const curTrxExpr = `((typeof window!=="undefined"&&window._lastDepositTrxId)||(typeof oi!=="undefined"&&oi)||"SGFDGJGG")`;
    const curMethodExpr = `((typeof window!=="undefined"&&window._lastDepositMethod)||(typeof Be!=="undefined"&&(Be==="bkash"?"BKASH":Be==="nagad"?"NAGAD":Be==="rocket"?"ROCKET":Be.toUpperCase()))||"BKASH")`;
    const curWalletExpr = `((typeof Ys!=="undefined"&&Ys)||(typeof window!=="undefined"&&window._lastDepositWallet)||"01793814751")`;
    const curAmtExpr = `((typeof window!=="undefined"&&window._lastDepositAmount)||(typeof jt!=="undefined"&&jt)||(typeof Is!=="undefined"&&parseFloat(Is||"0"))||250)`;
    const curCreditExpr = `((typeof Ke!=="undefined"&&Ke)||(typeof window!=="undefined"&&window._lastDepositAmount)||(typeof jt!=="undefined"&&jt)||250)`;

    const exactModalCode = `o.jsx(tn,{children:vl&&o.jsx(ce.div,{initial:{opacity:0},animate:{opacity:1},exit:{opacity:0},className:"fixed inset-0 z-[999999] flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto overscroll-contain",children:` +
      `o.jsxs(ce.div,{initial:{scale:0.9,opacity:0,y:25},animate:{scale:1,opacity:1,y:0},exit:{scale:0.9,opacity:0,y:25},transition:{type:"spring",damping:25,stiffness:300},className:"bg-white rounded-[2rem] sm:rounded-[2.5rem] w-full max-w-md overflow-hidden flex flex-col items-center p-5 sm:p-7 relative shadow-[0_25px_60px_-15px_rgba(0,0,0,0.35)] border border-slate-100 my-auto text-left",children:[` +
        // Close button top right
        `o.jsx("button",{type:"button",onClick:()=>{to(!1);Ls(!1);H("home");},className:"absolute right-4 top-4 text-slate-400 hover:text-slate-700 bg-slate-100 hover:bg-slate-200 w-8 h-8 rounded-full flex items-center justify-center transition-all cursor-pointer",children:o.jsx(Ts,{size:18})}),` +
        // Green circular halo checkmark icon
        `o.jsxs("div",{className:"w-16 h-16 rounded-full bg-[#dcfce7] flex items-center justify-center mb-3 mt-1 relative shadow-inner",children:[` +
          `o.jsx("div",{className:"w-11 h-11 rounded-full bg-[#10b981] flex items-center justify-center text-white shadow-md shadow-emerald-500/30",children:o.jsx(Oa,{size:24,strokeWidth:3.5})})` +
        `]}),` +
        // Main Title
        `o.jsx("h2",{className:"text-xl sm:text-2xl font-black text-slate-900 text-center tracking-tight mb-1",children:"পেমেন্ট সফলভাবে জমা হয়েছে!"}),` +
        // Subtitle
        `o.jsx("p",{className:"text-slate-500 text-center font-medium text-xs mb-4 leading-relaxed px-2",children:"আপনার TrxID সিস্টেমে যাচাই ও অনুমোদনের জন্য সংরক্ষিত করা হয়েছে"}),` +
        // Card 1: TrxID card with light sky background
        `o.jsxs("div",{className:"w-full bg-[#f0f7ff] border border-blue-100 rounded-2xl p-3.5 mb-3.5 shadow-sm",children:[` +
          `o.jsxs("div",{className:"flex items-center justify-between mb-2",children:[` +
            `o.jsx("span",{className:"font-bold text-slate-700 text-xs",children:"ট্রানজেকশন আইডি (TrxID)"}),` +
            `o.jsx("span",{className:"bg-emerald-100 text-emerald-700 text-[11px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1",children:"● ভেরিফাইড সাবমিশন"})` +
          `]}),` +
          `o.jsxs("div",{className:"w-full bg-white border border-blue-200/80 rounded-xl px-3.5 py-2.5 flex items-center justify-between shadow-sm",children:[` +
            `o.jsx("span",{className:"font-mono font-black text-lg sm:text-xl text-[#00559b] tracking-wider select-all",children:${curTrxExpr}}),` +
            `o.jsxs("button",{type:"button",onClick:()=>{const _tx=${curTrxExpr};try{navigator.clipboard.writeText(_tx);}catch(e){}try{Z(_tx,"trx_id");}catch(e){}},className:"bg-[#f0f7ff] hover:bg-blue-100 text-[#00559b] active:scale-95 px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer border border-blue-200/60 shadow-xs",children:[` +
              `o.jsx(ih,{size:13}),` +
              `o.jsx("span",{children:T==="trx_id"?"কপি হয়েছে!":"কপি"})` +
            `]})` +
          `]})` +
        `]}),` +
        // Card 2: Details table
        `o.jsxs("div",{className:"w-full bg-slate-50/90 border border-slate-200/70 rounded-2xl p-3.5 mb-3 space-y-2.5 text-xs",children:[` +
          `o.jsxs("div",{className:"flex items-center justify-between",children:[` +
            `o.jsx("span",{className:"text-slate-500 font-medium",children:"পেমেন্ট মেথড:"}),` +
            `o.jsxs("span",{className:"font-black text-slate-800 uppercase",children:[${curMethodExpr}," Deposit"]})` +
          `]}),` +
          `o.jsxs("div",{className:"flex items-center justify-between border-t border-slate-200/60 pt-2",children:[` +
            `o.jsx("span",{className:"text-slate-500 font-medium",children:"রিসিভিং ওয়ালেট:"}),` +
            `o.jsx("span",{className:"font-mono font-black text-slate-800 text-xs",children:${curWalletExpr}})` +
          `]}),` +
          `o.jsxs("div",{className:"flex items-center justify-between border-t border-slate-200/60 pt-2",children:[` +
            `o.jsx("span",{className:"text-slate-500 font-medium",children:"ডিপোজিট পরিমাণ:"}),` +
            `o.jsxs("span",{className:"font-black text-slate-800",children:["৳",parseFloat(${curAmtExpr}).toFixed(0)]})` +
          `]}),` +
          `o.jsxs("div",{className:"flex items-center justify-between border-t border-slate-200/60 pt-2",children:[` +
            `o.jsx("span",{className:"text-slate-900 font-bold text-xs sm:text-sm",children:"মোট ক্রেডিট হবে:"}),` +
            `o.jsxs("span",{className:"font-black text-sm sm:text-base text-[#00559b]",children:["৳",parseFloat(${curCreditExpr}).toFixed(0)]})` +
          `]}),` +
          `o.jsxs("div",{className:"flex items-center justify-between border-t border-slate-200/60 pt-2",children:[` +
            `o.jsx("span",{className:"text-slate-400 font-medium",children:"সাবমিটের সময়:"}),` +
            `o.jsx("span",{className:"font-bold text-slate-600 font-mono text-[11px]",children:new Date().toLocaleTimeString("en-US",{hour:"2-digit",minute:"2-digit",second:"2-digit",hour12:true})})` +
          `]})` +
        `]}),` +
        // Trust badge
        `o.jsxs("div",{className:"flex items-center justify-center gap-1.5 text-[11px] font-semibold text-slate-600 mb-4",children:[` +
          `o.jsx(Vr,{size:14,className:"text-emerald-600"}),` +
          `o.jsx("span",{children:"নিরাপদ ১২৮-বিট এনক্রিপ্টেড পেমেন্ট ভেরিফিকেশন"})` +
        `]}),` +
        // Action buttons
        `o.jsxs("div",{className:"w-full space-y-2",children:[` +
          `o.jsxs("button",{type:"button",onClick:()=>{to(!1);Ls(!1);H("home");},className:"w-full bg-[#00559b] hover:bg-[#00447c] active:scale-[0.98] text-white py-3.5 rounded-2xl font-black text-sm transition-all shadow-md shadow-blue-900/20 flex items-center justify-center gap-2 cursor-pointer",children:[` +
            `o.jsx("span",{children:"হোম পেজে ফিরে যান"}),` +
            `o.jsx("span",{children:"➔"})` +
          `]}),` +
          `o.jsxs("button",{type:"button",onClick:()=>{window.print();},className:"w-full bg-slate-100 hover:bg-slate-200 active:scale-[0.98] text-slate-700 py-3 rounded-2xl font-bold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer border border-slate-200/60",children:[` +
            `o.jsx("span",{children:"🖨️"}),` +
            `o.jsx("span",{children:"রসিদ প্রিন্ট বা ডাউনলোড করুন"})` +
          `]})` +
        `]})` +
      `]})})})`;

    code = code.replace(fullOldVlModal, exactModalCode);
    console.log(`[Exact Modal Patch] Successfully updated vl popup in ${file}`);
  }

  try {
    esbuild.transformSync(code, { loader: "js" });
    fs.writeFileSync(file, code, "utf8");
    console.log(`[Exact Modal Patch] Validated ${file}`);
  } catch (e) {
    console.error(`[Exact Modal Patch] Error in ${file}:`, e.message);
  }
}

console.log("[Exact Modal Patch] Completed!");
