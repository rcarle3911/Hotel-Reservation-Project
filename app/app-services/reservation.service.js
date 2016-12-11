(function () {
    'use strict';

    angular
        .module('app')
        .factory('ResService', Service);

    function Service($http, $q) {
        var service = {};

        service.Create = Create;
        service.Delete = Delete;
        service.Edit = Edit;
        service.Check = Check;
        service.GetAll = GetAll;

        return service;

        function Create(rsrv) {
            return $http.post('/api/public/reservation', rsrv).then(handleSuccess, handleError);
        }

        function Delete(_id) {
            return $http.delete('/api/protected/reservation/' + _id).then(handleSuccess, handleError);
        }

        function Edit(_id, rsrv) {
            return $http.put('/api/protected/reservation/' + _id, rsrv).then(handleSuccess, handleError);
        }

        function Check(rsrv) {
            return $http.get('/api/public/reservation/check', { params: rsrv }).then(handleSuccess, handleError);
        }

        function GetAll() {
            return $http.get('/api/protected/reservation').then(handleSuccess, handleError);
        }

        // private functions
        function handleSuccess(res) {
            var arr = [];
            for(var i = 0; i < res.data.length; i++){
                arr = arr.concat(JSON.stringify(res.data[i]));
            } 
            return arr;      
        }

        function handleError(res) {
            return $q.reject(res.data);
        }
    }

})();
