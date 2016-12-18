//User Accounts Page get all Rooms / Clear filter (on mgrrooms.html)
angular.module('emp').controller('roomCtrl', ['$scope', '$http', '$window', '$modal', function ($scope, $http, $window, $modal) {
    $scope.orderByRoomField = 'num';
    $scope.reverseRoomSort = false;

    $scope.rooms = [];
    $scope.rmtypes = [];

    if ($window.jwtToken) $http.defaults.headers.common['Authorization'] = 'Bearer ' + $window.jwtToken;

    loadData();

    function loadData() {
        $http.get('/api/protected/room').then(function (res) {
            $scope.rooms = res.data;
        });

        $http.get('/api/protected/room/type')
            .then(
                function (res) {
                    $scope.rmtypes = res.data;
                    console.log(JSON.stringify(res.data));
                    console.log("API room Type pull:");
                    console.log($scope.rmtypes);
                },
                function (res) {
                    // failure callback
                    console.log("Failed to pull room types");
                    console.log(JSON.stringify(res));
                }
            );
    };

    $scope.getRoomType = function (room) {
        if (!$scope.rmtypes) {
            return;
        }
        for (var c = 0; c < $scope.rmtypes.length; c++) {
            var rt = $scope.rmtypes[c];
            if (rt._id == room.rmType) {
                return rt.name;
            }
        }
    };

    $scope.clearRoomFilter = function () {
        $scope.txtRoomFilter = null;
    };

    // MODAL WINDOW
    $scope.open = function (_room) {
        var modalInstance = $modal.open({
            controller: "ModalInstanceRoomCtrl",
            templateUrl: '/emp/mgrpages/mgrrooms.modal.html',
            resolve: {
                room: function () {
                    return _room;
                }
            }
        });
        modalInstance.result.then(function () {
            loadData();
        });
    };
}]);


//mgrrooms.modal.html
app.controller('ModalInstanceRoomCtrl', function ($scope, room, $modalInstance, $http) {
    $scope.min = 1;
    $scope.max = 7;

    if (room == "new") {
        console.clear();
        $scope.newReq = true;
        //remp room
        room = {
            avail: true,
            num: "",
            rmType: "584ee981f69dbedfbeac42fc"
        };
    }

    $scope.rmtypes = [];
    $http.get('/api/protected/room/type').then(function (res) {
        $scope.rmtypes = res.data;
    });


    $scope.room = room;
    console.log(room);
    //orginal values
    $scope.orig = angular.copy($scope.rooms);
    $scope.origRoom = angular.copy($scope.room);

    $scope.cancelRoom = function () {
        //reset data to defaults
        if (!$scope.newReq) {
            angular.copy($scope.origRoom, $scope.room);
        }
        $modalInstance.dismiss('cancel');
    };

    $scope.deleteRoom = function (request, response) {
        $http.delete('/api/protected/room/' + room._id, { _id: room._id})
                  .then(
                function (response) {
                    // success callback
                },
                function (response) {
                    // failure callback
                    console.log("Failed to Delete");
                }
            );
            $modalInstance.close();
    };

    $scope.okRoom = function (request, response) {
        console.log(room);
        if (!$scope.newReq) {
            $http.put('/api/protected/room/' + room._id, room)
                .then(
                    function (response) {
                        // success callback
                        console.log("Put Sucessful");
                        console.log(JSON.stringify(response));
                    },
                    function (response) {
                        // failure callback
                        console.log("Failed to Put");
                        console.log(JSON.stringify(response));
                    }
                );
        } else {
            $http.post('/api/protected/room/', room).then(
                function (response) {
                    // success callback
                    console.log("Put Sucessful");
                    console.log(JSON.stringify(response));
                },
                function (response) {
                    // failure callback
                    console.log("Failed to Put");
                    console.log(JSON.stringify(response));
                }
            );
        }
        $modalInstance.close();
    };
});