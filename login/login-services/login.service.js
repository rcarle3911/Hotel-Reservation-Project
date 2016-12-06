(function () {
    'use strict';

    angular
        .module('login')
        .factory('LoginService', Service);

    function Service($http, $q) {
        var service = {};

        service.Create = Create;
        service.Authenticate = Authenticate;

        return service;

        function Create(user) {
            return $http.post('/api/public/users/register', user).then(handleSuccess, handleError);
        }

        function Authenticate(credentials) {
            return $http.post('/api/public/users/authenticate/', credentials).then(handleSuccess, handleError);
        }

        // private functions
        function handleSuccess(res) {
            return res.data;
        }

        function handleError(res) {
            return $q.reject(res.data);
        }
    }

})();
