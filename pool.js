/* class module
connection 관리 pool. bluebird 사용 */

const mysql = require('mysql'),
    util = require('util'),
    Promise = require('bluebird');

// promisefy 할 수 있도록 설정
Promise.promisifyAll(mysql);
Promise.promisifyAll(require('mysql/lib/Connection').prototype);
Promise.promisifyAll(require('mysql/lib/Pool').prototype);

const DB_INFO = {
    host    : '192.168.220.1',
    user    : 'testUser',
    password    : 'testPassword',
    database    : 'testdb',
    multipleStatements : true,
    connectionLimit : 5,
    waitForConnections : false
};

module.exports = class {
    constructor(dbinfo){    // 생성자
        dbinfo = dbinfo || DB_INFO;
        this.pool = mysql.createPool(dbinfo);   // class에서는 이렇게 this.pool 해도 됨. 이 때 이 멤버변수 생성됨
    }

    connect(){
        return this.pool.getConnectionAsync().disposer(conn => {  // connection 맺은 프로세스가 다 끝났을 때 disposer 처리 (connection 알아서 끊기도록)
            return conn.release();  // cf) close. release = 재사용가능 (pool)
        });
    }

    // 메모리에 있는 pool 모두 해지
    end(){
        this.pool.end(function(err){
            util.log(">>>>>> End of Pool.");

            if(err)
                util.log("ERR pool ending");
        });
    } 
}