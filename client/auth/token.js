angular.module('eir.token', [])

.controller('tokenCtrl', function ($scope, $location, $window, $routeParams) {
  $scope.$on('$routeChangeSuccess', function(){
    var token = $routeParams.token;
    $window.localStorage.setItem('com.eir', token);
    $location.path('/#/patients');
  });
});
