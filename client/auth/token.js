angular.module('eir.token', [])

.controller('tokenCtrl', function ($scope, $location, $window, $stateParams) {
  $scope.$on('$stateChangeSuccess', function(){
    var token = $stateParams.token;
    $window.localStorage.setItem('com.eir', token);
    $location.path('/');
  });
});
