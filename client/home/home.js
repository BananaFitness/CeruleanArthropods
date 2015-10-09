var home = angular.module('eir.home', [
  'ui.bootstrap'
  ])

home.controller('homeCtrl', function($scope, patientsFactory) {

  $scope.pings;

  $scope.getLocations = function() {
    patientsFactory.getPatients()
      .then(function(conditions) {
        console.log(conditions)
        $scope.pings = conditions
      })
  }
  
  $scope.getLocations()

})

  // Heavily inspired by http://plnkr.co/edit/JLRta7?p=preview
home.directive('planetary', function() {
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
