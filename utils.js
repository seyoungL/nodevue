/* Util Module */

// import modules
const ogs = require('open-graph-scraper'),
    HasMap = require('hashmap'),
    Crypto = require('crypto-js'),
    SHA256 = ("crypto-js/sha256");

const encryptKey = "nodevue";

module.exports = {

    // HashMap 함수
    makeMap(key, value){
        const map = new HasMap();   // HashMap 은 class module
        
        map.set(key, value);
        console.log("TTT >> ", map.get(key));

        return map;
    },

    // 단방향 암호화 함수 (SHA256)
    encryptSha2(data, key){
        if(!data) return null;
        key = key || encryptKey;

        try{
            return Crypto.SHA256(data + key).toString();
        } catch(Err){
            console.error("Error on encrytSha2 ::", err);
        }
    },

    // 양방향 암호화 함수
    encrypt(data, key){
        return Crypto.AES.encrypt(data, key || encryptKey).toString(); // AES : 양방향 암호화
    },

    decrypt(data, key){
        return Crypto.AES.decrypt(data, key || encryptKey).toString(Crypto.enc.Utf8);  // default : HEX(16진수)
    },

    // ogsinfo 함수
    ogsinfo(url, fn){
        return ogs({url:url}, (err,ret) => {
            fn(err,ret);
        });
    }
};