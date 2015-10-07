angular.module('eir.profile', [])

.controller('profileCtrl', function ($scope, profileFactory) {
  $scope.currentUser = {}

  $scope.getProfile = function() {

    $scope.currentUser = profileFactory.getProfileInfo()

      //This is for when we have the database sorted
      //profileFactory.getProfileInfo()
      // .then(function(userData) {
      //   $scope.currentUser = userData
      //   console.log($scope.currentUser)
      // })
      // .catch(function(err) {
      //   console.log('ERROR: ' + err);
      // });
  }
  $scope.getProfile()
});
