;(function() {
    var gpsCtrl = ['$http', function($http) {
        console.log('gps');
        
        $http({
            url: '/api/gps/raw',
            method: 'GET',
            params: {
                id: '589bffd42da3292cd15cfad4'
            }
        }).then(function(res) {
            console.log(res);
            var map = new google.maps.Map(document.getElementById('gpsMap'), {
              zoom: 15,
              center: res.data.gpsData[0],
              mapTypeId: 'terrain'
            });
    
            
            var flightPath = new google.maps.Polyline({
              path: res.data.gpsData,
              geodesic: true,
              strokeColor: '#FF0000',
              strokeOpacity: 1.0,
              strokeWeight: 2
            });
    
            flightPath.setMap(map);
        }, function(err) {
            console.log('err', err);
        })
    }];
    
    angular.module('roadGPS')
    .controller('gpsController', gpsCtrl);
})();