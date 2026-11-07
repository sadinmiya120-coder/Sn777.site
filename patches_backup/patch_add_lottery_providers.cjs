const fs = require('fs');
const path = require('path');
const esbuild = require('esbuild');

console.log('[Lottery Providers Patch] Starting patch...');

const targets = [
  path.join(__dirname, 'dist/assets/index-sn777-v12.js'),
  path.join(__dirname, 'dist_backup/assets/index-sn777-v12.js'),
  path.join(__dirname, 'original-index-sn777-v5.js'),
  path.join(__dirname, 'public/assets/index-sn777-v12.js')
];

const lotteryProviders = [
  { title: "JILI", icon: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjessdgCem41qNzUMd-yLXBtZkKt7AEkcXAfSy-yT3uFnvb9fXXr_c_JUbyRu9EHjYNDeQ0lC3yZDMLPGq_zduTog1I-lsIzizfBRdHLOKo6hDOkE1CFg8JEnZ_ZtIa9BZCxOEn_oZhl0dvS9FLiR2tUNWXb5rUm_DBgBr6boxLhwhrkDQ-NvnoLVpes1nQ/s120/provider-awcv2_jili.png" },
  { title: "MONOPOLY", icon: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEiOkyplq5U_mbnfFkb_heLxDN__Kh7h7GfwOAR1w_EzAnLOiLxXEGfHWZtctDTO_jU0TTzCpbPkxezuGZBZU1kew_2h2LHCI2b6I8uU5QFhyphenhyphenXxShDVqlxSSGMBpoQVI37Vx76RjeabnTV4lUtoSuFIzCI8uzTES5FIlFfL3VEOyjFmLZI_bxpYxml1AeiMT/s120/provider-monopoly.png" },
  { title: "HACKSAW", icon: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEiD4ByW5jRAUyvPjr0noA7t_pARGbx_zzTA2XBbOCQCbI8gOJ7ef0N7Dwdyr50doBZdvBXmC4p_CCYqcrBecdRbmLkaWMki7uV7NJbszsfsfyMFyhidIn96P7YfWVXa6LUQOEkZirBinB-XfzuZAR9Mv3nqzsYU-iRhAEvrFZ1XIKGXm9fQsEx10RMNJWJ7/s120/provider-awcv2_hacksaw.png" },
  { title: "KM", icon: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEg_oPxX2eHhdTGk7cZIiZ0HTDxPGBqKH5tZNTFr00jK4wfObGJhqP99kwSA2dHmhQEZMlDLqicSWlEPnf4hhGREVOHlbuMfgwsq_6U_Vf0_jak5Ktf8QHiK3muq6j-un0t4NCSyzWHp2kXaaurzm6Q-ehhqqpQuCoxLBNFoqBt4Hbk72OuzByTHTeYioOae/s120/provider-awcv2_kingmaker.png" },
  { title: "YELLOWBAT", icon: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEj-8Fm0wrTld_zhkleR7eYF9tZhsV5dGAPpWypYrBeWS9xB-VoKzL6bf8ZQGE4RoA-J3mkFFFuTyOXmpaEaITjlF1NE-RyR9yVQ3jr_HuVaQ0QxV2HK3d9va3yOpFhmofxYFOQTh4SAKkTVs9BuYMcymXQh5_YR_6B8E6XxJdZLSRtzfFZ5WEzP8vFbe6wZ/s120/provider-awcv2_yesbingo.png" },
  { title: "CQ9", icon: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgQozXn0t75E-0d0jRZaiTYl4VLb2bhH9I3VZrrVoC_Qla_GTuX7Yit-tXcPkRR-M4136rCpUEE8aWnrpS8QI9teRuAzwsZEjP4HusDxgYy09AB9cDsDc3DTl5NvuouPJfbpaUQ3iUnc7q3vHgS1yWL0guKBSxPfdfPurcDv8FR4kQPpaBZUZWe8-qpQSoV/s120/provider-cq9.png" },
  { title: "JOKER", icon: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgWnAUN2AkaGKLD4Fp_zwVnEniKGXM9IfOk9tYOvJ6lOg7EndH5Z6uwiJjXsHowa3N7KS1Ge5G23bMWBkLGNEOeupK56-xzk-69XQwiXhQho1Ch4-gAB0PwFTPu4duICl5ykBm7m59KqNt0eI40mRqqrJFEa-NlqoEBT63mzgzYJ5uTNCj533ReJvVYlgxF/s120/provider-joker.png" },
  { title: "RICH88", icon: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjRj-Ik-8njhgHmMc4TWl1mOhyBMu5rCF1qOKFMTpUcIhOEVPdS9RMIM7Hpc5ltHWKJJZuS5IgYQPfQEcb59ZFoT2c3Yka1V9NHTNcKMYcIX_psvSFm_M7M3Uly3nhqQMPYUMOuBAycr0kbFBWJk59yswh0ZiZBPfwrkuaoyZV5Svpv7p9WAl6CGuFICyWi/s360/provider-rich88.png" },
  { title: "SABA", icon: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjawsdmk-uM3xP8r8TAEwsBPksbuf2o2-xTSHzLH6CXGkU_Ib9JNoyfnr727Anpi4mRJo-KiBQ-v3yiYTImQnDqoodGr8W2p1q6cj_iazIQif-Ue9Ix6DDPU1w3utx5xljcc-kVEPc894rMXwDQcz22OvJtqCIOlsN_Ak8TPnDfZ_izKdSzD6AZGIZ9YobM/s120/provider-saba.png" }
];

targets.forEach(filePath => {
  if (!fs.existsSync(filePath)) return;
  let code = fs.readFileSync(filePath, 'utf8');
  let changed = false;

  // 1. Remove existing instances of these providers in "লটারি" category
  lotteryProviders.forEach(p => {
    const removeRegex = new RegExp(`\\{title:"${p.title}",[^{}]*category:"লটারি"[^{}]*\\},?`, 'g');
    if (removeRegex.test(code)) {
      code = code.replace(removeRegex, "");
      changed = true;
    }
  });

  // Clean commas
  code = code.replace(/,+/g, ',');
  code = code.replace(/\[,/g, '[');
  code = code.replace(/,\]/g, ']');

  // 2. Build lottery provider string
  const lotteryCards = lotteryProviders.map(p => `{title:"${p.title}",image:"${p.icon}",category:"লটারি",isHot:!1}`).join(',');

  // 3. Add before {title:"AVIATOR"
  const aviatorPos = code.indexOf('{title:"AVIATOR"');
  if (aviatorPos !== -1) {
    code = code.replace('{title:"AVIATOR"', `${lotteryCards},{title:"AVIATOR"`);
    changed = true;
    console.log(`[Lottery Providers Patch] Injected 9 lottery providers into ${path.basename(filePath)}`);
  }

  // 4. Also ensure SABA is in kc rules handler if not already present
  if (code.includes('||E==="AVIATOR"') && !code.includes('||E==="SABA"')) {
    code = code.replace('||E==="AVIATOR"', '||E==="AVIATOR"||E==="SABA"');
    changed = true;
  }

  // Final cleanup of any double commas
  code = code.replace(/,+/g, ',');
  code = code.replace(/\[,/g, '[');
  code = code.replace(/,\]/g, ']');

  // Validate syntax
  try {
    esbuild.transformSync(code, { loader: 'js' });
    fs.writeFileSync(filePath, code, 'utf8');
    console.log(`[Lottery Providers Patch] Successfully validated & saved ${path.basename(filePath)}`);
  } catch (err) {
    console.error(`[Lottery Providers Patch] Syntax error in ${path.basename(filePath)}:`, err.message);
  }
});

console.log('[Lottery Providers Patch] Completed successfully!');
