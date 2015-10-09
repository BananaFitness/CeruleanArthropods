angular.module('eir.token', [])

.controller('tokenCtrl', function ($scope, $location, $window) {
  $scope.$on('$stateChangeSuccess', function(){
    var token = $location.search().token;
    $window.localStorage.setItem('com.eir', token);
    $location.path('/');
  });
});
