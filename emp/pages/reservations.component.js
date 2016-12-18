'use strict';

angular.
  module('emp').
  component('reservations', {
    templateUrl: '/emp/pages/reservations.template.html',
    controller: ['datatable', '$scope','$http', '$window','$modal','$rootScope',
      function reservationsController(datatable, $scope, $http, $window, $modal, $rootScope) {

        this.query='';
        var self = this;
        self.futureReservations = [];
        self.currentReservations = [];
        self.roomTypes = [];
        self.$rootScope = $rootScope;
        
        this.btnVisible = 'visible';  
        switch(this.action){
          case "create":
            this.btnIcon = "glyphicon glyphicon-plus";
            this.btnTxt = " New Reservation";
            this.actionBtn = "<button type=\"button\"  class=\"btn btn-info btn-md\">Edit</button>";
            this.current = false;
          break;
          
          case "checkin":
            this.btnIcon = "glyphicon glyphicon-plus";
            this.btnTxt = " Add Walk-in";
            this.actionBtn = "<button type=\"button\" class=\"btn btn-info btn-md\">Check-in</button>";            
            this.current = false;
          break;

          case "checkout":
            this.btnVisible = 'hidden';
            this.actionBtn = "<button type=\"button\"  class=\"btn btn-info btn-md\">Check-out</button>";            
            this.current = true;
            console.log("setting checkout");             
          break;
        }



        if ($window.jwtToken) $http.defaults.headers.common['Authorization'] = 'Bearer ' + $window.jwtToken;
        
        $scope.$on('resTableReload', function () {
            loadUserData(self, $http);
        });

        loadUserData(self, $http);

        var datatableConfig = {
            "name":"Reservations",
            "columns":[
                {
                    "header":"First Name",
                    "property":"firstname",
                    "order":true,
                    "type":"text",
                    "hide" : true,
                },
                {
                    "header":"Last Name",
                    "property":"lastname",
                    "order":true,
                    "type":"text",
                    "hide" : true,
                },                
                {
                    "header":"Check In Date",
                    "property":"startDateF",
                    "order":true,
                    "type":"text",
                    "format":"date",
                    "hide" : true,
                },
                {
                    "header":"Check Out Date",
                    "property":"endDateF",
                    "order":true,
                    "type":"text",
                    "format":"date",
                    "hide" : true,
                },                
                {
                    "header":"Number of Guests",
                    "property":"numGuests",
                    "order":true,
                    "type":"text",
                    "hide" : true,
                },
                {
                    "header":"Room Type",
                    "property":"roomTypeName",
                    "order":true,
                    "type":"text",
                    "hide" : true,
                },
                {
                    "header":"",
                    "property":"edit",
                    "order":false,
                    "type":"text",
                    "render":this.actionBtn,
                    "hide" : false,                                     
                },
            ],
            "pagination":{
            "mode":'local',
            "numberRecordsPerPage":10       
            },
            "order":{
                "mode":'local'
            },
            "remove":{ 
                "active":false,
                "mode":'local'
            },
            "hide":{
                "active":true,
                "byDefault":undefined,
                "showButton":false
            },            
            "filter":{
                "active":true,
                "higlight":true,
                "showbutiton":true
            },
            "select":{
                "active":false,
                "showbutiton":true
            },
            "mouseevents":{
                "active": true,
                "clickCallback": function(line, data){
                    switch(self.action){
                        case "create":                   
                            $scope.editRes(data._id);
                        break;
                        case "checkin":
                            $scope.ckin(data._id);
                        break;
                        case "checkout":
                            $scope.ckout(data._id);
                        break;
                    }
                }
            }
            
        };
        
        //Init the datatable with his configuration
        this.datatable = datatable(datatableConfig);
        
        $scope.editRes = function (_resId) {
                var _res = {};
                console.log(_resId);
                if(_resId !=  undefined){
                    $http.get('/api/protected/reservation/'+ _resId).then(function (resp) {                        
                        _res = resp.data;
                        var modalInstance = $modal.open({
                            controller: "ResModalInstanceCtrl",
                            templateUrl: '/emp/pages/reservationsModal.html',
                            resolve: {                                                                                 
                                roomTypes: function (){
                                    return self.roomTypes;
                                    },
                                res: function () {
                                    return _res;
                                },
                                datatable: function(){
                                    return self.datatable;
                                },
                                current: function(){
                                    return self.current;
                                },
                                $rootScope: function(){
                                    return self.$rootScope;
                                } 
                            }
                        });                        
                    });
                }
                else
                {
                    var modalInstance = $modal.open({
                        controller: "ResModalInstanceCtrl",
                        templateUrl: '/emp/pages/reservationsModal.html',
                        resolve: {                                                                                 
                            roomTypes: function (){
                                return self.roomTypes;
                                },
                            res: function () {
                                return _res;
                            },
                            datatable: function(){
                                return self.datatable;
                            },
                            current: function(){
                                return self.current;
                            },
                            $rootScope: function(){
                                return self.$rootScope;
                            }                                                                    
                                                                                     
                        }
                    });                       
                }                 
            }; 
        $scope.ckin = function (_resId) {
                var _res = {};
                console.log(_resId);
                if(_resId !=  undefined){
                    $http.get('/api/protected/reservation/'+ _resId).then(function (resp) {         
                        _res = resp.data;
                        var modalInstance = $modal.open({
                            controller: "ResModalInstanceCtrl",
                            templateUrl: '/emp/pages/checkinModal.html',
                            resolve: {                                                                             
                                roomTypes: function (){
                                    return self.roomTypes;
                                    },
                                res: function () {
                                    return _res;
                                },
                                datatable: function(){
                                    return self.datatable;
                                },
                                current: function(){
                                    return self.current;
                                },
                                $rootScope: function(){
                                    return self.$rootScope;
                                }                                                                  
                            }
                        });
                    });
                } 
            };

            
        $scope.ckout = function (_resId) {
                var _res = {};
                console.log(_resId);
                if(_resId !=  undefined){
                    $http.get('/api/protected/reservation/'+ _resId).then(function (resp) {         
                        _res = resp.data;
                        _res.roomTypeName = self.roomTypes.filter(function ( obj ) {
                            return obj._id === _res.roomType;
                        })[0].name;                        
                        console.log(_res);
                        var modalInstance = $modal.open({
                            controller: "ResModalInstanceCtrl",
                            templateUrl: '/emp/pages/checkoutModal.html',
                            resolve: {
                                roomTypes: function (){
                                    return self.roomTypes;
                                },                                                                   
                                res: function () {
                                    return _res;
                                },
                                datatable: function(){
                                    return self.datatable;
                                },
                                current: function(){
                                    return self.current;
                                },
                                $rootScope: function(){
                                    return self.$rootScope;
                                }                                  
                            }
                        });
                    });                                            
                }
        };
    }],
      
    bindings: {
      action: '@',
      datatable: '&'
    }
     
  });
  
  app.controller('ResModalInstanceCtrl', function ($scope, roomTypes, res, $modalInstance, $http, datatable, current, $rootScope) {
    var self = this;
    self.datatable = datatable;
    self.futureReservations = [];
    self.currentReservations = [];
    self.roomTypes = [];
    self.current = current;
    $scope.res = res;
    $scope.noDel = 'visible';
    if($scope.res._id == undefined)
        $scope.noDel = 'hidden';
    $scope.roomTypes = roomTypes;
    console.log ('Res_id = ' + $scope.res._id + ' noDel = ' + $scope.noDel);
    
    $scope.cancel = function () {
        console.log("Cancel clicked");
        $modalInstance.dismiss('cancel');
    };

    $scope.delete = function () {
        $http.delete('/api/protected/reservation/' + $scope.res._id, {_id: $scope.res._id})
        .then(
            function (response) {
                // success callback
                console.log("Delete Sucessful");
                alert("Delete Sucessful");                
                fireEvent($rootScope);
            },
            function (response) {
                // failure callback
               console.log("Failed to Delete");

            }
        ); 
        $modalInstance.close();
    };

    $scope.ok = function () {
            console.log($scope.res);
            if($scope.res._id !=  undefined){
                $http.put('/api/protected/reservation/' + $scope.res._id ,$scope.res)
                .then(
                    function (response) {
                        // success callback
                        console.log("Put Sucessful");
                        console.log(response);
                        alert("Reservation Updated");
                        fireEvent($rootScope);                  
                    },
                    function (response) {
                        // failure callback
                        console.log("Failed to Put");
                        console.log(response);
                    }
                );
            }
            else{
            $http.post('/api/public/reservation', $scope.res)
            .then(
                function (response) {
                    // success callback
                    console.log("Post Sucessful");
                        alert("Reservation Created");
                    console.log(response);
                    fireEvent($rootScope);               
                },
                function (response) {
                    // failure callback
                    console.log("Failed to Post");
                    console.log(response);
                }
            );
            }

        console.log("ok clicked");
        $modalInstance.close();
    };
    
    $scope.checkInOut = function (inout){
            console.log($scope.res);

            $http.put('/api/protected/reservation/' + $scope.res._id ,$scope.res)
            .then(
                function (response) {
                    // success callback
                    console.log("Put Sucessful");
                    console.log(response);
                    $http.patch('/api/protected/reservation/' + $scope.res._id ,{_id: $scope.res._id})
                    .then(
                        function (response) {
                            // success callback
                            console.log("Patch Sucessful");
                            console.log(response);
                            switch(inout){
                            case "checkin":
                                alert("Check-in Sucessful");
                                console.log("Check-in clicked");
                            break;
                            case "checkout":
                                alert("Check-Out Sucessful");
                                console.log("Check-out clicked");
                            break;
                            default:
                                console.log(inout);                                
                            break;
                            };
                        },
                        function (response) {
                            // failure callback
                            console.log("Failed to Patch");
                            console.log(response);
                        }
                    );
                    fireEvent($rootScope);               
                },
                function (response) {
                    // failure callback
                    console.log("Failed to Put");
                    console.log(response);
                }
            );
        $modalInstance.close();            
    };

});

    function formatDate(dt) {
        var dd = dt.getDate();
        var mm = dt.getMonth() + 1;
        var yyyy = dt.getFullYear();
        return mm + "/" + dd + "/" + yyyy;
}
  
  function createData($http){
        var testData = [{
            "userEmail" : "jward0@nature.com",
            "roomType" : "5850368baab11f4bb43476d2",
            "startDate" : "12/18/2016",
            "endDate" : "12/21/2016",
            "numGuests" : 10,
            "price" : "887.40"
            }, {
            "userEmail" : "jhoward1@yolasite.com",
            "roomType" : "5850368baab11f4bb43476d2",
            "startDate" : "12/18/2016",
            "endDate" : "12/22/2016",
            "numGuests" : 4,
            "price" : "556.83"
            }, {
            "userEmail" : "eknight2@mapy.cz",
            "roomType" : "5850368baab11f4bb43476d2",
            "startDate" : "12/18/2016",
            "endDate" : "12/21/2016",
            "numGuests" : 2,
            "price" : "231.43"
            }, {
            "userEmail" : "rcastillo3@i2i.jp",
            "roomType" : "5850368baab11f4bb43476d2",
            "startDate" : "12/18/2016",
            "endDate" : "12/22/2016",
            "numGuests" : 6,
            "price" : "726.18"
            }, {
            "userEmail" : "rgarza4@plala.or.jp",
            "roomType" : "5850368baab11f4bb43476d2",
            "startDate" : "12/18/2016",
            "endDate" : "12/22/2016",
            "numGuests" : 4,
            "price" : "345.95"
            }, {
            "userEmail" : "ahughes5@domainmarket.com",
            "roomType" : "5850368baab11f4bb43476d2",
            "startDate" : "12/19/2016",
            "endDate" : "12/21/2016",
            "numGuests" : 7,
            "price" : "448.57"
            }, {
            "userEmail" : "dgreen6@shareasale.com",
            "roomType" : "5850368baab11f4bb43476d2",
            "startDate" : "12/18/2016",
            "endDate" : "12/21/2016",
            "numGuests" : 8,
            "price" : "780.31"
            }, {
            "userEmail" : "ksanchez7@360.cn",
            "roomType" : "5850368baab11f4bb43476d2",
            "startDate" : "12/18/2016",
            "endDate" : "12/21/2016",
            "numGuests" : 10,
            "price" : "327.79"
            }, {
            "userEmail" : "sferguson8@so-net.ne.jp",
            "roomType" : "5850368baab11f4bb43476d2",
            "startDate" : "12/19/2016",
            "endDate" : "12/22/2016",
            "numGuests" : 10,
            "price" : "505.45"
            }, {
            "userEmail" : "tmoore9@indiegogo.com",
            "roomType" : "5850368baab11f4bb43476d2",
            "startDate" : "12/19/2016",
            "endDate" : "12/22/2016",
            "numGuests" : 7,
            "price" : "720.52"
            }];
            
        var userList = [{
            "email" : "tmoore9@indiegogo.com",
            "firstname" : "Alan",
            "lastname" : "Ray",
            "dob" : "6/24/1988",
            "phone" : "62-(212)234-6329",
            "address" : "0 Clyde Gallagher Avenue",
            "password" : "2eXfe99"
            }, {
            "email" : "sferguson8@so-net.ne.jp",
            "firstname" : "Paul",
            "lastname" : "Rose",
            "dob" : "8/7/1983",
            "phone" : "86-(492)795-4453",
            "address" : "0 Mendota Hill",
            "password" : "hm7Cbw"
            }, {
            "email" : "ksanchez7@360.cn",
            "firstname" : "Carolyn",
            "lastname" : "Johnston",
            "dob" : "4/4/1981",
            "phone" : "84-(878)422-2328",
            "address" : "84529 Melody Street",
            "password" : "zVBTpk7"
            }, {
            "email" : "dgreen6@shareasale.com",
            "firstname" : "Tammy",
            "lastname" : "Parker",
            "dob" : "12/6/1989",
            "phone" : "86-(257)889-7962",
            "address" : "526 Reinke Street",
            "password" : "tIAbfDuPPTo"
            }, {
            "email" : "ahughes5@domainmarket.com",
            "firstname" : "Andrea",
            "lastname" : "Spencer",
            "dob" : "5/24/1984",
            "phone" : "86-(633)482-0050",
            "address" : "1 Morning Circle",
            "password" : "DAvkqI"
            }, {
            "email" : "rgarza4@plala.or.jp",
            "firstname" : "Theresa",
            "lastname" : "Hawkins",
            "dob" : "11/6/1982",
            "phone" : "1-(781)886-8829",
            "address" : "1 Summit Point",
            "password" : "BrB4X0Uq"
            }, {
            "email" : "jward0@nature.com",
            "firstname" : "Carlos",
            "lastname" : "Collins",
            "dob" : "8/21/1989",
            "phone" : "54-(776)316-1337",
            "address" : "66593 Meadow Valley Center",
            "password" : "032taFFvvjx"
            }, {
            "email" : "jhoward1@yolasite.com",
            "firstname" : "Nicholas",
            "lastname" : "Adams",
            "dob" : "1/12/1989",
            "phone" : "380-(406)100-6959",
            "address" : "1611 Algoma Circle",
            "password" : "bNPS9Vp"
            }, {
            "email" : "eknight2@mapy.cz",
            "firstname" : "Amanda",
            "lastname" : "Simmons",
            "dob" : "8/10/1989",
            "phone" : "48-(878)636-4357",
            "address" : "6 Cordelia Pass",
            "password" : "oYyckX"
            }, {
            "email" : "rcastillo3@i2i.jp",
            "firstname" : "Phillip",
            "lastname" : "Fuller",
            "dob" : "7/9/1983",
            "phone" : "86-(459)264-5431",
            "address" : "7234 Pennsylvania Terrace",
            "password" : "uq9e8C9b3cIL"
            }];     

        
       //userList.forEach(function(usr){
                 //$http.post('/api/public/users/register', usr);
                //});                     
        
       testData.forEach(function(data){
                 $http.post('/api/public/reservation', testData);
                });  
                
                       
  };

function fireEvent($rootScope){
    console.log('fireEvent');
    //Broadcast or emit your event here.

    // firing an event upwards
    //$scope.$emit('yourEvent', 'data');

    // firing an event downwards
    $rootScope.$broadcast('resTableReload', {
    tab: 'value'
    });    
}  

function loadUserData(self, $http) {  
 
    //get the room types to populate modal dropdown
    $http.get('/api/protected/room/type').then(function (res) {
        self.roomTypes = res.data;
        if(!self.current){                   
            //Future Reservations for reservation and check in lists
            console.log("getting future"); 
            $http.get('/api/protected/reservation/future').then(function (res) {
                self.futureReservations = res.data;
        
                self.futureReservations.forEach(function(resv){
                    resv.roomTypeName = "";
                    resv.startDateF = formatDate(new Date(resv.startDate));
                    resv.endDateF = formatDate(new Date(resv.endDate));          
                    
                    resv.roomTypeName = self.roomTypes.filter(function ( obj ) {
                        return obj._id === resv.roomType;
                    })[0].name;

                });
                self.datatable.setData(self.futureReservations);            
                
            });
        }           
        else{                
            //Current Reservations for check out list  
            console.log("getting current"); 
            $http.get('/api/protected/reservation/current').then(function (res) {
                self.currentReservations = res.data;
                
                self.currentReservations.forEach(function(resv){
                    resv.roomTypeName = "";
                    resv.startDateF = formatDate(new Date(resv.startDate));
                    resv.endDateF = formatDate(new Date(resv.endDate));

                    console.log(resv.roomType);                    
                    resv.roomTypeName = self.roomTypes.filter(function ( obj ) {
                        return obj._id === resv.roomType;
                    })[0].name;
            
                });
                self.datatable.setData(self.currentReservations);            
                        
            });
        }
    });
};          
