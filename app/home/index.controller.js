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
    function Controller($state, FlashService) {
        var vm = this; // Allows you to interact with the page. Think of it as $scope, but less chance of conflict.

        vm.reservation = null; // You can set fields with vm and use them on the page
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
            if (dataBase(vm.reservation)) {
                //Perform this action if there is availability
                FlashService.Success("Dates Available");
                console.log("Dates Available");
                //Redirects to reservations page with vm.reservation as a parameter. Shows up as $stateParams if you want to use it.
                $state.go('reservations', vm.reservation);

            } else {
                //Perform this action if there is no availability
                FlashService.Error("No Availability");
                console.log("No Availability");
            }
        }

        function dataBase(rsrvParam) {
            return Math.random() < .5; //Return what you expect from the database. In this case, a random true or false boolean.
        }
    }

})();
