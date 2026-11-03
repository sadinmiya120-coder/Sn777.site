const fs = require("fs");
const path = require("path");

console.log("[Patch All Crash Providers] Starting sync for all Crash category providers...");

const targets = [
  path.join(__dirname, "dist/assets/index-sn777-v12.js"),
  path.join(__dirname, "dist_backup/assets/index-sn777-v12.js"),
  path.join(__dirname, "original-index-sn777-v5.js"),
  path.join(__dirname, "public/assets/index-sn777-v12.js")
];

const crash88Img = "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEiDAhi9FFBlL4i4yXbCAruKcu-_8CELKe5FZb2KfpanCMLV6KlusG8ySCuJ3DEgFPKGkdog3kNBMajR0rcaNgFN3HK82Wwcz0eYU9L6a0wOrPHFbBp42ftXfKA550F60Z30bZO5YXl73ta1Tj17c6BA9EejWIPef82JmgVfdwBiQ6qSjwChljpiBgsz1bEg/s120/provider-awcv2_crash88.png";
const aviator2Img = "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjrG9jOehiozyFRoPwiX4WHCzuVp67dlTUsj_VXSYpy-KddzVy2N6F7cEBv1IjqqUHaPeMcDmGybU0DsNv6PBQXkDoq9iwl35ZhO4A09yx6j0fKrAzWT8oU4taeeL1OEMb-A7Gl41mNF4UBAHcv0GaVthqSgOasLl9JLOh88t6uLMGJcMjWDDP1C3envl-G/s120/provider-awcv2_aviator2.png";
const smartsoftImg = "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjn9PCwXIk1ekV5EL36qnpbrEJEL2nwedeYNTizO6WMHMi0C2q1HarR3VyrKWmWC299uQJzgIvz4YxR4zhQbVkM1iHsKRdeeVTNK51B6_wfl5NP-ZI1HBpF00i-daq2PUfkuBqXdAFXym_wqmJpsRsAbn3D4yibh2ZCIifRwJ0ZLYV3RXuCpmYDiW9TpuTb/s120/provider-awcv2_smartsoft.png";

const crash88Obj = `{title:"CRASH88",image:"${crash88Img}",category:"ক্র্যাশ",isHot:!0}`;
const aviator2Obj = `{title:"AVIATOR2",image:"${aviator2Img}",category:"ক্র্যাশ",isHot:!0}`;
const smartsoftObj = `{title:"SMARTSOFT",image:"${smartsoftImg}",category:"ক্র্যাশ",isHot:!1}`;

targets.forEach(filePath => {
  if (!fs.existsSync(filePath)) return;
  let code = fs.readFileSync(filePath, "utf8");
  let changed = false;

  // 1. Ensure CRASH88
  if (!code.includes(`title:"CRASH88"`)) {
    const marker = `{title:"Aviator"`;
    if (code.includes(marker)) {
      code = code.replace(marker, crash88Obj + "," + marker);
      changed = true;
      console.log(`[Crash Sync] Added CRASH88 to ${path.basename(filePath)}`);
    }
  } else {
    // Update image if needed
    code = code.replace(/\{title:"CRASH88",image:"[^"]+",category:"ক্র্যাশ",isHot:[^}]+\}/g, crash88Obj);
    changed = true;
  }

  // 2. Ensure AVIATOR2
  if (!code.includes(`title:"AVIATOR2"`)) {
    const marker = `{title:"Aviator"`;
    if (code.includes(marker)) {
      code = code.replace(marker, aviator2Obj + "," + marker);
      changed = true;
      console.log(`[Crash Sync] Added AVIATOR2 to ${path.basename(filePath)}`);
    }
  } else {
    code = code.replace(/\{title:"AVIATOR2",image:"[^"]+",category:"ক্র্যাশ",isHot:[^}]+\}/g, aviator2Obj);
    changed = true;
  }

  // 3. Ensure SMARTSOFT
  if (!code.includes(`title:"SMARTSOFT"`)) {
    const marker = `{title:"Aviator"`;
    if (code.includes(marker)) {
      code = code.replace(marker, smartsoftObj + "," + marker);
      changed = true;
      console.log(`[Crash Sync] Added SMARTSOFT to ${path.basename(filePath)}`);
    }
  } else {
    code = code.replace(/\{title:"SMARTSOFT",image:"[^"]+",category:"ক্র্যাশ",isHot:[^}]+\}/g, smartsoftObj);
    changed = true;
  }

  // Ensure direct rules check in kc
  const rulesList = ['CRASH88', 'AVIATOR2', 'SMARTSOFT'];
  rulesList.forEach(prov => {
    if (code.includes('if(E==="JILI"') && !code.includes(`E==="${prov}"`)) {
      code = code.replace('if(E==="JILI"', `if(E==="${prov}"||E==="JILI"`);
      changed = true;
      console.log(`[Crash Sync] Added ${prov} to provider rules in ${path.basename(filePath)}`);
    }
  });

  if (changed) {
    fs.writeFileSync(filePath, code, "utf8");
  }
});

// Also mirror dist/assets/index-sn777-v12.js to public/assets/index-sn777-v12.js
try {
  const distFile = path.join(__dirname, "dist/assets/index-sn777-v12.js");
  const publicFile = path.join(__dirname, "public/assets/index-sn777-v12.js");
  const backupFile = path.join(__dirname, "dist_backup/assets/index-sn777-v12.js");
  if (fs.existsSync(distFile)) {
    fs.copyFileSync(distFile, publicFile);
    fs.copyFileSync(distFile, backupFile);
    console.log("[Crash Sync] Successfully copied updated index-sn777-v12.js to public & dist_backup!");
  }
} catch (err) {
  console.error("[Crash Sync Error]", err.message);
}
