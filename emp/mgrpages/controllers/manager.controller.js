//Manager Pages Tabs (on manager.html)
angular.module('emp').controller('mgrCtrl',['$scope', function ($scope) {
        $scope.tabs = [{
            title: 'User Accounts',
            contenturl: '/emp/mgrpages/mgrusers.html',
            icon: 'glyphicon glyphicon-user'
        }, {
            title: 'Room Management',
            contenturl: '/emp/mgrpages/mgrrooms.html',
            icon: 'glyphicon glyphicon-bed'
        }, {
            title: 'Occupancy Report',
            contenturl: '/emp/mgrpages/mgroccrpt.html',
            icon: 'glyphicon glyphicon-list-alt'
        }, {
            title: 'Housekeeping Report',
            contenturl: '/emp/mgrpages/mgrmaidrpt.html',
            icon: 'glyphicon glyphicon-file'
        }];

    }]);