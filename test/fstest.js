/* [1] 비동기. ex. 파일 시스템 */

const fs = require('fs');
const util = require('util');

//console.log("console Log");
//util.log("Util Log", __dirname);

fs.readFile(__dirname + '/test.json', 'utf-8', (err,data) => {
    if (err) return util.log(err);

    util.log("data >> ", data);
});

util.log("----------1----------");

const msgFile = __dirname + '/message.txt';
fs.writeFileSync(msgFile, 'Hello Node.js 테스트', (err)=>{
    if (err) throw err;
    util.log("The File has been saved");
});

//let data2 = fs.readFileSync(__dirname + '/test.json', 'utf-8');
let data2 = fs.readFileSync(msgFile, 'utf-8');
util.log("data2 >>", data2);
util.log("-----------2---------");