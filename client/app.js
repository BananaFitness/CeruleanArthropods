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
  'ngRoute',
  'angularPayments'
]);

app.config(function($routeProvider, $httpProvider) {
  $routeProvider
    .when('/home', {
      templateUrl: '/home/home.html',
      controller: 'homeCtrl'
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
    .otherwise({
      redirectTo: '/home'
    });

  // Use interceptor to use AttachTokens factory to add token to outgoing requests
  $httpProvider.interceptors.push('AttachTokens');
})

.factory('AttachTokens', function($window) {
    var request = function(reqObject) {
      var jwt = $window.localStorage.getItem('com.eir');
      if (jwt) {
        reqObject.headers['x-access-token'] = jwt;
      }
      reqObject.headers['Allow-Control-Allow-Origin'] = '*';
      return reqObject;
    };

    return {
      request: request
    };
  })
  .run(function($rootScope, $location, authFactory) {
    $rootScope.$on('$routeChangeStart', function(evt, next, current) {
      if (next.$$route && next.$$route.authenticate && !authFactory.isAuth()) {
        $location.path('/login');
      }
    });
  });
