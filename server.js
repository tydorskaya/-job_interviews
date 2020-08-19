const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const fs = require('fs');
const mustacheExpress = require('mustache-express');

app.engine('mustache', mustacheExpress());

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: true }));

app.set('view engine', 'mustache');
app.set('views', __dirname + '/views');

// Пользователи
const USERS = [{
    "id": 1,
    "name": "Александр",
    "userhash": "Alexandr"
}];

// Главная
app.get('/home', function (req, res) {
    res.render('home', USERS[0]); // Всегда береться первый пользователь
});

// Страница задач
app.get('/:userhash', function (req, res) {
    res.render('index', USERS[0]); // Всегда береться первый пользователь
});

// Страница для просмотра результатов
app.get('/tasks/:userhash', function (req, res) {
    // req.params.userhash // Всегда береться первый пользователь
    fs.readFile('./base/database.json', 'utf8',  function (err, data) {
        var db = JSON.parse(data)[0];
        var result = Object.values(db).flat(1).splice(2);
        res.render('result', {result});
    });
});

// АПИ для таймера
app.get('/timer/:userhash', function (req, res) {
    var findUserIndex = 0; // Всегда береться первый пользователь
    fs.readFile('./base/database.json', 'utf8',  function (err, data) {
        var db = JSON.parse(data);
        var startTime = db[findUserIndex].startTime;
        var endTime = startTime + 5400000;
        var currentTime = new Date().valueOf();
        var timer = Math.floor(endTime - currentTime);
        console.log(timer);
        if (timer > 0){
            res.send(timer + "");
        }else{
            res.send("0");
        }
    });
});

// Отправка задачи
app.post('/commitTask/', function (req, res) {
    var findUserIndex = 0; // Всегда береться первый пользователь
    if(findUserIndex != -1){
        fs.readFile('./base/database.json', 'utf8',  function (err, data) {
            var db = JSON.parse(data);
            db[findUserIndex]['task_'+ req.body.task][0].html = req.body.html;
            db[findUserIndex]['task_'+ req.body.task][0].css = req.body.css;
            db[findUserIndex]['task_'+ req.body.task][0].comment = req.body.comment;

            var startTime = db[findUserIndex].startTime;
            var endTime = startTime + 5400000;
            var currentTime = new Date().valueOf();
            var timer = Math.floor(endTime - currentTime);
            if(timer > 0){ // новые решения не принимаются если таймер истек
                var json = JSON.stringify(db);
                fs.writeFile('./base/database.json', json, function () {
                    console.log("save");
                });
            }
        });
    }
    res.send('OK');
});

// Начало теста (запись времени в файл)
app.post('/start', function (req, res) {
    var findUserIndex = 0; // Всегда береться первый пользователь
    if(findUserIndex != -1){
        var timeCurrent = Date.now();
        fs.readFile('./base/database.json', 'utf8',  function (err, data) {
            var db = JSON.parse(data);
            if(db[findUserIndex].startTime === "undefined"){ // запись только если пользователь ранее не записывался
                db[findUserIndex].startTime  = timeCurrent;
                var json = JSON.stringify(db);
                fs.writeFile('./base/database.json', json, function () {
                    console.log("save");
                });
            }
        });
    }
    res.send('OK');
});

app.use(function (err, req, res, next) {
    console.error(err.stack);
    res.status(500).send('Something broke!')
});

app.listen(3200, function () {
    console.log('Example app listening on port 3200!');
});
