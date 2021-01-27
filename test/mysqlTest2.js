/* mysql using bluebird */
 const util = require('util'),
    Promise = require('bluebird');

// import class module (pool.js)
const Pool = require('../pool');    // .js 생략가능 & class module은 보통 앞글자를 capital로 (Pool)
const pool = new Pool();    // class 니까 new()

const sql1 = "update User set lastlogin=now() where uid='user1";
const sql2 = "update User set lastlogin=now() where uid='user2";

// Ex 1-1
Promise.using(pool.connect(), conn => {
    conn.queryAsync(sql1, (err,ret)=>{
        util.log("sql1 = ", ret.affectedRows);
    });

    pool.end();   // process 끊기
});

// Ex 1-2. then 사용 (동일 결과)
Promise.using(pool.connect(), conn => {
    conn.queryAsync(sql1)
        .then(ret=>{    // then은 error를 리턴하지 않음
            util.log("[then] sql1=", ret.affectedRows);
        })
        .catch(err =>{  // error는 catch에서
            util.log("[then] err >> ", err);
        });

    pool.end();
});

// Ex 2-1. 2개 이상 query 실행 (Transaction 보장 X)
// 즉, sql1 성공, sql2 실행 시 에러 --> sql1 은 db 반영됨.
Promise.using(pool.connect(), conn =>{
    Promise.all([
        conn.queryAsync(sql1),   
        conn.queryAsync(sql2)   // 병렬처리. 각각의 process 로 실행됨

    ]).then(ret => {        // 이 때 ret은 array. 위 2개 쿼리의 실행 결과.
        util.log("End of Then.");
        util.log("sql1 = ", ret[0].affectedRows);
        util.log("sql2 = ", ret[1].affectedRows);
        pool.end();

    }).catch(err =>{
        util.log("Error !");
        pool.end()
    });
})

// Ex 2-2. Transaction 보장
Promise.using(pool.connect(), conn =>{
    conn.beginTrasaction(txerr => {   // txerr : '트랜젝션' 할 때 발생하는 에러
        Promise.all([
            conn.queryAsync(sql1),   
            conn.queryAsync(sql2)  
        ])    
        .then(ret => {
            for (let i=0; i<ret.length; i++)
                util.log(`sql${i+1}=`, ret[i].affectedRows);

            conn.commit();
            pool.end();

        }).catch(err =>{  // err : (query) porcess 에서 발생하는 에러
            conn.rollback();
            pool.end();
        });
    });
});

// Ex 2-3. Pool Connect & Transaction 시작하는 부분 분리(함수) 
execute(conn =>{
    Promise.all([
        conn.queryAsync(sql1),   
        conn.queryAsync(sql2)  
    ])    
    .then(ret => {
        for (let i=0; i<ret.length; i++)
            util.log(`sql${i+1}=`, ret[i].affectedRows);

        conn.commit();
        pool.end();

    }).catch(err =>{  // err : (query) porcess 에서 발생하는 에러
        conn.rollback();
        pool.end();
    });
});

function execute(fn){  // mydb.js module로 뺄수도 있음
    Promise.using(pool.connect(), conn=>{
        conn.beginTrasaction(txerr =>{
            fn(conn);
        });
    })
}