#!/usr/bin/env node

var cp = require('child_process'),
    child = cp.fork(__dirname + '/child.js');

child.on('message', function(msg) {
    console.log('parent got message', msg);
    child.kill();
});

child.on('exit', function(code, signal) {
    console.log('child finished : ', code, signal);
});
 
child.send({hello: 'world'});
