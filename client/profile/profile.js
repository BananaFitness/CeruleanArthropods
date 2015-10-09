angular.module('eir.profile', [])

.controller('profileCtrl', function ($scope, profileFactory) {
  $scope.currentUser = {};

  $scope.getProfile = function() {

    $scope.currentUser = profileFactory.getProfileInfo();

      //This is for when we have the database sorted
      //profileFactory.getProfileInfo()
      // .then(function(userData) {
      //   $scope.currentUser = userData
      //   console.log($scope.currentUser)
      // })
      // .catch(function(err) {
      //   console.log('ERROR: ' + err);
      // });
    };
  $scope.getProfile();
  $scope.rowCollection = [
      {donationDate: new Date('2015-01-01'), patient: 'John Doe 1', condition: 'Sickness 1', amount: 5000},
      {donationDate: new Date('2015-02-01'), patient: 'John Doe 2', condition: 'Sickness 2', amount: 200},
      {donationDate: new Date('2015-03-01'), patient: 'John Doe 3', condition: 'Sickness 3', amount: 1000},
      {donationDate: new Date('2015-04-01'), patient: 'John Doe 4', condition: 'Sickness 4', amount: 3000},
      {donationDate: new Date('2015-05-01'), patient: 'John Doe 5', condition: 'Sickness 5', amount: 10000},
      {donationDate: new Date('2015-06-01'), patient: 'John Doe 6', condition: 'Sickness 6', amount: 20},
      {donationDate: new Date('2015-07-01'), patient: 'John Doe 7', condition: 'Sickness 7', amount: 50},
      {donationDate: new Date('2015-08-01'), patient: 'John Doe 8', condition: 'Sickness 8', amount: 5}
  ];
  $scope.optionsPie = {
      chart: {
          type: 'pieChart',
          height: 450,
          margin : {
              top: 20,
              right: 20,
              bottom: 60,
              left: 55
          },
          x: function(d){ return d.label; },
          y: function(d){ return d.value; },
          showLabels: true,
          transitionDuration: 500,
          labelType: "value",
          donut: true
      }
  };
  $scope.dataPie = [
      { 
        "label": "Sickness 1",
        "value" : 5000
      } , 
      { 
        "label": "Sickness 2",
        "value" : 200
      } , 
      { 
        "label": "Sickness 3",
        "value" : 1000
      } , 
      { 
        "label": "Sickness 4",
        "value" : 3000
      } , 
      { 
        "label": "Sickness 5",
        "value" : 10000
      } , 
      { 
        "label": "Sickness 6",
        "value" : 20
      } , 
      { 
        "label": "Sickness 7",
        "value" : 50
      } , 
    ];

    $scope.optionsBar = {
          chart: {
              type: 'discreteBarChart',
              height: 450,
              margin : {
                  top: 20,
                  right: 20,
                  bottom: 60,
                  left: 55
              },
              x: function(d){return d.label;},
              y: function(d){return d.value;},
              showValues: true,
              valueFormat: function(d){
                  return d3.format(',.4f')(d);
              },
              transitionDuration: 500,
              xAxis: {
                  axisLabel: 'X Axis'
              },
              yAxis: {
                  axisLabel: 'Y Axis',
                  axisLabelDistance: 30
              }
          }
      };

      $scope.dataBar = [
            {
                key: "Dontations",
                values: $scope.dataPie
            }
        ]


});
