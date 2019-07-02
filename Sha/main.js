var CryptoJS = require('crypto-js');
var a = CryptoJS.SHA3("hello", {outputLength: 64}).toString();
console.log(a);
// console.log(CryptoJS.AES.decrypt(a));