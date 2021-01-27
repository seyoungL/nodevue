const util = require('util'),
    express = require('express');

// custom moudle
const Pool = require('./pool'),
    Mydb = require('./mydb');

const pool = new Pool();    // web server 가 시작될 때 한 번만 pool 실행되면 되므로, index.js에서 선언

// express init
const app = express(),
    testJson = require('./test/test.    json');

app.use(express.static('public'));
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);

app.get('/', (req,res) => {
    // res.send("Hello NodeJS!!");
    // res.json(testJson);
    res.render('index', {name:'홍길동'});
});

// : -> @PathVariable
app.get('/test/:email', (req,res)=>{
    testJson.email = req.params.email;
    testJson.addr = req.query.addr;   // req.query = url?addr=
    res.json(testJson);
});

// ex) db pool
app.get('/dbtest/:user', (req,res)=>{
    let user = req.params.user;
    let mydb = new Mydb(pool);
    mydb.execute(conn=>{
        conn.query("select * from User where uid=?", [user], (err, ret)=>{
            res.json(ret);
        });
    })
});

// express 실행
const server = app.listen(7000, function(){
    util.log("Express's started on port 7000");
})