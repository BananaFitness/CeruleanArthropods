angular.module('eir.auth', [])

.controller('authCtrl', function ($scope, $window, $location, authFactory) {
  $scope.user = {};

  $scope.signin = function () {
    authFactory.signin($scope.user)
      .then(function (token) {
        $window.localStorage.setItem('com.eir', token);
        $location.path('/patients');
      })
      .catch(function (error) {
        console.error(error);
      });
  };

  $scope.signinFacebook = function () {
    authFactory.signinFacebook()
      .then(function (token) {
        $window.localStorage.setItem('com.eir', token);
        $location.path('/patients');
      })
      .catch(function (error) {
        console.error(error);
      });
  };

  $scope.signup = function () {
    authFactory.signup($scope.user)
      .then(function (token) {
        $window.localStorage.setItem('com.eir', token);
        $location.path('/patients');
      })
      .catch(function (error) {
        console.error(error);
      });
  };

  $scope.signout = function () {
    authFactory.signout();
  }

});
