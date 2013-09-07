 var express = require('express');
 var app = express();

 fs.readdirSync(__dirname + '/src/models').forEach(function (file) {
     if(~file.indexOf('.js'))
        require('./src/models/' + file);
 });

 app.get('/hello.txt', function(req, res) {
     res.send('Hello World');
 });

app.listen(3000);
console.log('listening on port 3000');

