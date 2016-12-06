(function () {
    'use strict';

    angular
        .module('login')
        .controller('Login.IndexController', Controller);

    /**
     * Pass in any objests or services that you'll use. For example, you could use UserService, RoomService, ReservationService, FlashService, or $window.
     * The services are defined in the app/app-services folder and loaded on the app/index.html page.
     * This controller is loaded in the app/index.html page as well and linked to the appropriate 
     */
    function Controller($window, LoginService, FlashService) {
        var vm = this; // Allows you to interact with the page. Think of it as $scope, but less chance of conflict.

        vm.user = null; // You can set fields with vm and use them on the page
        vm.login = login; // Links the checkAvail function defined here with checkAvail on the page through vm.
		vm.register = register; //redirects to Register page
		vm.forgotPass = forgotPass 
		
        initController();

        function initController() {
            // What you like to do upon page load? 
            // For example, get the user that's logged.
        }

        function login() {
            LoginService.Authenticate(vm.user)
            .then(function(token) {                
                FlashService.Success("Logged in");
                $window.jwtToken = token;
                
            })
            .catch(function(error) {
                FlashService.Error(error);
            });
        }
		function register() {
			location.href = "http://martianmotel.ddns.net/login/#/register";
		}
    }

})();