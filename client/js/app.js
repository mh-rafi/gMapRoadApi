;(function(){
    angular.module('roadGPS', ['ngRoute'])
    .config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
		$routeProvider
			.when('/demo', {
				templateUrl: 'views/main.html'
			})
			.when('/demo/gpsmap/:id', {
				templateUrl: 'views/gps.html',
				controller: 'gpsController',
				controllerAs: 'gpsCtrl'
			})
			.otherwise({
				redirectTo: '/demo'
			});
			$locationProvider.html5Mode(true);
	}])
	.run(['$rootScope', '$http', function($rootScope, $http) {
	    $http.get('/api/gps/raw').then(function(res) {
	    	$rootScope.allGPS = [];
	    	angular.forEach(res.data, function(item) {
	    		$rootScope.allGPS.push(item._id);
	    	});
	    	console.log($rootScope.allGPS)
	    }, function(err) {
	    	console.log(err)
	    })
	}])
})();