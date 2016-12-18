(function () {
    'use strict';

    angular
        .module('app')
        .controller('Home.IndexController', Controller);

    /**
     * Pass in any objests or services that you'll use. For example, you could use UserService, RoomService, ReservationService, FlashService, or $window.
     * The services are defined in the app/app-services folder and loaded on the app/index.html page.
     * This controller is loaded in the app/index.html page as well and linked to the appropriate 
     */
    function Controller($state, FlashService, ResService) {
        var vm = this; // Allows you to interact with the page. Think of it as $scope, but less chance of conflict.
        vm.res = {};
        vm.checkAvail = checkAvail; // Links the checkAvail function defined here with checkAvail on the page through vm.

        initController();

        function initController() {
            // What you like to do upon page load? 
            // For example, get the user that's logged.
            vm.reservation = {
                userEmail: "motelmartian@gmail.com",
                startDate: new Date("12/20/2016"),
                endDate: new Date("12/30/2016"),
                numGuests: 3
            };
        }

        function checkAvail() {
            //Send reservation information to database
            //What do you expect back?
            console.log(vm.res);

            ResService.Check(vm.res)
                .then(function () {
                    FlashService.Success("Dates Available");
					$state.go('/reservations', {toParams: paramObject})
                })
                .catch(function (err) {
                    FlashService.Error(err);
                });
        }
    }

})();
