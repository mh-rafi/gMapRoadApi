
var http = require('http');
var path = require('path');

var async = require('async');
var express = require('express');
var bodyParser = require('body-parser');


var mongoose = require('mongoose');
mongoose.connect('mongodb://road-gps:road-gps8900@ds147069.mlab.com:47069/road-gps');

var models = require('./models/models');

var gpsApi = require("./routes/gps.route");

var app = express();
var server = http.createServer(app);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


app.use('/api', gpsApi);


app.use(express.static(path.resolve(__dirname, 'client')));



server.listen(process.env.PORT || 3000, process.env.IP || "0.0.0.0", function(){
  var addr = server.address();
  console.log("server listening at", addr.address + ":" + addr.port);
});
