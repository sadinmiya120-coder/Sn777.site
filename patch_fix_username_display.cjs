const fs = require('fs');
const path = require('path');
const vm = require('vm');

function patchFile(filePath) {
  if (!fs.existsSync(filePath)) {
    console.log(`File not found: ${filePath}`);
    return;
  }

  let content = fs.readFileSync(filePath, 'utf8');
  let originalLen = content.length;

  // 1. Fix ve initial state (idempotent)
  const targetInitial = `[ve,ss]=R.useState({name:"সম্পূর্ণ নাম",username:"ব্যবহারকারী",birthday:"১৯৯৮/০১/০১",phone:"+880 1XXXXXXXXX",email:"",password:"",rank:"Bronze",points:0,registrationDate:new Date().toISOString().split("T")[0].replace(/-/g,"/"),balance:"0.00",totalDeposited:0,totalWithdrawn:0,winRate:100,approvedDepositsCount:0,withdrawEnabled:!1,parentId:"",rewardTier:0,inviteCode:"",referralEarnings:0,totalReferrals:0,role:"user"})`;

  const replInitial = `[ve,ss]=R.useState(()=>{let u="";try{u=localStorage.getItem("sn777_username")||localStorage.getItem("sn777_user_name")||""}catch(e){}return{name:u,username:u,birthday:"১৯৯৮/০১/০১",phone:"",email:"",password:"",rank:"Bronze",points:0,registrationDate:new Date().toISOString().split("T")[0].replace(/-/g,"/"),balance:"0.00",totalDeposited:0,totalWithdrawn:0,winRate:100,approvedDepositsCount:0,withdrawEnabled:!1,parentId:"",rewardTier:0,inviteCode:"",referralEarnings:0,totalReferrals:0,role:"user"}})`;

  if (content.includes(targetInitial)) {
    content = content.replace(targetInitial, replInitial);
  }

  // 2. Fix logout reset (idempotent)
  const targetLogout = `ss({name:"সম্পূর্ণ নাম",username:"ব্যবহারকারী",birthday:"১৯৯৮/০১/০১",phone:"+880 1XXXXXXXXX",email:"",password:"",rank:"Bronze",points:0,balance:"0.00",testCoin:0,totalDeposited:0,approvedDepositsCount:0,adminApproved:!1,withdrawEnabled:!1,status:"active",isBlocked:!1})`;

  const replLogout = `ss({name:"",username:"",birthday:"১৯৯৮/০১/০১",phone:"",email:"",password:"",rank:"Bronze",points:0,balance:"0.00",testCoin:0,totalDeposited:0,approvedDepositsCount:0,adminApproved:!1,withdrawEnabled:!1,status:"active",isBlocked:!1})`;

  if (content.includes(targetLogout)) {
    content = content.replace(targetLogout, replLogout);
  }

  // 3. Fix snapshot profile listener without creating illegal syntax inside if(...) condition
  // Clean up any repeated/corrupted patterns first
  let p1 = content.indexOf(`if(L.email==="sadinmiya120@gmail.com"&&Ue.role!=="admin"`);
  let p2 = content.indexOf(`window.__sn777_user_profile={...Ue,uid:L.uid}`);
  let p3 = content.indexOf(`Ue.parentId&&Ue.totalDeposited>=100&&Ue.rewardTier===1){`);

  if (p1 !== -1 && p2 !== -1 && p3 !== -1 && p1 < p2 && p2 < p3) {
    const endSlice = p3 + `Ue.parentId&&Ue.totalDeposited>=100&&Ue.rewardTier===1){`.length;
    const targetBlock = content.slice(p1, endSlice);
    const validBlock = `if(L.email==="sadinmiya120@gmail.com"&&Ue.role!=="admin"){Es(W,{role:"admin"});}const _cu=(Ue.username&&Ue.username!=="ব্যবহারকারী"&&Ue.username!=="User")?Ue.username:(Ue.email?Ue.email.split("@")[0]:(Ue.phone||""));const _cn=(Ue.name&&Ue.name!=="সম্পূর্ণ নাম"&&Ue.name!=="ব্যবহারকারী")?Ue.name:_cu;Ue.username=_cu;Ue.name=_cn;try{localStorage.setItem("sn777_username",_cu);localStorage.setItem("sn777_user_name",_cn);}catch(e){}window.__sn777_user_profile={...Ue,uid:L.uid};window.__sn777_is_logged=true;ss(Ke=>({...Ke,...Ue}));if(Ue.parentId&&Ue.totalDeposited>=100&&Ue.rewardTier===1){`;

    content = content.replace(targetBlock, validBlock);
  }

  // 4. Fix presence heartbeat uname
  const targetPresence = `const uname=(ve&&(ve.username||ve.name))||"User";`;
  const replPresence = `const uname=(ve&&(ve.username&&ve.username!=="ব্যবহারকারী"?ve.username:(ve.name&&ve.name!=="সম্পূর্ণ নাম"&&ve.name!=="ব্যবহারকারী"?ve.name:"")))||"";`;

  if (content.includes(targetPresence)) {
    content = content.replace(targetPresence, replPresence);
  }

  // 5. In Account page rendering:
  const targetAccUser = `children:[o.jsx("span",{className:"text-slate-800 font-extrabold text-lg",children:ve.username})`;
  const replAccUser = `children:[o.jsx("span",{className:"text-slate-800 font-extrabold text-lg",children:(ve.username&&ve.username!=="ব্যবহারকারী"?ve.username:(ve.name&&ve.name!=="সম্পূর্ণ নাম"&&ve.name!=="ব্যবহারকারী"?ve.name:(ve.email?ve.email.split("@")[0]:"User")))})`;

  if (content.includes(targetAccUser)) {
    content = content.replace(targetAccUser, replAccUser);
  }

  const targetAccUser2 = `children:[o.jsx(Ym,{size:15})," ইউজারনেম"]}),yn?o.jsx("input",{type:"text",value:bn.username,onChange:E=>yi({...bn,username:E.target.value}),className:"w-full text-slate-800 text-sm font-bold border-2 border-[#00559b]/20 focus:border-[#00559b] rounded-xl px-3 py-2.5 outline-none bg-white transition-all shadow-inner",placeholder:"আপনার ইউজারনেম"}):o.jsx("span",{className:"text-slate-700 text-sm font-bold mt-1 pl-1",children:ve.username})`;

  const replAccUser2 = `children:[o.jsx(Ym,{size:15})," ইউজারনেম"]}),yn?o.jsx("input",{type:"text",value:bn.username,onChange:E=>yi({...bn,username:E.target.value}),className:"w-full text-slate-800 text-sm font-bold border-2 border-[#00559b]/20 focus:border-[#00559b] rounded-xl px-3 py-2.5 outline-none bg-white transition-all shadow-inner",placeholder:"আপনার ইউজারনেম"}):o.jsx("span",{className:"text-slate-700 text-sm font-bold mt-1 pl-1",children:(ve.username&&ve.username!=="ব্যবহারকারী"?ve.username:(ve.name&&ve.name!=="সম্পূর্ণ নাম"&&ve.name!=="ব্যবহারকারী"?ve.name:(ve.email?ve.email.split("@")[0]:"User")))})`;

  if (content.includes(targetAccUser2)) {
    content = content.replace(targetAccUser2, replAccUser2);
  }

  const targetAccName = `children:ve.name||"সম্পূর্ণ নাম"`;
  const replAccName = `children:(ve.name&&ve.name!=="সম্পূর্ণ নাম"&&ve.name!=="ব্যবহারকারী"?ve.name:(ve.username&&ve.username!=="ব্যবহারকারী"?ve.username:"সম্পূর্ণ নাম"))`;

  if (content.includes(targetAccName)) {
    content = content.replace(targetAccName, replAccName);
  }

  // Validate syntax before writing!
  try {
    new vm.Script(content);
  } catch (err) {
    throw err;
  }

  fs.writeFileSync(filePath, content, 'utf8');
}

patchFile(path.join(__dirname, 'dist_backup/assets/index-sn777-v9.js'));
patchFile(path.join(__dirname, 'dist/assets/index-sn777-v9.js'));
