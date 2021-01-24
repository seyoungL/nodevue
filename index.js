const util = require('util');
const express = require('express');
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

// express 실행
const server = app.listen(7000, function(){
    util.log("Express's started on port 7000");
})