/* [1] mysql Test */

const mysql = require('mysql');

const connection = mysql.createConnection({
    host    :   '192.168.220.1',
    user    : 'testUser',
    password    : 'testPassword',
    database    : 'testdb'
});

connection.connect();

connection.query('select * from User where uid=?',['uid1','uid2'], function(error, results, fields){
    if(error) throw error;
    console.log('The First User is ', results);

    connection.query('update User set lastlogin=now() where uid =?', ['uid2'], function(error, results, fields){
        if(error) throw error;
        console.log('Update ', results);

        connection.end(); 
    });
});

//connection.end(); 