(function () {
    'use strict';

    angular
        .module('app')
        .controller('Res.IndexController', Controller);

    /**
     * Pass in any objests or services that you'll use. For example, you could use UserService, RoomService, ReservationService, FlashService, or $window.
     * The services are defined in the app/app-services folder and loaded on the app/index.html page.
     * This controller is loaded in the app/index.html page as well and linked to the appropriate 
     */
    function Controller($state, FlashService, $scope) {

        $scope.formInfo = {}
        $scope.saveData = function() {
                console.log($scope.formInfo);
 
        };      
    }

})();