var express = require('express');
var router = express.Router();
var myAppModule = angular.module('MyApp', ['ui.bootstrap.datetimepicker'])

// Serve angular app files from the '/app' route
router.use('/', express.static('app'));

module.exports = router;

/* Bindable functions
 -----------------------------------------------*/
$scope.endDateBeforeRender = endDateBeforeRender
$scope.endDateOnSetTime = endDateOnSetTime
$scope.startDateBeforeRender = startDateBeforeRender
$scope.startDateOnSetTime = startDateOnSetTime

function startDateOnSetTime () {
  $scope.$broadcast('start-date-changed');
}

function endDateOnSetTime () {
  $scope.$broadcast('end-date-changed');
}

function startDateBeforeRender ($dates) {
  if ($scope.dateRangeEnd) {
    var activeDate = moment($scope.dateRangeEnd);

    $dates.filter(function (date) {
      return date.localDateValue() >= activeDate.valueOf()
    }).forEach(function (date) {
      date.selectable = false;
    })
  }
}

function endDateBeforeRender ($view, $dates) {
  if ($scope.dateRangeStart) {
    var activeDate = moment($scope.dateRangeStart).subtract(1, $view).add(1, 'minute');

    $dates.filter(function (date) {
      return date.localDateValue() <= activeDate.valueOf()
    }).forEach(function (date) {
      date.selectable = false;
    })
  }
}