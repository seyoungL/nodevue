/* db module */
// db pool connection 맺는 부분, 트렌젝션 실행하는 부분 모듈화

/* [참고] module 자체가 function으로 export 하려면 아래와 같이 사용 */
// function execute(fn){   // mysqlTest2 - Ex 2-2 
//     Promise.using(pool.connect(), conn=>{
//         conn.beginTrasaction(txerr =>{
//             fn(conn);
//         });
//     })
// }

// module.exports = execute;   //mydb module 자체가 function

const Promise = require('bluebird');

module.exports = class{
    constructor(pool){
        this.pool = pool;
    }
    
    // 실행 함수 (Transaction 없이)
    execute(fn){
        Promise.using(this.pool.connect(), conn =>{
            fn(conn);
        });
    }

    // Transaction 실행 함수
    executeTx(fn){
        Promise.using(this.pool.connect(), conn=>{
            conn.beginTrasaction(txerr =>{
                fn(conn);
            });
        });
    }
}
