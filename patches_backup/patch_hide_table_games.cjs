const fs = require('fs');
const path = require('path');
const esbuild = require('esbuild');

console.log('[Table Games Patch] Starting patch...');

const targets = [
  path.join(__dirname, 'dist/assets/index-sn777-v12.js'),
  path.join(__dirname, 'dist_backup/assets/index-sn777-v12.js'),
  path.join(__dirname, 'original-index-sn777-v5.js'),
  path.join(__dirname, 'public/assets/index-sn777-v12.js')
];

const jiliIcon = 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjessdgCem41qNzUMd-yLXBtZkKt7AEkcXAfSy-yT3uFnvb9fXXr_c_JUbyRu9EHjYNDeQ0lC3yZDMLPGq_zduTog1I-lsIzizfBRdHLOKo6hDOkE1CFg8JEnZ_ZtIa9BZCxOEn_oZhl0dvS9FLiR2tUNWXb5rUm_DBgBr6boxLhwhrkDQ-NvnoLVpes1nQ/s120/provider-awcv2_jili.png';
const jiliFolderTable = `{title:"JILI",image:"${jiliIcon}",category:"টেবিল",isHot:!1}`;

const monopolyIcon = 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEiOkyplq5U_mbnfFkb_heLxDN__Kh7h7GfwOAR1w_EzAnLOiLxXEGfHWZtctDTO_jU0TTzCpbPkxezuGZBZU1kew_2h2LHCI2b6I8uU5QFhyphenhyphenXxShDVqlxSSGMBpoQVI37Vx76RjeabnTV4lUtoSuFIzCI8uzTES5FIlFfL3VEOyjFmLZI_bxpYxml1AeiMT/s120/provider-monopoly.png';
const monopolyFolderTable = `{title:"MONOPOLY",image:"${monopolyIcon}",category:"টেবিল",isHot:!1}`;

const kmIcon = 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEg_oPxX2eHhdTGk7cZIiZ0HTDxPGBqKH5tZNTFr00jK4wfObGJhqP99kwSA2dHmhQEZMlDLqicSWlEPnf4hhGREVOHlbuMfgwsq_6U_Vf0_jak5Ktf8QHiK3muq6j-un0t4NCSyzWHp2kXaaurzm6Q-ehhqqpQuCoxLBNFoqBt4Hbk72OuzByTHTeYioOae/s120/provider-awcv2_kingmaker.png';
const kmFolderTable = `{title:"KM",image:"${kmIcon}",category:"টেবিল",isHot:!1}`;

const jdbIcon = 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEht1EH5nfdmUETFfsQZtVSkBY9dqYQVssawVLxOycbkeUJ9C3tZZpP8cvq-aUNVT5YDp4a6ifCkZO-Xzmlo7R6Lbegx2UkmaOaydWAhczc_XzAfwFEuRqJXTYQe5VcEioolf_sjd90sjLmmLVydOoAc5-zt3bG4k4_FgRb2VArx6a4zfFVaT17aou1bzcl1/s120/provider-awcv2_jdb.png';
const jdbFolderTable = `{title:"JDB",image:"${jdbIcon}",category:"টেবিল",isHot:!1}`;

const netentIcon = 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhANqkpuqcVUHUBEvexRpkT4OdUZS9FDyUgDiS9QnTRP2Y_Yx4f-XQ2rYqP_2adkP5A52hAXQ4pZyUFFTXLsAEdloa0DLZjAkXr3YM9R4Hw4ERBvYCAszw-8Jmghr6KnCe5y57Kgx0I8EDsull6gvPGhPQPMX46uvmTu0p288B-YEvpN-dFYR-2PDx0wx4J/s360/provider-awcv2_netent.png';
const netentFolderTable = `{title:"NETENT",image:"${netentIcon}",category:"টেবিল",isHot:!1}`;

const pgIcon = 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEiSVKhAnrlFv-ZatgcAKGZ3m0b8JGJRCuERTUi5aCb3qER7RlEad-r1l6at218Uk2YwUpom4aN6fCquRaWXUfXKo5ZVHTIjbLi1dDQGIHB9Q4O8F1TALtIaeqUFd78lMI0MV9YiuIHyQq6YZ7ufIC6BPq7-RRqUey9-T93d1n6wND_cio20hCm8I4_vmc-N/s120/provider-awcv2_pg.png';
const pgFolderTable = `{title:"PG",image:"${pgIcon}",category:"টেবিল",isHot:!1}`;

const ppIcon = 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEiMPZWLFyD6YlVWO4bmuZXAxlCYR8pjpFZHlqviWga8hDmHzZwLiaSt6FeiGbfDwQxVXO34aqc-cHN9KqGfgSKbcyt-ehIM8mniu9AdsRpPfyemOXN__7WFexeZGgtHPp4wVtduP_xKX6xDnB25i4wyXbSNBhxEczajBFOnaGElEspurSpxOCgdfAGGpasr/s120/provider-awcv2_pp%20(1).png';
const ppFolderTable = `{title:"PP",image:"${ppIcon}",category:"টেবিল",isHot:!1}`;

const ptIcon = 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEiMs1CUjKe7WpIM5lZzXCclAYgjzbluQqifbMwwstXMpS3dYfx1PAIyoDLxBjX9TCLU9ardDsBmd-fUWxMGYTUWD-ZAzWV3cYvNx7I8yIZuiXbpHx-_qHlSWMgrqWyx9iMyUVSEhlCXThyphenhyphenAXrdo3Xw3oc1AXsLtMUfpqFGfqp3edX6vskoPJS9t3E-kwtIB/s120/provider-awcv2_pt.png';
const ptFolderTable = `{title:"PT",image:"${ptIcon}",category:"টেবিল",isHot:!1}`;

const relaxIcon = 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEiVgAI2oDPNT31ndE7-qpIHfNZKIb_pc0FCm9YUzTQwGt-gf4WsEUtub1oC025VtwzZ2PUFSPwAxRcSqtON5BOr5hkH51F-S8JeR4ZR4ZWh77gGBsGXlR9TuLsVzoDeompZP69VC6m5YIeydpeNfzlZY7VCZc6gChBFf0v_DSA_n6qInxgnXy4Z8zluRhlB/s120/provider-awcv2_relax.png';
const relaxFolderTable = `{title:"RELAX",image:"${relaxIcon}",category:"টেবিল",isHot:!1}`;

const spribeIcon = 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgH0YR5LiIg87XHNLnRDzuQd0CIuLXXmzCRb9kwC20-d39yKye-Qk5P_SeeKyPybUhFOGGgMAcKG75RMOJlmEpJ5X2fUK7gJPyYsah2DJTouA7typnmR9QmK-5k3sLLt6NLI1YoziUA-TnYLttAtSH0mjukhtevNpf8s1fIJE8AIZj74Frs8FbTtJMM9sFA/s120/provider-awcv2_spribe.png';
const spribeFolderTable = `{title:"SPRIBE",image:"${spribeIcon}",category:"টেবিল",isHot:!1}`;

const ylIcon = 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEj8JeDLF6v1JBh4Npct4Dsdz7UPTiEEnJxlAHblZcPZpLtuQMJJljKF9vWOIMODhEou7mmMdBWri2uB3uEkimDBJfazqhPtDroJQlJfCp6z0zqsVygR7l9TPpUe7i0BvXYOWlW68CzdiWzbqeOrSWA_WWuwU-llSAbB957mxKrL2B4jKU0WwzH4SzUleTUO/s360/provider-awcv2_yl.png';
const ylFolderTable = `{title:"YL",image:"${ylIcon}",category:"টেবিল",isHot:!1}`;

const cq9Icon = 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgQozXn0t75E-0d0jRZaiTYl4VLb2bhH9I3VZrrVoC_Qla_GTuX7Yit-tXcPkRR-M4136rCpUEE8aWnrpS8QI9teRuAzwsZEjP4HusDxgYy09AB9cDsDc3DTl5NvuouPJfbpaUQ3iUnc7q3vHgS1yWL0guKBSxPfdfPurcDv8FR4kQPpaBZUZWe8-qpQSoV/s120/provider-cq9.png';
const cq9FolderTable = `{title:"CQ9",image:"${cq9Icon}",category:"টেবিল",isHot:!1}`;

const sboIcon = 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjcwGeFRrAg_MblLwZBz6Ubq9cm9jmKgHsEYNAactsdwkyTzTs90dqjTvba-JIzc5qxqsRrujHztzWPY1D8wQVgMdXOE3Guioiav-drtrRO3fqjtksO9GK0y6Dd5GqPB7vCcVj-TCgFesmzF0MyzSmvNHiYyvTYYPZwy58qwK40RtQ4lKHgwD9bTlnaHIFH/s120/provider-sbov2.png';
const sboFolderTable = `{title:"SBO",image:"${sboIcon}",category:"টেবিল",isHot:!1}`;

const injoyIcon = 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEiXywSCiayNskxzeYcpEyJbh1ZHc-_xH5snhIhSs7ZMQEBf5f0EtgvhJiYiHACIE7f-Adnd6HxA8IHJiOgtOQtiMnsQPC9PrAo9S0neBK9UL8SIx-BqVi24iHHTVNxm-EwP6IrcPG_-vXW5R-2ynYjUgnbIywBGqT_kpdBk2ef1z5zxEPZPXQGBqeLzx2bh/s120/provider-jdbinjoy.png';
const injoyFolderTable = `{title:"INJOY",image:"${injoyIcon}",category:"টেবিল",isHot:!1}`;

const jokerIcon = 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgWnAUN2AkaGKLD4Fp_zwVnEniKGXM9IfOk9tYOvJ6lOg7EndH5Z6uwiJjXsHowa3N7KS1Ge5G23bMWBkLGNEOeupK56-xzk-69XQwiXhQho1Ch4-gAB0PwFTPu4duICl5ykBm7m59KqNt0eI40mRqqrJFEa-NlqoEBT63mzgzYJ5uTNCj533ReJvVYlgxF/s120/provider-joker.png';
const jokerFolderTable = `{title:"JOKER",image:"${jokerIcon}",category:"টেবিল",isHot:!1}`;

const kaIcon = 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEitM4XGbCyhebfMqXQfCR0NfDW9AV7K_O_NRpdNy0TMfQ9Iu81i0mN6qAL09mlkwOqSHEI673JfMFfNHw8UZam7JAfbkEyh1oiOi8EJknLC7aY1nFV65RXfMihqX3oc3jTyCmx0qHXOGPcSHaCcIZnkuGoX8gwUeXZu20sImJ4hWoMPrcrKVV0siPvQtlKt/s120/provider-ka.png';
const kaFolderTable = `{title:"KA",image:"${kaIcon}",category:"টেবিল",isHot:!1}`;

const rich88Icon = 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjRj-Ik-8njhgHmMc4TWl1mOhyBMu5rCF1qOKFMTpUcIhOEVPdS9RMIM7Hpc5ltHWKJJZuS5IgYQPfQEcb59ZFoT2c3Yka1V9NHTNcKMYcIX_psvSFm_M7M3Uly3nhqQMPYUMOuBAycr0kbFBWJk59yswh0ZiZBPfwrkuaoyZV5Svpv7p9WAl6CGuFICyWi/s360/provider-rich88.png';
const rich88FolderTable = `{title:"RICH88",image:"${rich88Icon}",category:"টেবিল",isHot:!1}`;

const worldmatchIcon = 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhMMNtfez2ppvniLPXxxIuyAlW1I-f2CVVy2qjhQxExKzfpoERJZj_7QalmCfhesokbtumTaxt6GOBNe_Oe5GpLJAXeMTlGJ33rwtZikXOAPMFoevjfTiBET9RvUu1Xl-GefY2pGYI5u7B9kx6xKnyI4ToaWH2RAUvxeuwyou9xXu9x9CzXAGzMb-2sHXjB/s120/provider-worldmatch.png';
const worldmatchFolderTable = `{title:"WORLDMATCH",image:"${worldmatchIcon}",category:"টেবিল",isHot:!1}`;

const habaneroIcon = 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEiFQy0O8xcTpMnlEPFmmw9Xzxw15x2iAit7sA2sPjiCKlbV5lF_pbLakYqnbnKfBgoSjirTNm560QqI8-gfpOEbPV3eO-BDJDPQSDu5j5m5eALSo5Icqc9Zxx1bw6etcAgQ8-S50_GYnlbtAHuKPP9apP8ZOPnjhVtX8mW5aTPpiMQzbA5Mc3xAsEMZoJTh/s120/provider-awcv2_habanero.png';
const habaneroFolderTable = `{title:"HABANERO",image:"${habaneroIcon}",category:"টেবিল",isHot:!1}`;

targets.forEach(filePath => {
  if (!fs.existsSync(filePath)) return;
  let code = fs.readFileSync(filePath, 'utf8');
  let changed = false;

  // 1. Move EVOLUTION Super Sic Bo, EVOLUTION Bac Bo, PP Lucky 6 Roulette out of টেবিল
  const moves = [
    { name: "EVOLUTION Super Sic Bo", newCat: "EVO" },
    { name: "EVOLUTION Bac Bo", newCat: "EVO" },
    { name: "PP Lucky 6 Roulette", newCat: "PP" }
  ];

  moves.forEach(m => {
    const regex = new RegExp(`\\{title:"${m.name}",image:"([^"]+)",category:"টেবিল"(?:,isHot:([^}]+))?\\}`, 'g');
    if (regex.test(code)) {
      code = code.replace(regex, (match, p1, p2) => `{title:"${m.name}",image:"${p1}",category:"${m.newCat}"${p2 ? ",isHot:" + p2 : ""}}`);
      changed = true;
    }
  });

  // 2. Remove Golden Empire, Super Ace, Super Ace (Table), Golden Empire (Table) ONLY from টেবিল category
  const gamesToHideFromTable = [
    "Super Ace (Table)",
    "Golden Empire (Table)",
    "Golden Empire",
    "Super Ace"
  ];

  gamesToHideFromTable.forEach(name => {
    const reg1 = new RegExp(`,\\{title:"${name.replace(/[()]/g, "\\$&")}",[^{}]*category:"টেবিল"[^{}]*\\}`, "g");
    const reg2 = new RegExp(`\\{title:"${name.replace(/[()]/g, "\\$&")}",[^{}]*category:"টেবিল"[^{}]*\\},?`, "g");
    if (reg1.test(code) || reg2.test(code)) {
      code = code.replace(reg1, "");
      code = code.replace(reg2, "");
      changed = true;
    }
  });

  // 3. Ensure JILI folder exists in Table category
  if (!code.includes('title:"JILI",image:"' + jiliIcon + '",category:"টেবিল"')) {
    const aviatorPos = code.indexOf('{title:"AVIATOR"');
    if (aviatorPos !== -1) {
      code = code.replace('{title:"AVIATOR"', `${jiliFolderTable},{title:"AVIATOR"`);
      changed = true;
    }
  }

  // 4. Ensure MONOPOLY folder is copied into Table category (while staying in Slot)
  if (!code.includes('title:"MONOPOLY",image:"' + monopolyIcon + '",category:"টেবিল"')) {
    if (code.includes(jiliFolderTable)) {
      code = code.replace(jiliFolderTable, `${jiliFolderTable},${monopolyFolderTable}`);
      changed = true;
      console.log(`[Table Games Patch] Added MONOPOLY to টেবিল category next to JILI in ${path.basename(filePath)}`);
    } else {
      const aviatorPos = code.indexOf('{title:"AVIATOR"');
      if (aviatorPos !== -1) {
        code = code.replace('{title:"AVIATOR"', `${monopolyFolderTable},{title:"AVIATOR"`);
        changed = true;
      }
    }
  }

  // 5. Ensure KM folder is copied into Table category (while staying in Slot and Crash)
  if (!code.includes('title:"KM",image:"' + kmIcon + '",category:"টেবিল"')) {
    if (code.includes(monopolyFolderTable)) {
      code = code.replace(monopolyFolderTable, `${monopolyFolderTable},${kmFolderTable}`);
      changed = true;
      console.log(`[Table Games Patch] Added KM to টেবিল category next to MONOPOLY in ${path.basename(filePath)}`);
    } else if (code.includes(jiliFolderTable)) {
      code = code.replace(jiliFolderTable, `${jiliFolderTable},${kmFolderTable}`);
      changed = true;
      console.log(`[Table Games Patch] Added KM to টেবিল category next to JILI in ${path.basename(filePath)}`);
    } else {
      const aviatorPos = code.indexOf('{title:"AVIATOR"');
      if (aviatorPos !== -1) {
        code = code.replace('{title:"AVIATOR"', `${kmFolderTable},{title:"AVIATOR"`);
        changed = true;
      }
    }
  }

  // 6. Ensure JDB folder is copied into Table category (while staying in Slot)
  if (!code.includes('title:"JDB",image:"' + jdbIcon + '",category:"টেবিল"')) {
    if (code.includes(kmFolderTable)) {
      code = code.replace(kmFolderTable, `${kmFolderTable},${jdbFolderTable}`);
      changed = true;
      console.log(`[Table Games Patch] Added JDB to টেবিল category next to KM in ${path.basename(filePath)}`);
    } else if (code.includes(monopolyFolderTable)) {
      code = code.replace(monopolyFolderTable, `${monopolyFolderTable},${jdbFolderTable}`);
      changed = true;
      console.log(`[Table Games Patch] Added JDB to টেবিল category next to MONOPOLY in ${path.basename(filePath)}`);
    } else if (code.includes(jiliFolderTable)) {
      code = code.replace(jiliFolderTable, `${jiliFolderTable},${jdbFolderTable}`);
      changed = true;
      console.log(`[Table Games Patch] Added JDB to টেবিল category next to JILI in ${path.basename(filePath)}`);
    } else {
      const aviatorPos = code.indexOf('{title:"AVIATOR"');
      if (aviatorPos !== -1) {
        code = code.replace('{title:"AVIATOR"', `${jdbFolderTable},{title:"AVIATOR"`);
        changed = true;
      }
    }
  }

  // 7. Ensure NETENT folder is copied into Table category (while staying in Slot)
  if (!code.includes('title:"NETENT",image:"' + netentIcon + '",category:"টেবিল"')) {
    if (code.includes(jdbFolderTable)) {
      code = code.replace(jdbFolderTable, `${jdbFolderTable},${netentFolderTable}`);
      changed = true;
      console.log(`[Table Games Patch] Added NETENT to টেবিল category next to JDB in ${path.basename(filePath)}`);
    } else if (code.includes(kmFolderTable)) {
      code = code.replace(kmFolderTable, `${kmFolderTable},${netentFolderTable}`);
      changed = true;
      console.log(`[Table Games Patch] Added NETENT to টেবিল category next to KM in ${path.basename(filePath)}`);
    } else if (code.includes(jiliFolderTable)) {
      code = code.replace(jiliFolderTable, `${jiliFolderTable},${netentFolderTable}`);
      changed = true;
      console.log(`[Table Games Patch] Added NETENT to টেবিল category next to JILI in ${path.basename(filePath)}`);
    } else {
      const aviatorPos = code.indexOf('{title:"AVIATOR"');
      if (aviatorPos !== -1) {
        code = code.replace('{title:"AVIATOR"', `${netentFolderTable},{title:"AVIATOR"`);
        changed = true;
      }
    }
  }

  // 8. Ensure PG folder is copied into Table category (while staying in Slot)
  if (!code.includes('title:"PG",image:"' + pgIcon + '",category:"টেবিল"')) {
    if (code.includes(netentFolderTable)) {
      code = code.replace(netentFolderTable, `${netentFolderTable},${pgFolderTable}`);
      changed = true;
      console.log(`[Table Games Patch] Added PG to টেবিল category next to NETENT in ${path.basename(filePath)}`);
    } else if (code.includes(jdbFolderTable)) {
      code = code.replace(jdbFolderTable, `${jdbFolderTable},${pgFolderTable}`);
      changed = true;
      console.log(`[Table Games Patch] Added PG to টেবিল category next to JDB in ${path.basename(filePath)}`);
    } else if (code.includes(jiliFolderTable)) {
      code = code.replace(jiliFolderTable, `${jiliFolderTable},${pgFolderTable}`);
      changed = true;
      console.log(`[Table Games Patch] Added PG to টেবিল category next to JILI in ${path.basename(filePath)}`);
    } else {
      const aviatorPos = code.indexOf('{title:"AVIATOR"');
      if (aviatorPos !== -1) {
        code = code.replace('{title:"AVIATOR"', `${pgFolderTable},{title:"AVIATOR"`);
        changed = true;
      }
    }
  }

  // 9. Ensure PP folder is copied into Table category (while staying in Slot)
  if (!code.includes('title:"PP",image:"' + ppIcon + '",category:"টেবিল"')) {
    if (code.includes(pgFolderTable)) {
      code = code.replace(pgFolderTable, `${pgFolderTable},${ppFolderTable}`);
      changed = true;
      console.log(`[Table Games Patch] Added PP to টেবিল category next to PG in ${path.basename(filePath)}`);
    } else if (code.includes(netentFolderTable)) {
      code = code.replace(netentFolderTable, `${netentFolderTable},${ppFolderTable}`);
      changed = true;
      console.log(`[Table Games Patch] Added PP to টেবিল category next to NETENT in ${path.basename(filePath)}`);
    } else if (code.includes(jiliFolderTable)) {
      code = code.replace(jiliFolderTable, `${jiliFolderTable},${ppFolderTable}`);
      changed = true;
      console.log(`[Table Games Patch] Added PP to টেবিল category next to JILI in ${path.basename(filePath)}`);
    } else {
      const aviatorPos = code.indexOf('{title:"AVIATOR"');
      if (aviatorPos !== -1) {
        code = code.replace('{title:"AVIATOR"', `${ppFolderTable},{title:"AVIATOR"`);
        changed = true;
      }
    }
  }

  // 10. Ensure PT folder is copied into Table category (while staying in Slot)
  if (!code.includes('title:"PT",image:"' + ptIcon + '",category:"টেবিল"')) {
    if (code.includes(ppFolderTable)) {
      code = code.replace(ppFolderTable, `${ppFolderTable},${ptFolderTable}`);
      changed = true;
      console.log(`[Table Games Patch] Added PT to টেবিল category next to PP in ${path.basename(filePath)}`);
    } else if (code.includes(pgFolderTable)) {
      code = code.replace(pgFolderTable, `${pgFolderTable},${ptFolderTable}`);
      changed = true;
      console.log(`[Table Games Patch] Added PT to টেবিল category next to PG in ${path.basename(filePath)}`);
    } else if (code.includes(jiliFolderTable)) {
      code = code.replace(jiliFolderTable, `${jiliFolderTable},${ptFolderTable}`);
      changed = true;
      console.log(`[Table Games Patch] Added PT to টেবিল category next to JILI in ${path.basename(filePath)}`);
    } else {
      const aviatorPos = code.indexOf('{title:"AVIATOR"');
      if (aviatorPos !== -1) {
        code = code.replace('{title:"AVIATOR"', `${ptFolderTable},{title:"AVIATOR"`);
        changed = true;
      }
    }
  }

  // 11. Ensure RELAX folder is copied into Table category (while staying in Slot)
  if (!code.includes('title:"RELAX",image:"' + relaxIcon + '",category:"টেবিল"')) {
    if (code.includes(ptFolderTable)) {
      code = code.replace(ptFolderTable, `${ptFolderTable},${relaxFolderTable}`);
      changed = true;
      console.log(`[Table Games Patch] Added RELAX to টেবিল category next to PT in ${path.basename(filePath)}`);
    } else if (code.includes(ppFolderTable)) {
      code = code.replace(ppFolderTable, `${ppFolderTable},${relaxFolderTable}`);
      changed = true;
      console.log(`[Table Games Patch] Added RELAX to টেবিল category next to PP in ${path.basename(filePath)}`);
    } else if (code.includes(jiliFolderTable)) {
      code = code.replace(jiliFolderTable, `${jiliFolderTable},${relaxFolderTable}`);
      changed = true;
      console.log(`[Table Games Patch] Added RELAX to টেবিল category next to JILI in ${path.basename(filePath)}`);
    } else {
      const aviatorPos = code.indexOf('{title:"AVIATOR"');
      if (aviatorPos !== -1) {
        code = code.replace('{title:"AVIATOR"', `${relaxFolderTable},{title:"AVIATOR"`);
        changed = true;
      }
    }
  }

  // 12. SPRIBE: Ensure SPRIBE exists ONLY in 'টেবিল' category and is removed from all other categories
  const nonTableSpribeReg1 = /,?\{title:"SPRIBE",[^{}]*category:"(?!টেবিল")[^"]*"[^{}]*\}/g;
  const nonTableSpribeReg2 = /\{title:"SPRIBE",[^{}]*category:"(?!টেবিল")[^"]*"[^{}]*\},?/g;
  if (nonTableSpribeReg1.test(code) || nonTableSpribeReg2.test(code)) {
    code = code.replace(nonTableSpribeReg1, "");
    code = code.replace(nonTableSpribeReg2, "");
    changed = true;
    console.log(`[Table Games Patch] Removed SPRIBE from non-টেবিল categories in ${path.basename(filePath)}`);
  }

  if (!code.includes('title:"SPRIBE",image:"' + spribeIcon + '",category:"টেবিল"')) {
    if (code.includes(relaxFolderTable)) {
      code = code.replace(relaxFolderTable, `${relaxFolderTable},${spribeFolderTable}`);
      changed = true;
      console.log(`[Table Games Patch] Added SPRIBE to টেবিল category next to RELAX in ${path.basename(filePath)}`);
    } else if (code.includes(ptFolderTable)) {
      code = code.replace(ptFolderTable, `${ptFolderTable},${spribeFolderTable}`);
      changed = true;
      console.log(`[Table Games Patch] Added SPRIBE to টেবিল category next to PT in ${path.basename(filePath)}`);
    } else if (code.includes(jiliFolderTable)) {
      code = code.replace(jiliFolderTable, `${jiliFolderTable},${spribeFolderTable}`);
      changed = true;
      console.log(`[Table Games Patch] Added SPRIBE to টেবিল category next to JILI in ${path.basename(filePath)}`);
    } else {
      const aviatorPos = code.indexOf('{title:"AVIATOR"');
      if (aviatorPos !== -1) {
        code = code.replace('{title:"AVIATOR"', `${spribeFolderTable},{title:"AVIATOR"`);
        changed = true;
      }
    }
  }

  // 13. Ensure YL folder is copied into Table category (while staying in Crash and Slot)
  if (!code.includes('title:"YL",image:"' + ylIcon + '",category:"টেবিল"')) {
    if (code.includes(spribeFolderTable)) {
      code = code.replace(spribeFolderTable, `${spribeFolderTable},${ylFolderTable}`);
      changed = true;
      console.log(`[Table Games Patch] Added YL to টেবিল category next to SPRIBE in ${path.basename(filePath)}`);
    } else if (code.includes(relaxFolderTable)) {
      code = code.replace(relaxFolderTable, `${relaxFolderTable},${ylFolderTable}`);
      changed = true;
      console.log(`[Table Games Patch] Added YL to টেবিল category next to RELAX in ${path.basename(filePath)}`);
    } else if (code.includes(jiliFolderTable)) {
      code = code.replace(jiliFolderTable, `${jiliFolderTable},${ylFolderTable}`);
      changed = true;
      console.log(`[Table Games Patch] Added YL to টেবিল category next to JILI in ${path.basename(filePath)}`);
    } else {
      const aviatorPos = code.indexOf('{title:"AVIATOR"');
      if (aviatorPos !== -1) {
        code = code.replace('{title:"AVIATOR"', `${ylFolderTable},{title:"AVIATOR"`);
        changed = true;
      }
    }
  }

  // 14. Ensure CQ9 folder is copied into Table category (while staying in Crash and Slot)
  if (!code.includes('title:"CQ9",image:"' + cq9Icon + '",category:"টেবিল"')) {
    if (code.includes(ylFolderTable)) {
      code = code.replace(ylFolderTable, `${ylFolderTable},${cq9FolderTable}`);
      changed = true;
      console.log(`[Table Games Patch] Added CQ9 to টেবিল category next to YL in ${path.basename(filePath)}`);
    } else if (code.includes(spribeFolderTable)) {
      code = code.replace(spribeFolderTable, `${spribeFolderTable},${cq9FolderTable}`);
      changed = true;
      console.log(`[Table Games Patch] Added CQ9 to টেবিল category next to SPRIBE in ${path.basename(filePath)}`);
    } else if (code.includes(jiliFolderTable)) {
      code = code.replace(jiliFolderTable, `${jiliFolderTable},${cq9FolderTable}`);
      changed = true;
      console.log(`[Table Games Patch] Added CQ9 to টেবিল category next to JILI in ${path.basename(filePath)}`);
    } else {
      const aviatorPos = code.indexOf('{title:"AVIATOR"');
      if (aviatorPos !== -1) {
        code = code.replace('{title:"AVIATOR"', `${cq9FolderTable},{title:"AVIATOR"`);
        changed = true;
      }
    }
  }

  // 15. SBO: Ensure SBO exists ONLY in 'টেবিল' category and is removed from all other categories
  const nonTableSboReg1 = /,?\{title:"SBO",[^{}]*category:"(?!টেবিল")[^"]*"[^{}]*\}/g;
  const nonTableSboReg2 = /\{title:"SBO",[^{}]*category:"(?!টেবিল")[^"]*"[^{}]*\},?/g;
  if (nonTableSboReg1.test(code) || nonTableSboReg2.test(code)) {
    code = code.replace(nonTableSboReg1, "");
    code = code.replace(nonTableSboReg2, "");
    changed = true;
    console.log(`[Table Games Patch] Removed SBO from non-টেবিল categories in ${path.basename(filePath)}`);
  }

  if (!code.includes('title:"SBO",image:"' + sboIcon + '",category:"টেবিল"')) {
    if (code.includes(cq9FolderTable)) {
      code = code.replace(cq9FolderTable, `${cq9FolderTable},${sboFolderTable}`);
      changed = true;
      console.log(`[Table Games Patch] Added SBO to টেবিল category next to CQ9 in ${path.basename(filePath)}`);
    } else if (code.includes(jiliFolderTable)) {
      code = code.replace(jiliFolderTable, `${jiliFolderTable},${sboFolderTable}`);
      changed = true;
      console.log(`[Table Games Patch] Added SBO to টেবিল category next to JILI in ${path.basename(filePath)}`);
    } else {
      const aviatorPos = code.indexOf('{title:"AVIATOR"');
      if (aviatorPos !== -1) {
        code = code.replace('{title:"AVIATOR"', `${sboFolderTable},{title:"AVIATOR"`);
        changed = true;
      }
    }
  }

  // 16. Validate syntax with esbuild before writing
  try {
    esbuild.transformSync(code, { loader: 'js' });
    fs.writeFileSync(filePath, code, 'utf8');
    console.log(`[Table Games Patch] Successfully patched ${path.basename(filePath)}`);
  } catch (err) {
    console.error(`[Table Games Patch] Syntax error prevented writing ${path.basename(filePath)}:`, err.message);
  }
});

console.log('[Table Games Patch] Completed successfully!');
