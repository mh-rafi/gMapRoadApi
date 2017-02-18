;(function() {
    var gpsCtrl = ['$http', '$routeParams', function($http, $routeParams) {
        var vm = this;
        var geoSpherical = google.maps.geometry.spherical;
        
        vm.rawPathLength = 0;
        vm.roadPathLength = 0;
        
        $http({
            url: '/api/gps/raw',
            method: 'GET',
            params: {
                id: $routeParams.id
            }
        }).then(function(res) {
            console.log(res.data);
            var map = new google.maps.Map(document.getElementById('gpsMap'), {
              zoom: 15,
              center: res.data.gpsData[0],
              mapTypeId: 'terrain'
            });
    
            
            var rawPath = new google.maps.Polyline({
              path: res.data.gpsData,
              geodesic: true,
              strokeColor: '#033661',
              strokeOpacity: 1.0,
              strokeWeight: 2
            });
            rawPath.setMap(map);
            
            vm.rawPathLength = (geoSpherical.computeLength(rawPath.getPath())).toFixed(2);
           
            
            
            $http({
               url: '/api/gps/road',
                method: 'GET',
                params: {
                    id: $routeParams.id,
                    formatted: true
                } 
            }).then(function(resData) {
                console.log('road', resData.data);
                var roadMap = new google.maps.Map(document.getElementById('roadGpsMap'), {
                  zoom: 15,
                  center: resData.data.snappedPoints[0],
                  mapTypeId: 'terrain'
                });
                var roadPath = new google.maps.Polyline({
                  path: resData.data.snappedPoints,
                  geodesic: true,
                  strokeColor: '#033661',
                  strokeOpacity: 1.0,
                  strokeWeight: 5
                });
                roadPath.setMap(roadMap);
                
                vm.roadPathLength = (geoSpherical.computeLength(roadPath.getPath())).toFixed(2);

                
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