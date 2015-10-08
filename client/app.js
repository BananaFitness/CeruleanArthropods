var app = angular.module('eir', [
  'eir.factory',
  'eir.home',
  'eir.about',
  'eir.patients',
  'eir.getFunded',
  'eir.profile',
  'eir.donate',
  'eir.thankYou',
  'eir.auth',
  'eir.token',
  'ngRoute',
  'angularPayments'
]);

app.config(function($routeProvider, $httpProvider) {
  $routeProvider
    .when('/home', {
      templateUrl: '/home/home.html',
      controller: 'AppController'
    })
    .when('/about', {
      templateUrl: '/about/about.html',
      controller: 'aboutCtrl'
    })
    .when('/patients', {
      templateUrl: '/patients/patients.html',
      controller: 'patientsCtrl'
    })
    .when('/get-funded', {
      templateUrl: '/patients/get-funded.html',
      controller: 'getFundedCtrl'
    })
    .when('/profile', {
      templateUrl: '/profile/profile.html',
      controller: 'profileCtrl'
    })
    .when('/donate/:id', {
      templateUrl: '/donate/donate.html',
      controller: 'donateCtrl'
    })
    .when('/thank-you', {
      templateUrl: '/thank-you.html',
      controller: 'thankYouCtrl'
    })
    .when('/signin', {
      templateUrl: '/auth/signin.html',
      controller: 'authCtrl'
    })
    .when('/signup', {
      templateUrl: '/auth/signup.html',
      controller: 'authCtrl'
    })
    .when('/jwt', {
      templateUrl: '/auth/signup.html',
      controller: 'tokenCtrl'
    })
    .otherwise({
      redirectTo: '/home'
    });

  // Use interceptor to use AttachTokens factory to add token to outgoing requests
  $httpProvider.interceptors.push('AttachTokens');
})

.config(['$httpProvider', function($httpProvider) {
    $httpProvider.defaults.useXDomain = true;
    $httpProvider.defaults.withCredentials = true;
    delete $httpProvider.defaults.headers.common["X-Requested-With"];
    $httpProvider.defaults.headers.common["Accept"] = "application/json";
    $httpProvider.defaults.headers.common["Content-Type"] = "application/json";
   }
])

.factory('AttachTokens', function ($window, $location, $q) {
  var request = function (reqObject) {
    var jwt = $window.localStorage.getItem('com.eir');
    if( jwt ) {
      reqObject.headers['x-access-token'] = jwt;
    }
    reqObject.headers['Allow-Control-Allow-Origin'] = '*';
    return reqObject;
  };

  var responseError = function(response) {
        if(response.status === 401 || response.status === 403) {
            $location.path('/signin');
        }
        return $q.reject(response);
  };

  return {
    request: request,
    responseError : responseError
  };
})

app.controller('AppController', function($scope, $location, appFactory) {
  $scope.loginStatus = false;

  $scope.getStatus = function() {
    $scope.loginStatus = appFactory.getLoginStatus();
  }

  $scope.getStatus();
  
})
// Heavily inspired by http://plnkr.co/edit/JLRta7?p=preview
app.directive('planetary', function() {
  return {
    restrict: 'A',
    scope: {
      data: '='
    }, 
    link: function (scope, element, attrs) {
      var autorotate = function (degPerSec) {
        return function(planet) {
          var lastTick = null;
          planet.onDraw(function() {
            var now = new Date();
            var delta = now - lastTick;
            var rotation = planet.projection.rotate();
            rotation[0] += degPerSec * delta / 1000;
            if (rotation[0] >= 180) rotation[0] -= 360;
            planet.projection.rotate(rotation);
            lastTick = now;
          });
        };
      }
      var planet = planetaryjs.planet();

      planet.loadPlugin(planetaryjs.plugins.earth({
        topojson: { file:   '/world-110m.json' },
        oceans:   { fill:   '#001320' },
        land:     { fill:   '#06304e' },
        borders:  { stroke: '#001320' }
      }));
      planet.loadPlugin(planetaryjs.plugins.pings());
      planet.loadPlugin(planetaryjs.plugins.zoom({
        scaleExtent: [50, 5000]
      }));
      planet.loadPlugin(planetaryjs.plugins.drag({
        onDragStart: function() {
          this.plugins.autorotate.pause();
        },
        onDragEnd: function() {
          this.plugins.autorotate.resume();
        }
      }));
      planet.loadPlugin(autorotate(5));
      planet.projection.rotate([100, -10, 0]);
      var canvas = element[0];
      planet.draw(canvas);


      // Create a color scale for the various earthquake magnitudes; the
      // minimum magnitude in our data set is 2.5.
      var colors = d3.scale.pow()
        .exponent(3)
        .domain([2, 4, 6, 8, 10])
          .range(['white', 'yellow', 'orange', 'red', 'purple']);
      // Also create a scale for mapping magnitudes to ping angle sizes
      var angles = d3.scale.pow()
        .exponent(3)
        .domain([2.5, 10])
        .range([0.5, 15]);
      // And finally, a scale for mapping magnitudes to ping TTLs
      var ttls = d3.scale.pow()
        .exponent(3)
        .domain([2.5, 10])
        .range([2000, 5000]);

      // Create a key to show the magnitudes and their colors
      d3.select('#magnitudes').selectAll('li')
        .data(colors.ticks(9))
      .enter()
        .append('li')
        .style('color', colors)
        .text(function(d) {
          return "Magnitude " + d;
        });
    }
  }
})

app.run(function ($rootScope, $location, authFactory) {
  $rootScope.$on('$routeChangeStart', function (evt, next, current) {
    if( next.$$route && next.$$route.authenticate && !authFactory.isAuth() ) {
      $location.path('/login');
    }
  });
})
