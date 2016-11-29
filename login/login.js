(function () {
    'use strict';

    angular
        .module('login', ['ui.router'])
        .config(config)
        .run(run);

    function config($stateProvider, $urlRouterProvider) {
        // default route
        $urlRouterProvider.otherwise("/");

        $stateProvider
            .state('login', {
                url: '/',
                templateUrl: 'home/index.html',
                controller: 'Login.IndexController',
                controllerAs: 'vm',
                data: { activeTab: 'login' }
            })
    }

    //Bootstrap angular
    function run($http, $rootScope, $window) {

        // update active tab on state change
        $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
            $rootScope.activeTab = toState.data.activeTab;
        });
    }

    $(function () {
        $.get('/', function () {
            angular.bootstrap(document, ['login']);
        });
    });
})();