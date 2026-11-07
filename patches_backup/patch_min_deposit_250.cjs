const fs = require("fs");
const esbuild = require("esbuild");

const filesToPatch = [
  "dist/assets/index-sn777-v7.js",
  "dist_backup/assets/index-sn777-v7.js",
  "dist/assets/index-sn777-v5.js",
  "dist_backup/assets/index-sn777-v5.js",
  "dist/assets/index-sn777-v6.js",
  "dist_backup/assets/index-sn777-v6.js"
];

filesToPatch.forEach(filePath => {
  if (!fs.existsSync(filePath)) {
    console.log("Skipping non-existent file:", filePath);
    return;
  }

  let code = fs.readFileSync(filePath, "utf8");
  let modified = false;

  // 1. ya preset array
  const oldYa = 'ya=[{amount:"200",displayOrig:"200",total:"200",bonusPercent:""}';
  const newYa = 'ya=[{amount:"150",displayOrig:"150",total:"150",bonusPercent:""}';
  if (code.includes(oldYa)) {
    code = code.replace(oldYa, newYa);
    console.log(`[${filePath}] Replaced ya array first item to 150`);
    modified = true;
  }

  // 2. validation ee=L?500:200 -> ee=L?500:150
  if (code.includes("ee=L?500:200")) {
    code = code.replaceAll("ee=L?500:200", "ee=L?500:150");
    console.log(`[${filePath}] Replaced ee=L?500:200 with ee=L?500:150`);
    modified = true;
  }

  // 3. Limit badge
  if (code.includes('children:"সীমা: ৳২০০ - ৳২৫,০০০"')) {
    code = code.replaceAll('children:"সীমা: ৳২০০ - ৳২৫,০০০"', 'children:"সীমা: ৳১৫০ - ৳২৫,০০০"');
    console.log(`[${filePath}] Replaced deposit limit badge text to ৳১৫০`);
    modified = true;
  }

  // 4. Warning modal title
  if (code.includes('children:"২০০ টাকা"})," ডিপোজিট করেন"]')) {
    code = code.replaceAll('children:"২০০ টাকা"})," ডিপোজিট করেন"]', 'children:"১৫০ টাকা"})," ডিপোজিট করেন"]');
    console.log(`[${filePath}] Replaced warning modal title text to ১৫০ টাকা`);
    modified = true;
  }

  // 5. Warning modal range text
  if (code.includes('children:"২০০ টাকা"})," থেকে "')) {
    code = code.replaceAll('children:"২০০ টাকা"})," থেকে "', 'children:"১৫০ টাকা"})," থেকে "');
    console.log(`[${filePath}] Replaced warning modal range text to ১৫০ টাকা`);
    modified = true;
  }

  // 6. Warning modal note text
  if (code.includes('পর্যন্ত। ২০০ টাকা ডিপোজিট করলে সাথে সাথে')) {
    code = code.replaceAll('পর্যন্ত। ২০০ টাকা ডিপোজিট করলে সাথে সাথে', 'পর্যন্ত। ১৫০ টাকা ডিপোজিট করলে সাথে সাথে');
    console.log(`[${filePath}] Replaced warning modal note text to ১৫০ টাকা`);
    modified = true;
  }

  // 7. Warning modal button click
  if (code.includes('onClick:()=>{fi("200"),be(!1)}')) {
    code = code.replaceAll('onClick:()=>{fi("200"),be(!1)}', 'onClick:()=>{fi("150"),be(!1)}');
    console.log(`[${filePath}] Replaced warning modal button action to select 150`);
    modified = true;
  }

  // 8. Warning modal button label
  if (code.includes('"৳২০০ সিলেক্ট করে এগিয়ে যান"')) {
    code = code.replaceAll('"৳২০০ সিলেক্ট করে এগিয়ে যান"', '"৳১৫০ সিলেক্ট করে এগিয়ে যান"');
    console.log(`[${filePath}] Replaced warning modal button label to ৳১৫০`);
    modified = true;
  }

  // Verify syntax with esbuild
  try {
    esbuild.transformSync(code, { loader: "js" });
    console.log(`[${filePath}] Syntax validation PASSED!`);
  } catch (err) {
    console.error(`[${filePath}] Syntax validation FAILED:`, err);
    process.exit(1);
  }

  fs.writeFileSync(filePath, code, "utf8");
  console.log(`[${filePath}] Successfully saved!`);
});

// Also create index-sn777-v8.js from index-sn777-v7.js
fs.copyFileSync("dist/assets/index-sn777-v7.js", "dist/assets/index-sn777-v8.js");
fs.copyFileSync("dist_backup/assets/index-sn777-v7.js", "dist_backup/assets/index-sn777-v8.js");
console.log("Created index-sn777-v8.js in dist and dist_backup");
