const fs = require('fs');
const path = require('path');
const esbuild = require('esbuild');

console.log('[Arcade Providers Patch] Starting patch...');

const targets = [
  path.join(__dirname, 'dist/assets/index-sn777-v12.js'),
  path.join(__dirname, 'dist_backup/assets/index-sn777-v12.js'),
  path.join(__dirname, 'original-index-sn777-v5.js'),
  path.join(__dirname, 'public/assets/index-sn777-v12.js')
];

const arcadeProviders = [
  { title: "JILI", icon: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjessdgCem41qNzUMd-yLXBtZkKt7AEkcXAfSy-yT3uFnvb9fXXr_c_JUbyRu9EHjYNDeQ0lC3yZDMLPGq_zduTog1I-lsIzizfBRdHLOKo6hDOkE1CFg8JEnZ_ZtIa9BZCxOEn_oZhl0dvS9FLiR2tUNWXb5rUm_DBgBr6boxLhwhrkDQ-NvnoLVpes1nQ/s120/provider-awcv2_jili.png" },
  { title: "CG", icon: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjmRzqJ5P-T6ApnaWtJP3bZQ9eMjj3OmuSMLweIs0AQ0sk2II301CPukfjCSefKg23LU_ktCbnl3iVIeP4IfkI91xm9lHjfb_l1vqvspjtYvV8EFEiUlpkd5PSS66UVdG7pswaeoQTwsc1f4NQvMHEW7AgfZogvKRK26c9HP6ARnbqKMrywdRzz5aq845z9/s120/provider-awcv2_cg.png" },
  { title: "FC", icon: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjI37CASsqIXZ9FS68u2Vo0NOt4Kh2wxaRBLgwFLSlEWttNEJI1Sy2uOv7Ut7NgkY3PjbkHxIJrOh1n-_MjSh7uTm1DHxoFw7g9eKa1-Jo88r3OVmeLy6aozGzGiyi1pSypzy4S5_TST0XRI4PxuUaI7KZjihP8U0ei0rF_v455jVrfKH2TM6R6CChZ3lDh/s120/provider-awcv2_fc.png" },
  { title: "HACKSAW", icon: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEiD4ByW5jRAUyvPjr0noA7t_pARGbx_zzTA2XBbOCQCbI8gOJ7ef0N7Dwdyr50doBZdvBXmC4p_CCYqcrBecdRbmLkaWMki7uV7NJbszsfsfyMFyhidIn96P7YfWVXa6LUQOEkZirBinB-XfzuZAR9Mv3nqzsYU-iRhAEvrFZ1XIKGXm9fQsEx10RMNJWJ7/s120/provider-awcv2_hacksaw.png" },
  { title: "KM", icon: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEg_oPxX2eHhdTGk7cZIiZ0HTDxPGBqKH5tZNTFr00jK4wfObGJhqP99kwSA2dHmhQEZMlDLqicSWlEPnf4hhGREVOHlbuMfgwsq_6U_Vf0_jak5Ktf8QHiK3muq6j-un0t4NCSyzWHp2kXaaurzm6Q-ehhqqpQuCoxLBNFoqBt4Hbk72OuzByTHTeYioOae/s120/provider-awcv2_kingmaker.png" },
  { title: "MIMI", icon: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEiOjPfkNFlng0VPGXz-8UWHrvxRzFPi12H-Tkq_KTG2XqV-eVlGvTO_CcWAp782eo-T_8vnu-V2jXKOqTMq2wd6nKMyIMaK3WsjDgWwe_QPET6wbNCd0YBbY80hJHPFhHy3Xza0MRXF1Lsj7xX_gM0DOo3JzRIDniwhDvkhBBJ8VaPcRtBTTm19VU-Ceq_S/s120/provider-mimi.png" },
  { title: "PG", icon: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEiSVKhAnrlFv-ZatgcAKGZ3m0b8JGJRCuERTUi5aCb3qER7RlEad-r1l6at218Uk2YwUpom4aN6fCquRaWXUfXKo5ZVHTIjbLi1dDQGIHB9Q4O8F1TALtIaeqUFd78lMI0MV9YiuIHyQq6YZ7ufIC6BPq7-RRqUey9-T93d1n6wND_cio20hCm8I4_vmc-N/s120/provider-awcv2_pg.png" },
  { title: "PP", icon: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEiMPZWLFyD6YlVWO4bmuZXAxlCYR8pjpFZHlqviWga8hDmHzZwLiaSt6FeiGbfDwQxVXO34aqc-cHN9KqGfgSKbcyt-ehIM8mniu9AdsRpPfyemOXN__7WFexeZGgtHPp4wVtduP_xKX6xDnB25i4wyXbSNBhxEczajBFOnaGElEspurSpxOCgdfAGGpasr/s120/provider-awcv2_pp%20(1).png" },
  { title: "RELAX", icon: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEiVgAI2oDPNT31ndE7-qpIHfNZKIb_pc0FCm9YUzTQwGt-gf4WsEUtub1oC025VtwzZ2PUFSPwAxRcSqtON5BOr5hkH51F-S8JeR4ZR4ZWh77gGBsGXlR9TuLsVzoDeompZP69VC6m5YIeydpeNfzlZY7VCZc6gChBFf0v_DSA_n6qInxgnXy4Z8zluRhlB/s120/provider-awcv2_relax.png" },
  { title: "YL", icon: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEj8JeDLF6v1JBh4Npct4Dsdz7UPTiEEnJxlAHblZcPZpLtuQMJJljKF9vWOIMODhEou7mmMdBWri2uB3uEkimDBJfazqhPtDroJQlJfCp6z0zqsVygR7l9TPpUe7i0BvXYOWlW68CzdiWzbqeOrSWA_WWuwU-llSAbB957mxKrL2B4jKU0WwzH4SzUleTUO/s360/provider-awcv2_yl.png" },
  { title: "CQ9", icon: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgQozXn0t75E-0d0jRZaiTYl4VLb2bhH9I3VZrrVoC_Qla_GTuX7Yit-tXcPkRR-M4136rCpUEE8aWnrpS8QI9teRuAzwsZEjP4HusDxgYy09AB9cDsDc3DTl5NvuouPJfbpaUQ3iUnc7q3vHgS1yWL0guKBSxPfdfPurcDv8FR4kQPpaBZUZWe8-qpQSoV/s120/provider-cq9.png" },
  { title: "INJOY", icon: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEiXywSCiayNskxzeYcpEyJbh1ZHc-_xH5snhIhSs7ZMQEBf5f0EtgvhJiYiHACIE7f-Adnd6HxA8IHJiOgtOQtiMnsQPC9PrAo9S0neBK9UL8SIx-BqVi24iHHTVNxm-EwP6IrcPG_-vXW5R-2ynYjUgnbIywBGqT_kpdBk2ef1z5zxEPZPXQGBqeLzx2bh/s120/provider-jdbinjoy.png" },
  { title: "KA", icon: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEitM4XGbCyhebfMqXQfCR0NfDW9AV7K_O_NRpdNy0TMfQ9Iu81i0mN6qAL09mlkwOqSHEI673JfMFfNHw8UZam7JAfbkEyh1oiOi8EJknLC7aY1nFV65RXfMihqX3oc3jTyCmx0qHXOGPcSHaCcIZnkuGoX8gwUeXZu20sImJ4hWoMPrcrKVV0siPvQtlKt/s120/provider-ka.png" },
  { title: "LUCKY365", icon: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEh1rX1ojt-fiO5VlMfr0u5e0orr5I-kN7NsdBLKx7IATfIqv3CUiTN4k0ojCyHvphqn0MfpQ3YMtBAfega1Q8iQ3sKVwXksKKO7uPNre2u6SDwfRNEIv6qbUL-4kXlnRVyt8LN6qlmwINdU28dHitJbOECxCRbUW8XbIZHfGxio_R0mnfV3HQqcu53mEDC1/s120/provider-lucky365.png" },
  { title: "NEXTSPIN", icon: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjx8LPmZoSOWtq90T9NB2SDLY8JyNKU6VZ5UTFFM31LLNgvdtj4CoiSmFmZVgvgKfLKN3xX9IsMvbTDzxSo849swGxzDlJH6KNHY6Au-PnOSo1vIN3Uwx-mrFk3O2cFQG9-ecOt83RvzvC5r0k-43ZaE1nV5HW2TI9BggCb0cAxKj_IOuzOC3cCDYil2jPP/s120/provider-awcv2_nextspin.png" },
  { title: "RICH88", icon: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjRj-Ik-8njhgHmMc4TWl1mOhyBMu5rCF1qOKFMTpUcIhOEVPdS9RMIM7Hpc5ltHWKJJZuS5IgYQPfQEcb59ZFoT2c3Yka1V9NHTNcKMYcIX_psvSFm_M7M3Uly3nhqQMPYUMOuBAycr0kbFBWJk59yswh0ZiZBPfwrkuaoyZV5Svpv7p9WAl6CGuFICyWi/s360/provider-rich88.png" },
  { title: "JDB", icon: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEht1EH5nfdmUETFfsQZtVSkBY9dqYQVssawVLxOycbkeUJ9C3tZZpP8cvq-aUNVT5YDp4a6ifCkZO-Xzmlo7R6Lbegx2UkmaOaydWAhczc_XzAfwFEuRqJXTYQe5VcEioolf_sjd90sjLmmLVydOoAc5-zt3bG4k4_FgRb2VArx6a4zfFVaT17aou1bzcl1/s120/provider-awcv2_jdb.png" },
  { title: "MICROSLOT", icon: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEia7OZJkpobmczV044nOviwc4_MfjWuyuYd7XCglhlAMP0-PDadY8QKzMFHaGQ0yKJPfaOnKUBeBmAZw0w_2JDXigUDgjPXBb-9OAylFvrj82ehvEeWiFIGHsCIgs5NSexpaPdb7KusuxbBvUGNLvpSfwVwRPHhnJSQzUAFXzNMx9oyyz0txCziSRWeyoVu/s120/provider-awcv2_microslot.png" }
];

targets.forEach(filePath => {
  if (!fs.existsSync(filePath)) return;
  let code = fs.readFileSync(filePath, 'utf8');
  let changed = false;

  // 1. Remove existing instances of these providers in "আর্কেড" category
  arcadeProviders.forEach(p => {
    const removeRegex = new RegExp(`\\{title:"${p.title}",[^{}]*category:"আর্কেড"[^{}]*\\},?`, 'g');
    if (removeRegex.test(code)) {
      code = code.replace(removeRegex, "");
      changed = true;
    }
  });

  // Clean comma spacing
  code = code.replace(/,+/g, ',');
  code = code.replace(/\[,/g, '[');
  code = code.replace(/,\]/g, ']');

  // 2. Build arcade provider string
  const arcadeCards = arcadeProviders.map(p => `{title:"${p.title}",image:"${p.icon}",category:"আর্কেড",isHot:!1}`).join(',');

  // 3. Add before {title:"AVIATOR"
  const aviatorPos = code.indexOf('{title:"AVIATOR"');
  if (aviatorPos !== -1) {
    code = code.replace('{title:"AVIATOR"', `${arcadeCards},{title:"AVIATOR"`);
    changed = true;
    console.log(`[Arcade Providers Patch] Injected 18 arcade providers into ${path.basename(filePath)}`);
  }

  // Final cleanup of any double commas
  code = code.replace(/,+/g, ',');
  code = code.replace(/\[,/g, '[');
  code = code.replace(/,\]/g, ']');

  // Validate syntax
  try {
    esbuild.transformSync(code, { loader: 'js' });
    fs.writeFileSync(filePath, code, 'utf8');
    console.log(`[Arcade Providers Patch] Successfully validated & saved ${path.basename(filePath)}`);
  } catch (err) {
    console.error(`[Arcade Providers Patch] Syntax error in ${path.basename(filePath)}:`, err.message);
  }
});

console.log('[Arcade Providers Patch] Completed successfully!');
