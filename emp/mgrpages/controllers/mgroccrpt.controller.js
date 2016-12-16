angular.module('emp').controller('BarCtrl',
  function ($scope) {
    $scope.labels = [ 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    $scope.series = ['Check-ins', 'Check-outs'];

    $scope.data = [
      [65, 59, 80, 81, 56, 55, 40],
      [28, 48, 40, 19, 86, 27, 90]
    ];
});
              