;(function(){
    angular.module('roadGPS', [])
    .config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
		$routeProvider
			.when('/', {
				templateUrl: 'views/gps.html',
				controller: 'gpsController',
				controllerAs: 'gpsCtrl'
			})
			.otherwise({
				redirectTo: '/'
			});
	}])
	.run(['$rootScope', function($rootScope) {
	    
	}])
})();