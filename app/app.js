(function () {
    'use strict';

    angular
        .module('app', ['ui.router'])
        .config(config)
        .run(run);

    function config($stateProvider, $urlRouterProvider) {
        // default route
        $urlRouterProvider.otherwise("/");

        $stateProvider
            .state('home', {
                url: '/',
                templateUrl: 'home/index.html',
                data: { activeTab: 'home' }
            })
            .state('account', {
                url: '/account',
                templateUrl: 'account/index.html',
                data: { activeTab: 'account' }
            })
            .state('contact', {
                url: '/contact',
                templateUrl: 'contact/index.html',
                data: { activeTab: 'contact' }
            })
            .state('about', {
                url: '/about',
                templateUrl: 'about/index.html',
                data: { activeTab: 'about' }
            })
            .state('services', {
                url: '/services',
                templateUrl: 'services/index.html',
                data: { activeTab: 'services' }
            })
            .state('reservations', {
                url: '/reservations',
                templateUrl: 'reservations/index.html',
                data: { activeTab: 'reservations' }
            })
            .state('gallery', {
                url: '/gallery',
                templateUrl: 'gallery/index.html',
                data: { activeTab: 'gallery' }
            });
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
            angular.bootstrap(document, ['app']);
        });
    });
})();