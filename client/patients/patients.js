angular.module('eir.patients', [])

.controller('patientsCtrl', function ($scope, patientsFactory, conditionFactory, $q, $location) {

  $scope.patients;

  $scope.go = function(id) { // change this for state provider and nganimate if want
    $location.path('/donate/' + id);
  };

  $scope.getAllPatientsConditions = function(arrPatientObj) {
    // create promise array
    var conditionPromises = [];
    for(var i=0; i < $scope.patients.length; i++) {
      conditionPromises.push(conditionFactory.getCondition($scope.patients[i].condition_id));
    }

    // resolve all promises, then apply to scope
    Promise.all(conditionPromises)
      .then(function (res){
        var index = 0;
        while(res.length) {
          var condition = res.shift()[0].condition_name;
          $scope.patients[index++].condition_name = condition;
        }
        $scope.$apply();
      });
  };

  $scope.leftToFund = function() {
    for(var i = 0; i < $scope.patients.length; i++) {
      leftToFund = $scope.patients[i].goal - $scope.patients[i].progress
      $scope.patients[i].leftToFund = leftToFund;
    }
  };

  patientsFactory.getPatients()
  .then(function(res){
    $scope.patients = res || [];
    return res;
  })
  .then(function (res){
    $scope.getAllPatientsConditions();
  })
  .then(function(res){
    $scope.leftToFund();
  });
});
