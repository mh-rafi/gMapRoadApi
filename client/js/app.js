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
		
		$rootScope.getAllGps = function(cb) {
			$http.get('/api/gps/raw').then(function(res) {
		    	$rootScope.allGPS = [];
		    	angular.forEach(res.data, function(item) {
		    		$rootScope.allGPS.push(item._id);
		    	});
		    	if(cb)
		    		cb();
		    	console.log($rootScope.allGPS)
		    }, function(err) {
		    	console.log(err)
		    });
		}
		
	    
	    
	    
	    $rootScope.uploadFile = function() {
	    	$rootScope.isUploading = true;
	        var file = $rootScope.gpsCSVFile;
	        var fd = new FormData();
	        fd.append('csvfile', file);
			// console.log(file);
	        $http.post('/api/gps/uploadCSV',fd, {
	            transformRequest: angular.identity,
	            headers: {'Content-Type': undefined}
	        })
	        .then(function(res){
	          console.log("success!!", res);
	          $rootScope.isUploading = false;
	          $rootScope.getAllGps();
	        }, function(err) {
	          console.log("error!!", err);
	        });
	    };
	    
	    $rootScope.getAllGps();
	}])
	.directive('fileModel', ['$parse', function ($parse) {
		return {
		restrict: 'A',
			link: function(scope, element, attrs) {
			var model = $parse(attrs.fileModel);
			var modelSetter = model.assign;
			
			element.bind('change', function(){
				scope.$apply(function(){
					modelSetter(scope, element[0].files[0]);
				});
			});
			}
		};
}]);
})();