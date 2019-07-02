const {remote, app} = require('electron');
console.log(remote.app.getVersion());  // package.json version
console.log(process.version);
console.log(process.versions["electron"]);

