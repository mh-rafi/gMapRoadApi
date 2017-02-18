
     ,-----.,--.                  ,--. ,---.   ,--.,------.  ,------.
    '  .--./|  | ,---. ,--.,--. ,-|  || o   \  |  ||  .-.  \ |  .---'
    |  |    |  || .-. ||  ||  |' .-. |`..'  |  |  ||  |  \  :|  `--, 
    '  '--'\|  |' '-' ''  ''  '\ `-' | .'  /   |  ||  '--'  /|  `---.
     `-----'`--' `---'  `----'  `---'  `--'    `--'`-------' `------'
    ----------------------------------------------------------------- 
    
## Demo link
https://gmap-road.herokuapp.com

## APIs

### Add new raw GPS data
POST https://gmap-road.herokuapp.com/api/gps/raw

    Note: Request body should be formData object, file input element name should be "csvfile".
    If data more than 100, extra data will be removed evenly from input;
    
    
        

	

### Get all raw GPS data
GET https://gmap-road.herokuapp.com/api/gps/raw

    Sample Output
    [{
    	"_id": "589c02bcf9c7f53a5fee39fb",
    	"gpsData": [{
    		"lng": 29.00065,
    		"lat": 41.06672
    	}, {
    		"lng": 29.00055,
    		"lat": 41.06671
    	}, {
    		"lng": 29.00041,
    		"lat": 41.06673
    	}, 
    	....],
    	"__v": 0
    }, {
    	"_id": "589bffd42da3292cd15cfad4",
    	"name": "tirp one",
    	"gpsData": [{
    		"lng": 29.00065,
    		"lat": 41.06672
    	}, {
    		"lng": 29.00055,
    		"lat": 41.06671
    	}, {
    		"lng": 29.00041,
    		"lat": 41.06673
    	},  
    	....],
    	"__v": 0
    }]


### Get single raw GPS data by id (Returns Formatted data)
GET https://gmap-road.herokuapp.com/api/gps/raw/?id=589c02bcf9c7f53a5fee39fb

    Sample Output
    {
    	"_id": "589c02bcf9c7f53a5fee39fb",
    	"gpsData": [{
    		"lng": 29.00071,
    		"lat": 41.06672
    	}, {
    		"lng": 29.00065,
    		"lat": 41.06672
    	}, {
    		"lng": 29.00055,
    		"lat": 41.06671
    	}, {
    		"lng": 29.00041,
    		"lat": 41.06673
    	}, 
    	.......],
    	"__v": 0
    }

### Get single Road api snapedToRoad GPS data by id
GET https://gmap-road.herokuapp.com/api/gps/road/?id=589c02bcf9c7f53a5fee39fb

    Sample Output
    {
    	"_id": "589c3f13c321fa9cccf741ec",
    	"snappedPoints": [{
    		"location": {
    			"latitude": 41.06672002402712,
    			"longitude": 29.000710001123153
    		},
    		"originalIndex": 0,
    		"placeId": "ChIJCZjV4FW2yhQRDEeRFX0AmwA"
    	}, {
    		"location": {
    			"latitude": 41.06672161631816,
    			"longitude": 29.000650075553303
    		},
    		"originalIndex": 1,
    		"placeId": "ChIJCZjV4FW2yhQRDEeRFX0AmwA"
    	}, {
    		"location": {
    			"latitude": 41.06672259634441,
    			"longitude": 29.00054981436102
    		},
    		"originalIndex": 2,
    		"placeId": "ChIJIezW5FW2yhQRihVTi_Rse9s"
    	}, 
    	......],
    	"gpsId": "589c02bcf9c7f53a5fee39fb",
    	"__v": 0
    }

    Note: For only first time this data will come from google and will be saved to mongoDB,
        Next time it will be retrieved form mongoDB.

### Get single Road api snapedToRoad GPS data by id (Returns Formatted data)
GET https://gmap-road.herokuapp.com/api/gps/road/?id=589c02bcf9c7f53a5fee39fb&formatted=true

    Sample Output
        {
        	"_id": "589c3f13c321fa9cccf741ec",
        	"snappedPoints": [{
                "lng": 29.00071,
                "lat": 41.06672
            }, {
                "lng": 29.00065,
                "lat": 41.06672
            }, {
                "lng": 29.00055,
                "lat": 41.06671
            }, {
                "lng": 29.00041,
                "lat": 41.06673
            }, 
            .......],
        	"gpsId": "589c02bcf9c7f53a5fee39fb",
        	"__v": 0
        }