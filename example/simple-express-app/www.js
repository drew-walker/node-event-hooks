var express = require('express');
var app = express(),
    routes = require('./routes');

app.use('/', routes);

app.listen(3000);

console.log('Express server listening on port 3000...');