(function(){
    'use strict';
    angular.module('plotly', [])
    .directive('plotly', function($window, $timeout, $rootScope) {
      return {
        restrict: 'E',
        template: '<div></div>',
        scope: {
          data: '=',
          layout: '=',
          options: '=',
          chart: '@'
        },
        link: function(scope, element) {
          element = element[0].children[0];
          var initialized = false;
          var init = function() {
            if (initialized)
              return;
            else
              initialized = true;
            Plotly.newPlot(element, scope.data, scope.layout, scope.options);
          }

          scope.$watch(function() {
            return [scope.layout, scope.data];
          }, function() {
            if (element.layout != undefined) {
              var widthTemp = element.layout.width;
            }
            init();
            element.data = scope.data;
            element.layout = scope.layout;
            Plotly.redraw(element);
            if (widthTemp != undefined) {
              element.layout.width = widthTemp;
            }
            Plotly.Plots.resize(element);
          }, true);

          var w = angular.element($window);
          scope.getWindowDimensions = function () {
            return {
              'h': w.height(),
              'w': w.width()
            };
          };
          scope.$watch(scope.getWindowDimensions, function () {
            Plotly.Plots.resize(element);
          }, true);
          w.bind('resize', function () {
            scope.$apply();
          });
          $timeout(function () {
            element.on('plotly_click', function(data){
              $rootScope.$broadcast('plotly_click', {name: scope.chart, event: data});
            });
            element.on('plotly_hover', function(data){
              $rootScope.$broadcast('plotly_hover', {name: scope.chart, event: data});
            });
            element.on('plotly_unhover', function(data){
              $rootScope.$broadcast('plotly_hover', {name: scope.chart, event: data});
            });
            element.on('plotly_selected', function(data){
              $rootScope.$broadcast('plotly_selected', {name: scope.chart, event: data});
            });
          })
        }
      };
    });
})();
