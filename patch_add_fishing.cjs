const fs = require('fs');
const path = require('path');
const esbuild = require('esbuild');

console.log('[Fishing Games Patch] Starting patch...');

const targets = [
  path.join(__dirname, 'dist/assets/index-sn777-v12.js'),
  path.join(__dirname, 'dist_backup/assets/index-sn777-v12.js'),
  path.join(__dirname, 'original-index-sn777-v5.js'),
  path.join(__dirname, 'public/assets/index-sn777-v12.js')
];

const fishingProviders = [
    { title: "JILI", icon: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjessdgCem41qNzUMd-yLXBtZkKt7AEkcXAfSy-yT3uFnvb9fXXr_c_JUbyRu9EHjYNDeQ0lC3yZDMLPGq_zduTog1I-lsIzizfBRdHLOKo6hDOkE1CFg8JEnZ_ZtIa9BZCxOEn_oZhl0dvS9FLiR2tUNWXb5rUm_DBgBr6boxLhwhrkDQ-NvnoLVpes1nQ/s120/provider-awcv2_jili.png" },
    { title: "FC", icon: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjI37CASsqIXZ9FS68u2Vo0NOt4Kh2wxaRBLgwFLSlEWttNEJI1Sy2uOv7Ut7NgkY3PjbkHxIJrOh1n-_MjSh7uTm1DHxoFw7g9eKa1-Jo88r3OVmeLy6aozGzGiyi1pSypzy4S5_TST0XRI4PxuUaI7KZjihP8U0ei0rF_v455jVrfKH2TM6R6CChZ3lDh/s120/provider-awcv2_fc.png" },
    { title: "GTF", icon: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgDCKkwLzALYoUXc0KzFU8AL-0qv806BQAWZlnNFsnMNVb81AEoc_FqCv-cuTkvdTUdokWfT8Bs9vHwEbT0uhIr9BtyqGDIuGr5dMgtMlGMtblhn79eYCgYU4MeOA-cS4OPLfQZL5fDypoDrPWNvv_i8N9VHfh7yjZBUjoLnhsZfsdmE3pJRxVfOYpd-pvb/s120/provider-awcv2_gtf.png" },
    { title: "JDB", icon: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEht1EH5nfdmUETFfsQZtVSkBY9dqYQVssawVLxOycbkeUJ9C3tZZpP8cvq-aUNVT5YDp4a6ifCkZO-Xzmlo7R6Lbegx2UkmaOaydWAhczc_XzAfwFEuRqJXTYQe5VcEioolf_sjd90sjLmmLVydOoAc5-zt3bG4k4_FgRb2VArx6a4zfFVaT17aou1bzcl1/s120/provider-awcv2_jdb.png" },
    { title: "SG", icon: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgutvqbnH6d04KkdHZQ5MhYNkODuJjpAPZ_Q0pCHhExeu0L_7wrp-ZtP36_APbMXNLtfs_fg47EpJo7n2dihMqZ9cUC2KS3Q1jXY2HaOKfnaf0aEBKavknLSY-gRogiiiQSzwdUxWTYRNRHNfpnssPlMGSiy60GAs5XQ39IL-rVUn-Yf6BG1BZnossC2ZqX/s120/provider-awcv2_spade.png" },
    { title: "YELLOWBAT", icon: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEj-8Fm0wrTld_zhkleR7eYF9tZhsV5dGAPpWypYrBeWS9xB-VoKzL6bf8ZQGE4RoA-J3mkFFFuTyOXmpaEaITjlF1NE-RyR9yVQ3jr_HuVaQ0QxV2HK3d9va3yOpFhmofxYFOQTh4SAKkTVs9BuYMcymXQh5_YR_6B8E6XxJdZLSRtzfFZ5WEzP8vFbe6wZ/s120/provider-awcv2_yesbingo.png" },
    { title: "CQ9", icon: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgQozXn0t75E-0d0jRZaiTYl4VLb2bhH9I3VZrrVoC_Qla_GTuX7Yit-tXcPkRR-M4136rCpUEE8aWnrpS8QI9teRuAzwsZEjP4HusDxgYy09AB9cDsDc3DTl5NvuouPJfbpaUQ3iUnc7q3vHgS1yWL0guKBSxPfdfPurcDv8FR4kQPpaBZUZWe8-qpQSoV/s120/provider-cq9.png" },
    { title: "JOKER", icon: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgWnAUN2AkaGKLD4Fp_zwVnEniKGXM9IfOk9tYOvJ6lOg7EndH5Z6uwiJjXsHowa3N7KS1Ge5G23bMWBkLGNEOeupK56-xzk-69XQwiXhQho1Ch4-gAB0PwFTPu4duICl5ykBm7m59KqNt0eI40mRqqrJFEa-NlqoEBT63mzgzYJ5uTNCj533ReJvVYlgxF/s120/provider-joker.png" },
    { title: "KA", icon: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEitM4XGbCyhebfMqXQfCR0NfDW9AV7K_O_NRpdNy0TMfQ9Iu81i0mN6qAL09mlkwOqSHEI673JfMFfNHw8UZam7JAfbkEyh1oiOi8EJknLC7aY1nFV65RXfMihqX3oc3jTyCmx0qHXOGPcSHaCcIZnkuGoX8gwUeXZu20sImJ4hWoMPrcrKVV0siPvQtlKt/s120/provider-ka.png" },
    { title: "LUCKY365", icon: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEh1rX1ojt-fiO5VlMfr0u5e0orr5I-kN7NsdBLKx7IATfIqv3CUiTN4k0ojCyHvphqn0MfpQ3YMtBAfega1Q8iQ3sKVwXksKKO7uPNre2u6SDwfRNEIv6qbUL-4kXlnRVyt8LN6qlmwINdU28dHitJbOECxCRbUW8XbIZHfGxio_R0mnfV3HQqcu53mEDC1/s120/provider-lucky365.png" },
    { title: "YL", icon: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEj8JeDLF6v1JBh4Npct4Dsdz7UPTiEEnJxlAHblZcPZpLtuQMJJljKF9vWOIMODhEou7mmMdBWri2uB3uEkimDBJfazqhPtDroJQlJfCp6z0zqsVygR7l9TPpUe7i0BvXYOWlW68CzdiWzbqeOrSWA_WWuwU-llSAbB957mxKrL2B4jKU0WwzH4SzUleTUO/s360/provider-awcv2_yl.png" },
    { title: "INJOY", icon: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEiXywSCiayNskxzeYcpEyJbh1ZHc-_xH5snhIhSs7ZMQEBf5f0EtgvhJiYiHACIE7f-Adnd6HxA8IHJiOgtOQtiMnsQPC9PrAo9S0neBK9UL8SIx-BqVi24iHHTVNxm-EwP6IrcPG_-vXW5R-2ynYjUgnbIywBGqT_kpdBk2ef1z5zxEPZPXQGBqeLzx2bh/s120/provider-jdbinjoy.png" },
    { title: "RICH88", icon: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjRj-Ik-8njhgHmMc4TWl1mOhyBMu5rCF1qOKFMTpUcIhOEVPdS9RMIM7Hpc5ltHWKJJZuS5IgYQPfQEcb59ZFoT2c3Yka1V9NHTNcKMYcIX_psvSFm_M7M3Uly3nhqQMPYUMOuBAycr0kbFBWJk59yswh0ZiZBPfwrkuaoyZV5Svpv7p9WAl6CGuFICyWi/s360/provider-rich88.png" },
    { title: "WORLDMATCH", icon: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhMMNtfez2ppvniLPXxxIuyAlW1I-f2CVVy2qjhQxExKzfpoERJZj_7QalmCfhesokbtumTaxt6GOBNe_Oe5GpLJAXeMTlGJ33rwtZikXOAPMFoevjfTiBET9RvUu1Xl-GefY2pGYI5u7B9kx6xKnyI4ToaWH2RAUvxeuwyou9xXu9x9CzXAGzMb-2sHXjB/s120/provider-worldmatch.png" },
    { title: "HABANERO", icon: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEiFQy0O8xcTpMnlEPFmmw9Xzxw15x2iAit7sA2sPjiCKlbV5lF_pbLakYqnbnKfBgoSjirTNm560QqI8-gfpOEbPV3eO-BDJDPQSDu5j5m5eALSo5Icqc9Zxx1bw6etcAgQ8-S50_GYnlbtAHuKPP9apP8ZOPnjhVtX8mW5aTPpiMQzbA5Mc3xAsEMZoJTh/s120/provider-awcv2_habanero.png" }

];

targets.forEach(filePath => {
  if (!fs.existsSync(filePath)) return;
  let code = fs.readFileSync(filePath, 'utf8');
  let changed = false;

  fishingProviders.forEach(p => {
    const folderFishing = `{title:"${p.title}",image:"${p.icon}",category:"ফিশিং",isHot:!1}`;
    
    // 1. Remove all existing instances of this provider in "ফিশিং" category
    // Use a regex that is image-URL agnostic
    const removeRegex = new RegExp(`\\{title:"${p.title}",[^{}]*category:"ফিশিং"[^{}]*\\}`, 'g');
    
    if (code.match(removeRegex)) {
        code = code.replace(removeRegex, "");
        // Clean up resulting comma issues like [,,] or {,,}
        code = code.replace(/,+/g, ',');
        code = code.replace(/\[,/g, '[');
        code = code.replace(/,\]/g, ']');
        code = code.replace(/\{,/g, '{');
        code = code.replace(/,\}/g, '}');
    }
    
    // 2. Add it back once before AVIATOR
    const aviatorPos = code.indexOf('{title:"AVIATOR"');
    if (aviatorPos !== -1) {
        code = code.replace('{title:"AVIATOR"', `${folderFishing},{title:"AVIATOR"`);
        changed = true;
        console.log(`[Fishing Patch] Synced ${p.title} to ফিশিং category in ${path.basename(filePath)}`);
    }
  });

  // Hide Ice Fishing from ফিশিং category
  const iceFishingRegex = /\{title:"Ice Fishing",[^{}]*category:"ফিশিং"[^{}]*\}/g;
  if (iceFishingRegex.test(code)) {
    code = code.replace(iceFishingRegex, (match) => {
        console.log(`[Fishing Patch] Hiding Ice Fishing from ফিশিং category in ${path.basename(filePath)}`);
        return match.replace('category:"ফিশিং"', 'category:"HIDDEN_FISHING"');
    });
    changed = true;
  }

  // Validate syntax
  try {
    esbuild.transformSync(code, { loader: 'js' });
    fs.writeFileSync(filePath, code, 'utf8');
    console.log(`[Fishing Patch] Successfully patched ${path.basename(filePath)}`);
  } catch (err) {
    console.error(`[Fishing Patch] Syntax error prevented writing ${path.basename(filePath)}:`, err.message);
  }
});

console.log('[Fishing Patch] Completed successfully!');
