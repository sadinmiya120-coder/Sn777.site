const fs = require('fs');

function patchFile(filePath) {
  if (!fs.existsSync(filePath)) {
    console.log(`[STRICT REGISTRATION] File not found: ${filePath}`);
    return;
  }
  let content = fs.readFileSync(filePath, 'utf8');

  // 1. Strict Registration submit handler (_l)
  const target = `const ee=an.username.trim(),W=an.password.trim(),ye=mA();const emailToQuery=\`\${ee.toLowerCase().replace(/\\s+/g,"")}@sn777.com\`,Vn=In(hn(Ie,"users"),Qt("email","==",emailToQuery)),Vn2=In(hn(Ie,"users"),Qt("username","==",ee)),[snapVn,snapVn2]=await Promise.all([Gn(Vn),Gn(Vn2)]);if(!snapVn.empty||!snapVn2.empty){xe(!1),Fe("এই ইউজারনেমটি ইতিমধ্যে ব্যবহৃত হয়েছে। অনুগ্রহ করে অন্য একটি ব্যবহার করুন।"),Je(!0);return}`;

  const replacement = `const ee=an.username.trim(),W=an.password.trim(),ye=mA();
  const _uName=ee;
  const _uLen=_uName.length;
  const _uUnique=new Set(_uName.toLowerCase().split("")).size;
  const _hasRep=/(.)\\1{2,}/i.test(_uName);
  const _isPlaceholder=/^(user|guest|unknown|random|test|admin|null|undefined|demo|player)/i.test(_uName);
  const _hasConsonantsBlock=/[bcdfghjklmnpqrstvwxyzBCDFGHJKLMNPQRSTVWXYZ]{4,}/.test(_uName);
  const _hasVowel=/[aeiouyAEIOUY\\u0980-\\u09FF]/.test(_uName);
  const _validChars=/^[a-zA-Z\\u0980-\\u09FF][a-zA-Z0-9_\\u0980-\\u09FF]{3,14}$/.test(_uName);

  if(!_validChars||_hasRep||_isPlaceholder||_hasConsonantsBlock||!_hasVowel||(_uLen>=4&&_uUnique<3)){
    xe(!1);
    Fe("দয়া করে আপনি সুন্দর একটি নাম দিন আপনার ইউজার নামটি গ্রহণযোগ্য না দয়া করে সুন্দর একটি ইউজার নাম তৈরি করুন");
    Je(!0);
    return;
  }

  const _rawPh=(an.phone||"").toString().replace(/\\D/g,"");
  let _stdPh=_rawPh;
  if(_stdPh.length===10&&_stdPh.startsWith("1")){
    _stdPh="0"+_stdPh;
  }
  if(_stdPh.length!==11||!/^01[3-9]\\d{8}$/.test(_stdPh)){
    xe(!1);
    Fe("দয়া করে সঠিক ১১ সংখ্যার মোবাইল নাম্বার দিন (যেমন: 01XXXXXXXXX)");
    Je(!0);
    return;
  }

  const _pQ1=In(hn(Ie,"users"),Qt("phone","==",_stdPh));
  const _pQ2=In(hn(Ie,"users"),Qt("phone","==","+880 "+_stdPh));
  const _pQ3=In(hn(Ie,"users"),Qt("phone","==","+880 "+_stdPh.slice(1)));
  const _pQ4=In(hn(Ie,"users"),Qt("phone","==",_stdPh.slice(1)));
  const [_sP1,_sP2,_sP3,_sP4]=await Promise.all([Gn(_pQ1),Gn(_pQ2),Gn(_pQ3),Gn(_pQ4)]);
  if(!_sP1.empty||!_sP2.empty||!_sP3.empty||!_sP4.empty){
    xe(!1);
    Fe("এই মোবাইল নাম্বারটি ইতিমধ্যে ব্যবহৃত হয়েছে! একটি মোবাইল নাম্বারে একবারই একাউন্ট খোলা যাবে।");
    Je(!0);
    return;
  }

  const emailToQuery=\`\${ee.toLowerCase().replace(/\\s+/g,"")}@sn777.com\`,Vn=In(hn(Ie,"users"),Qt("email","==",emailToQuery)),Vn2=In(hn(Ie,"users"),Qt("username","==",ee)),[snapVn,snapVn2]=await Promise.all([Gn(Vn),Gn(Vn2)]);if(!snapVn.empty||!snapVn2.empty){xe(!1),Fe("এই ইউজারনেমটি ইতিমধ্যে ব্যবহৃত হয়েছে। অনুগ্রহ করে অন্য একটি ব্যবহার করুন।"),Je(!0);return}`;

  let modified = false;

  if (content.includes(target)) {
    content = content.replace(target, replacement);
    content = content.replace('phone:an.phone,password:W', 'phone:_stdPh,password:W');
    modified = true;
    console.log(`[STRICT REGISTRATION] Successfully patched registration in ${filePath}`);
  } else if (content.includes("দয়া করে আপনি সুন্দর একটি নাম দিন (যেমন: Sadin120)")) {
    content = content.replaceAll("দয়া করে আপনি সুন্দর একটি নাম দিন (যেমন: Sadin120)", "দয়া করে আপনি সুন্দর একটি নাম দিন আপনার ইউজার নামটি গ্রহণযোগ্য না দয়া করে সুন্দর একটি ইউজার নাম তৈরি করুন");
    modified = true;
    console.log(`[STRICT REGISTRATION] Successfully updated error text in ${filePath}`);
  } else {
    console.log(`[STRICT REGISTRATION] Registration target not found in ${filePath}`);
  }

  // 2. Strict Profile Edit validation (Le function)
  const leTarget = `Le=qe=>{if(!qe)return!1;const Ue=qe.trim().toLowerCase();return!!(Te.some(Ke=>Ue.includes(Ke.toLowerCase()))||/(.)\\1{4,}/.test(Ue)||/[ক-হ]{5,}/.test(Ue)||/[bcdfghjklmnpqrstvwxyz]{5,}/i.test(Ue)||Ue.length>=8&&!/[aeiouyঅআইঈউঊঋএঐওঔाিীুূৃেৈোৌ]/.test(Ue))}`;
  const leReplacement = `Le=qe=>{if(!qe)return!0;const Ue=qe.trim();const uL=Ue.length;const uUnq=new Set(Ue.toLowerCase().split("")).size;const hasR=/(.)\\1{2,}/i.test(Ue);const isPl=/^(user|guest|unknown|random|test|admin|null|undefined|demo|player)/i.test(Ue);const hasC=/[bcdfghjklmnpqrstvwxyzBCDFGHJKLMNPQRSTVWXYZ]{4,}/.test(Ue);const hasV=/[aeiouyAEIOUY\\u0980-\\u09FF]/.test(Ue);const isV=/^[a-zA-Z\\u0980-\\u09FF][a-zA-Z0-9_\\u0980-\\u09FF]{3,14}$/.test(Ue);if(!isV||hasR||isPl||hasC||!hasV||(uL>=4&&uUnq<3))return!0;return!1}`;

  if (content.includes(leTarget)) {
    content = content.replace(leTarget, leReplacement);
    modified = true;
    console.log(`[STRICT REGISTRATION] Successfully patched profile edit in ${filePath}`);
  }

  if (modified) {
    fs.writeFileSync(filePath, content, 'utf8');
  }
}

// Patch all bundle targets
patchFile('dist_backup/assets/index-sn777-v5.js');
patchFile('dist/assets/index-sn777-v5.js');
patchFile('dist_backup/assets/index-sn777-v6.js');
patchFile('dist/assets/index-sn777-v6.js');
patchFile('dist_backup/assets/index-sn777-v7.js');
patchFile('dist/assets/index-sn777-v7.js');
