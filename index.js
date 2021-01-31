const { kdf } = require('crypto-js');
const util = require('util'),
    express = require('express');

// custom moudle
const Pool = require('./pool'),
    Mydb = require('./mydb');

const pool = new Pool();    // web server 가 시작될 때 한 번만 pool 실행되면 되므로, index.js에서 선언

// express init
const app = express(),
    testJson = require('./test/test.json');

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
    console.log("Express's started on port 7000");
});

/**** Simple Chat Server ****/
// server socket
const io = require('socket.io')(server,{
    log: false,
    origins: '*.*',
    pingInterval : 3000,
    pingTimeout : 5000
});

io.sockets.on('connection', (socket, opt) => {
    socket.emit('message', { msg: 'Welcome ' + socket.id });

    util.log("connection>>", socket.id, socket.handshake.query)

    socket.on('join', function (roomId, fn) {
        socket.join(roomId, function () {
            util.log("Join", roomId, Object.keys(socket.rooms));
            if (fn)
                fn();
        });
    });

    socket.on('leave', function (roomId, fn) {  // client 가 leave 할 때, data 뿐만 아니라 function도 넘겨줄 수 있음
        util.log("leave>>", roomId, socket.id)
        socket.leave(roomId, function () {
            if (fn)
                fn();
        });
    });

    socket.on('rooms', function (fn) {
        if (fn)
            fn(Object.keys(socket.rooms));
    });

    // data: {room: 'roomid', msg: 'msg 내용..'}
    socket.on('message', (data, fn) => {   // client 에서 emit한 message를 받음
        util.log("message>>", data)

        // 같은 채팅 방에 있는 사람들에게 모두 msg 보내기
        socket.broadcast.to(data.room).emit('message', { room: data.room, msg: data.msg });

        if (fn)
            fn(data.msg);
    });

    socket.on('disconnecting', function (data) {
        util.log("disconnecting>>", socket.id, Object.keys(socket.rooms))
    });

    socket.on('disconnect', function (data) {
        util.log("disconnect>>", socket.id, Object.keys(socket.rooms))
    });

});

