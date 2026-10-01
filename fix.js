const fs = require("fs");
let code = fs.readFileSync("app/actions/email.ts", "utf8");

code = code.replace(/:\s*'\}/g, ": '}");

fs.writeFileSync("app/actions/email.ts", code);

