//Manager Pages Tabs (on manager.html)
angular.module('emp').controller('mgrCtrl',['$scope', function ($scope) {
        $scope.tabs = [{
            title: 'Users',
            contenturl: '/emp/mgrpages/mgrusers.html',
            icon: 'glyphicon glyphicon-user'
        }, {
            title: 'Rooms',
            contenturl: '/emp/mgrpages/mgrrooms.html',
            icon: 'glyphicon glyphicon-bed'
        },{
            title: 'Room Types',
            contenturl: '/emp/mgrpages/mgrroomtypes.html',
            icon: 'glyphicon glyphicon-list'
        }, 
        {
            title: 'Occupancy Report',
            contenturl: '/emp/mgrpages/mgroccrpt.html',
            icon: 'glyphicon glyphicon-list-alt'
        }, {
            title: 'Housekeeping Report',
            contenturl: '/emp/mgrpages/mgrmaidrpt.html',
            icon: 'glyphicon glyphicon-file'
        }];

    }]);