
var http = require('http');
var path = require('path');
var debug = require('debug')('gmap-road:server');
var async = require('async');
var express = require('express');
var bodyParser = require('body-parser');


var mongoose = require('mongoose');
mongoose.connect('mongodb://road-gps:road-gps8900@ds147069.mlab.com:47069/road-gps');

var models = require('./models/models');

var gpsApi = require("./routes/gps.route");

var app = express();


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/demo/*|/demo', express.static(path.join(__dirname, 'client')));


app.use('/api', gpsApi);


app.use(express.static(path.resolve(__dirname, 'client')));


var port = process.env.PORT || 8080;
app.set('port', port);

var server = http.createServer(app);

server.listen(port, function() {
  console.log("server listening "+ port);
});
server.on('listening', onListening);


function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}
function onListening() {
  var addr = server.address();
  var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  debug('Listening on ' + bind);
}