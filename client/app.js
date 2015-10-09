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
  'ui.router',
  'angularPayments',
  'duParallax',
  'ui.bootstrap'
]);

app.config(function($stateProvider, $urlRouterProvider, $httpProvider) {
  $stateProvider

  // contains homepage view, globe, patients link view, get funded link view
    .state('home', {
      url: '/',
      templateUrl: 'home/home.html',
    })
    // has the patient view (lined to from patients linked view, replaces primary view)
    .state('patients', {
      url: '/patients',
      templateUrl: '/patients/patients.html',
      controller: 'patientsCtrl'
    })
    // has the profile view (linked to from navbar)
    .state('profile', {
      url: '/profile',
      templateUrl: '/profile/profile.html',
      controller: 'profileCtrl'
    })
    // has the donation view for specific patient (loads in page under patient view)
    .state('donate', {
      url: '/donate/:id',
      templateUrl: '/donate/donate.html',
      controller: 'donateCtrl'
    })
    // load the charge form as child view
    .state('charge', {
      url: '/charge',
      templateUrl: '/donate/charge.html', //rename this
      controller: 'donateCtrl'
    })
    // has signin view that replaces primary view
    .state('signin', {
      url: '/signin',
      templateUrl: '/auth/signin.html',
      controller: 'authCtrl'
    })
    .state('signup', {
      url: '/signup',
      templateUrl: '/auth/signup.html',
      controller: 'authCtrl'
    })
    .state('jwt', {
      url: '/jwt',
      templateUrl: '/auth/signup.html',
      controller: 'tokenCtrl'
    });

  $urlRouterProvider.otherwise('/');

  // Use interceptor to use AttachTokens factory to add token to outgoing requests
  $httpProvider.interceptors.push('AttachTokens');
})

.config(['$httpProvider', function($httpProvider) {
  $httpProvider.defaults.useXDomain = true;
  $httpProvider.defaults.withCredentials = true;
  delete $httpProvider.defaults.headers.common["X-Requested-With"];
  $httpProvider.defaults.headers.common["Accept"] = "application/json";
  $httpProvider.defaults.headers.common["Content-Type"] = "application/json";
}])

.factory('AttachTokens', function($window, $location, $q) {
  var request = function(reqObject) {
    var jwt = $window.localStorage.getItem('com.eir');
    if (jwt) {
      reqObject.headers['x-access-token'] = jwt;
    }
    reqObject.headers['Allow-Control-Allow-Origin'] = '*';
    return reqObject;
  };

  var responseError = function(response) {
    if (response.status === 401 || response.status === 403) {
      $location.path('/signin');
    }
    return $q.reject(response);
  };

  return {
    request: request,
    responseError: responseError
  };
})

app.controller('AppController', function($scope, $location, $anchorScroll, appFactory, parallaxHelper) {
    $scope.background = parallaxHelper.createAnimator(-0.3);

    $scope.loginStatus = false;

    $scope.getStatus = function() {
      $scope.loginStatus = appFactory.getLoginStatus();
    }

    $scope.scrollTo = function(id) {
      $location.hash(id);
      $anchorScroll();
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
    link: function(scope, element, attrs) {
      var autorotate = function(degPerSec) {
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
        topojson: {
          file: '/world-110m.json'
        },
        oceans: {
          fill: '#4B566B'
        },
        land: {
          fill: '#B2CCFF'
        },
        borders: {
          stroke: '#4B566B'
        }
      }));

      planetaryjs.plugins.pings({
        color: 'red',
        ttl: 5000,
        angle: 10
      });

      planet.loadPlugin(planetaryjs.plugins.zoom({
        scaleExtent: [50, 2000]
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

      //Draws in the DOM canvas element
      var canvas = element[0];
      planet.draw(canvas);
    }
  }
})

app.run(function($rootScope, $location, authFactory) {
  $rootScope.$on('$routeChangeStart', function(evt, next, current) {
    if (next.$$route && next.$$route.authenticate && !authFactory.isAuth()) {
      $location.path('/login');
    }
  });
})
