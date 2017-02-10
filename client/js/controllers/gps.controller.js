;(function() {
    var gpsCtrl = ['$http', '$routeParams', function($http, $routeParams) {
        console.log($routeParams);
        
        $http({
            url: '/api/gps/raw',
            method: 'GET',
            params: {
                id: $routeParams.id,
                formatted: true
            }
        }).then(function(res) {
            var map = new google.maps.Map(document.getElementById('gpsMap'), {
              zoom: 15,
              center: res.data.gpsData[0],
              mapTypeId: 'terrain'
            });
    
            
            var flightPath = new google.maps.Polyline({
              path: res.data.gpsData,
              geodesic: true,
              strokeColor: '#033661',
              strokeOpacity: 1.0,
              strokeWeight: 2
            });
            flightPath.setMap(map);
            
            $http({
               url: '/api/gps/road',
                method: 'GET',
                params: {
                    id: $routeParams.id,
                    formatted: true
                } 
            }).then(function(resData) {
                console.log(resData);
                var roadMap = new google.maps.Map(document.getElementById('roadGpsMap'), {
                  zoom: 15,
                  center: resData.data.snappedPoints[0],
                  mapTypeId: 'terrain'
                });
                new google.maps.Polyline({
                  path: resData.data.snappedPoints,
                  geodesic: true,
                  strokeColor: '#033661',
                  strokeOpacity: 1.0,
                  strokeWeight: 5
                })
                .setMap(roadMap);
                
            }, function(err) {
                console.log('get roadgps err', err);
            });
        }, function(err) {
            console.log('get gps err', err);
        })
    }];
    
    angular.module('roadGPS')
    .controller('gpsController', gpsCtrl);
})();