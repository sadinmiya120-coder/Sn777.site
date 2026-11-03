const fs = require("fs");
const path = require("path");

console.log("[Crash CRASH88 Patch] Starting permanent patch...");

const targets = [
  "dist/assets/index-sn777-v12.js",
  "dist_backup/assets/index-sn777-v12.js",
  "original-index-sn777-v5.js",
  "public/assets/index-sn777-v12.js"
];

const imgUrl = "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEiDAhi9FFBlL4i4yXbCAruKcu-_8CELKe5FZb2KfpanCMLV6KlusG8ySCuJ3DEgFPKGkdog3kNBMajR0rcaNgFN3HK82Wwcz0eYU9L6a0wOrPHFbBp42ftXfKA550F60Z30bZO5YXl73ta1Tj17c6BA9EejWIPef82JmgVfdwBiQ6qSjwChljpiBgsz1bEg/s120/provider-awcv2_crash88.png";
// isHot:!1 hides CRASH88 from Hot games
const crash88Obj = `{title:"CRASH88",image:"${imgUrl}",category:"ক্র্যাশ",isHot:!1}`;

targets.forEach(filePath => {
  if (!fs.existsSync(filePath)) return;
  let code = fs.readFileSync(filePath, "utf8");
  let modified = false;

  // Ensure CRASH88 is present in Crash category with isHot:!1
  if (code.includes(`title:"CRASH88"`)) {
    code = code.replace(/\{title:"CRASH88",image:"[^"]+",category:"ক্র্যাশ",isHot:[^}]+\}/g, crash88Obj);
    modified = true;
  } else {
    const marker = `{title:"Aviator"`;
    if (code.includes(marker)) {
      code = code.replace(marker, crash88Obj + "," + marker);
      modified = true;
    }
  }

  // Ensure CRASH88 is in provider rules check so clicking opens deposit rules modal
  if (code.includes('if(E==="JILI"') && !code.includes('if(E==="CRASH88"||E==="JILI"')) {
    code = code.replace('if(E==="JILI"', 'if(E==="CRASH88"||E==="JILI"');
    modified = true;
  }

  if (modified) {
    fs.writeFileSync(filePath, code, "utf8");
    console.log(`[Crash CRASH88 Patch] Processed ${path.basename(filePath)}`);
  }
});

console.log("[Crash CRASH88 Patch] Completed successfully!");
