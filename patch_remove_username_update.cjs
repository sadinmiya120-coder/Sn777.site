const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');
const target = `        updatedAt: new Date().toISOString(),
        username: candidateUsername || uData?.username || "User"
      };`;
const replacement = `        updatedAt: new Date().toISOString()
      };`;
if (code.includes(target)) {
    code = code.replace(target, replacement);
    fs.writeFileSync('server.ts', code, 'utf8');
    console.log('Successfully removed username update from server.ts');
} else {
    console.log('Could not find target block in server.ts');
}
