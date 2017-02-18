var mongoose = require('mongoose');
var GPS = mongoose.model('GPS');
var RoadGPS = mongoose.model('RoadGPS');

var express = require('express');
var router = express.Router();
var _ = require("underscore");
// var multer = require("multer");
// var upload = multer({dest: './temp-uploads/'});
var csv = require('csvtojson');
// var csvjson = require('csvjson');

// var formidable = require('formidable');
var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();


// var fs = require('fs');
// var path = require('path');

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
var formatRoadGPSData = function(data) {
    var RoadGpsData = [];
    data.forEach(function(item) {
    	RoadGpsData.push({lat: item.location.latitude, lng: item.location.longitude})
    });
    return RoadGpsData;
}

router.use(multipartMiddleware);
router.route('/gps/uploadCSV')
	.post(function(req, res) {
		var csvfile = req.files.csvfile;
		// console.log(req.files);
		
		if(!csvfile)
			return res.status(400).json({
				message: 'No file found!'
			});
			
		if(csvfile.type !== 'application/vnd.ms-excel')
			return res.status(400).json({
				message: 'Invalid file type!'
			});
		
		var gpsDataToSave = [];
		csv()
		.fromFile(csvfile.path)
		.on('end_parsed', (data) => {
			
			data.forEach((item) => {
				gpsDataToSave.push({lat: parseFloat(item.Latitude), lng: parseFloat(item.Longitude)})	
			});
			
			if(gpsDataToSave.length > 98) {
				var newItems = [];
		    	var gpsDataToTrim = gpsDataToSave.slice();
		    	var lastItem = gpsDataToTrim.splice(gpsDataToTrim.length - 1);
		    	var noOfItems = gpsDataToTrim.length;
		    	
		    	var distance = Math.round(noOfItems / 96);
		    	
		    	
		    	for(var i = 0; i <= noOfItems; i += distance) {
			    	if(gpsDataToTrim[i]) {
			    		newItems.push(gpsDataToTrim[i])
			    	}
		    	}
		    	
		    	if(newItems.length > 97) {
		    		var noOfextraItem =  newItems.length - 97;
		    		newItems.splice(newItems.length - noOfextraItem, noOfextraItem);
		    		console.log( 'noOfextraItem %s', noOfextraItem);
		    	}
		    	
		    	newItems.push(lastItem[0]);
		    	gpsDataToSave = newItems;
		    }

			// SAVE TO DB
		    var newGps = new GPS();
		    newGps.gpsData = gpsDataToSave;
		    newGps.save(function(err, resGps) {
		        if(err) {
		            return res.status(500).send({message: 'Error while saving data to DB'});
		        }
		        
		        res.send(resGps);
		    });
		})
		.on('error',(error)=>{
			console.log('<============== Error =============>');
		    res.status(500).json('Error');
		});
	});

router.route('/gps/raw')
	.get(function(req, res) {
	    var queryId = req.query.id;
	    var isFormatted = req.query.formatted;
	    
	   // RETURN ALL ITEMS 
	    if(!queryId) {
	      GPS.find({}, function(err, items) {
	          if (err) {
				return res.status(500).json({
					state: 'error',
					message: 'Server Error!'
				});
			};
			if(!items) {
			    return res.status(404).json({
					state: 'error',
					message: 'No item found!'
				});
			};
			res.send(items);
	      });
	      return;  
	    };
	    
	   // SEARCH BY ID
		GPS.findOne({
		    _id: queryId
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
				
			
			res.send(gps);
		});
	})
	.post(function(req, res) {
	    var postData = req.body.gpx
	    if(!postData) {
	        return res.status(400).send({message: 'Bad data'});
	    }
	    var gpsDataToSave = postData.wpt;
	    
	    // TRIM INPUT DATA
	    if(gpsDataToSave.length > 98) {
	    	var gpsDataToTrim = gpsDataToSave.slice();
	    	var lastItem = gpsDataToTrim.splice(gpsDataToTrim.length - 1);
	    	var noOfItems = gpsDataToTrim.length;
	    	var distance = parseInt(noOfItems / (noOfItems - 98));
	    	for(var i = distance; i <= noOfItems; i += distance) {
	    		gpsDataToTrim.splice(i, 1);
	    	}
	    	
	    	if(gpsDataToTrim.length > 97) {
	    		var noOfextraItem =  gpsDataToTrim.length - 97;
	    		gpsDataToTrim.splice(gpsDataToTrim.length - noOfextraItem, noOfextraItem);
	    		console.log( 'noOfextraItem %s', noOfextraItem);
	    	}
	    	gpsDataToTrim.push(lastItem[0]);
	    	gpsDataToSave = gpsDataToTrim;
	    }
	    // SAVE TO DB
	    var newGps = new GPS();
	    newGps.gpsData = gpsDataToSave;
	    newGps.save(function(err, resGps) {
	        if(err) {
	            return res.status(500).send({message: 'Error while saving data to DB'});
	        }
	        
	        res.send(resGps);
	    });
	})


// ROAD APIs
router.route('/gps/road')
	.get(function(req, res) {
        var queryId = req.query.id;
        var isFormatted = req.query.formatted;
        
        //FIND ROAD GPS BY RAW GPS ID
        RoadGPS.findOne({
            gpsId: queryId
        }, function(err, roadGps) {
           if(err) {
                return res.status(500).send({message: 'Server Error!'});
           }
           // RESPONSE DATA FROM DB
           if(roadGps) {
           		roadGps.snappedPoints = formatRoadGPSData(roadGps.snappedPoints);
                return res.send(roadGps);
           }
           
           // FIND RAW GPS DATA BY ID
           GPS.findOne({
    		    _id: queryId
    		}, function(err, gps) {
    			if (err) {
    				return res.status(500).json({message: 'Server Error!'});
    			}
    			if (!gps)
    				return res.status(404).json({message: 'no item found!'});
    
                // gps.gpsData = formatGPSData(gps.gpsData);
                
                // GET SNAPTORAD GPS FROM GOOGLE
                googleMapsClient.snapToRoads({
                    path: gps.gpsData
                }, function(err, response) {
                     if (err) {
                        console.log(response.json.results);
                        return res.status(500).send({message: 'Bad response from Raod api!', error: err});
                     }
                     
                     //SAVE NEW ROAD GPS DATA TO DB 
                     var newRoadGps = new RoadGPS();
                     newRoadGps.gpsId = queryId;
                     newRoadGps.snappedPoints = response.json.snappedPoints;
                     newRoadGps.save(function(err, gpsRes) {
                        if(err) {
                            return res.status(500).send({message: 'Error while saving Road api gps to DB'});
                        }
                        console.log('snapped')
                        gpsRes.snappedPoints = formatRoadGPSData(gpsRes.snappedPoints);
                        res.send(gpsRes);
                     });
                })
    		});
           
        });
        
	})

module.exports = router;
