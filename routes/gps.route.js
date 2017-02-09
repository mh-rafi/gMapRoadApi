var mongoose = require('mongoose');
var GPS = mongoose.model('GPS');
var RoadGPS = mongoose.model('RoadGPS');

var express = require('express');
var router = express.Router();
var _ = require("underscore");

var googleMapsClient = require('@google/maps').createClient({
  key: 'AIzaSyAQLOHERGUuweMg542SF6AocvDeXOEubp4'
});


var formatGPSData = function(data) {
    var gpsData = [];
    data.forEach(function(item) {
        gpsData.push({lat: parseFloat(item._lat), lng: parseFloat(item._lon)});
    });
    return gpsData;
}

router.route('/gps/raw')
	.get(function(req, res) {
		GPS.findOne({
		    _id: req.query.id
		}, function(err, gps) {
			if (err) {
				return res.status(500).json({
					state: 'error',
					message: 'Server Error!'
				});
			}
			if (!gps)
				return res.status(404).json({
					state: 'error',
					message: 'no item found!'
				});

            gps.gpsData = formatGPSData(gps.gpsData);
            
			res.send(gps);
		});
	})
	.post(function(req, res) {
	    var postData = req.body.gpx
	    if(!postData) {
	        return res.status(400).send({message: 'Bad data'});
	    }
	    var newGps = new GPS();
	    newGps.gpsData = postData.wpt;
	    newGps.save(function(err, resGps) {
	        if(err) {
	            return res.status(500).send({message: 'Error while saving data to DB'});
	        }
	        
	        
	        res.send(resGps);
	    });
	})

router.route('/gps/road')
	.get(function(req, res) {
        var queryId = req.query.id;
        
        RoadGPS.findOne({
            gpsId: queryId
        }, function(err, roadGps) {
           if(err) {
                return res.status(500).send({message: 'Server Error!'});
           }
           if(roadGps) {
               console.log('sending from DB');
                return res.send(roadGps);
           }
           
           GPS.findOne({
    		    _id: queryId
    		}, function(err, gps) {
    			if (err) {
    				return res.status(500).json({message: 'Server Error!'});
    			}
    			if (!gps)
    				return res.status(404).json({message: 'no item found!'});
    
                gps.gpsData = formatGPSData(gps.gpsData);
                
                googleMapsClient.snapToRoads({
                    path: gps.gpsData
                }, function(err, response) {
                     if (err) {
                        // console.log(response.json.results);
                        return res.status(500).send({message: 'Bad response from Raod api!', error: err});
                     }
                     
                     var newRoadGps = new RoadGPS();
                     newRoadGps.gpsId = queryId;
                     newRoadGps.snappedPoints = response.json.snappedPoints;
                     newRoadGps.save(function(err, gpsRes) {
                         if(err) {
                             return res.status(500).send({message: 'Error while saving Road api gps to DB'});
                         }
                         console.log('saved new Roadgps');
                         res.send(gpsRes);
                     });
                })
    		});
           
        });
        
	})

module.exports = router;
