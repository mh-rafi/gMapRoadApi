var mongoose = require('mongoose');
var Schema = mongoose.Schema;


// create User Schema
var GPS = Schema({
    name: String,
	gpsData: Schema.Types.Mixed
});

var RoadGPS = Schema({
    gpsId: String,
	snappedPoints: Schema.Types.Mixed
});


mongoose.model('GPS', GPS);
mongoose.model('RoadGPS', RoadGPS);
