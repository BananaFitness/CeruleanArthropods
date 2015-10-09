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
  'smart-table',
  'nvd3'
]);

app.config(function($stateProvider, $urlRouterProvider, $httpProvider) {
  $stateProvider

  // contains homepage view, globe, patients link view, get funded link view
    .state('home', {
      url: '/',
      templateUrl: 'home/home.html',
      controller: 'homeCtrl'
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
    .state('donate.charge', {
      // parent: 'donate',
      url: '/charge',
      templateUrl: '/donate/donate.charge.html', //rename this
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
});

app.controller('AppController', function($scope, $location, $anchorScroll, appFactory) {

    $scope.loginStatus = false;

    $scope.getStatus = function() {
      $scope.loginStatus = appFactory.getLoginStatus();
    }

    $scope.scrollTo = function(id) {
      $location.path('/')
      // $location.hash(id);
      $anchorScroll();
    }

    $scope.getStatus();

  })

app.run(function($rootScope, $location, authFactory) {
  $rootScope.$on('$routeChangeStart', function(evt, next, current) {
    if (next.$$route && next.$$route.authenticate && !authFactory.isAuth()) {
      $location.path('/login');
    }
  });
})
