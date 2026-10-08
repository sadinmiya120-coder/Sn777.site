const fs = require('fs');

function patchFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');

  // 1. Prevent heartbeat from creating empty skeleton docs
  const target1 = 'Es(We(Ie, "users", L), { lastActive: ac() })';
  const replace1 = 'Tn(We(Ie, "users", L), { lastActive: ac() })';

  const target1b = 'Es(We(Ie, "users", gt.currentUser.uid), {\n                lastActive: ac(),\n              })';
  const target1c = 'Es(We(Ie, "users", gt.currentUser.uid), {';

  content = content.replaceAll(target1, replace1);

  // 2. Backup registration profile write via Server API
  const target2 = 'await Ks(We(Ie, "users", Vg.uid), Rf);';
  const replace2 = `await fetch("/api/register-user-profile", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              uid: Vg.uid,
              username: ee,
              email: Sr,
              phone: wt,
              password: W,
              parentId: Jt,
              deviceId: ye,
              lastIp: wd
            })
          }).catch((cn) => console.warn("Backup register-user-profile API warning:", cn));
          await Ks(We(Ie, "users", Vg.uid), Rf);`;

  content = content.replaceAll(target2, replace2);

  // 3. Auto-repair incomplete user profiles
  const target3 = 'ss((Ke) => ({ ...Ke, ...Ue }))';
  const replace3 = `if (!Ue.username || !Ue.phone || Ue.username === "User" || Ue.username === "ব্যবহারকারী") {
                const savedUser = on.getItem("sn777_username");
                const savedPass = on.getItem("sn777_password");
                // Check if name is too random/short
                // Block if length < 4, or has suspicious character repetition, or generic placeholders
                if (!savedUser || savedUser.length < 4 || 
                    /^(user|guest|unknown|random|test)/i.test(savedUser) ||
                    /(.)\1{2,}/.test(savedUser) || 
                    /^[a-z]{5,}$/.test(savedUser)) {
                    Fe("দয়া করে একটি সুন্দর ও অর্থপূর্ণ নাম ব্যবহার করুন!");
                    return;
                }
                fetch("/api/repair-user-profile", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    uid: L.uid,
                    username: savedUser,
                    password: savedPass
                  })
                }).then((cn) => cn.json()).then((cnData) => {
                  if (cnData.success && cnData.profile) {
                    ss((Ke) => ({ ...Ke, ...cnData.profile }));
                  } else {
                    ss((Ke) => ({ ...Ke, ...Ue }));
                  }
                }).catch((cn) => {
                  console.warn("Repair profile error:", cn);
                  ss((Ke) => ({ ...Ke, ...Ue }));
                });
              } else {
                ss((Ke) => ({ ...Ke, ...Ue }));
              }`;

  content = content.replaceAll(target3, replace3);

  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Successfully patched ${filePath}`);
}

patchFile('test_cand.js');
patchFile('dist_backup/assets/index-CUhzlpga-v3.js');
