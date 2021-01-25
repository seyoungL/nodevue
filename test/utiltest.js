const util = require('util');
const utils = require('../utils');  // .js 생략 가능

// utils 모듈의 makemap 사용하기
let map = utils.makeMap('name','hong');
console.log("map >> ", map.get("name"));

return;

// utils 모듈의 encrypt 사용하기
let str ="NodeJS";
let enc = utils.encrypt(str);
let encWthKey = utils.encrypt(str, 'testKey');

let dec = utils.decrypt(enc);

util.log("enc = ", enc);
util.log("dec = ", dec);

return;

// utils 모듈의 ogsinfo 사용하기
let url = "https://naver.com";

utils.ogsinfo(url, (err,ret)=> {
    util.log(err, ret);
});