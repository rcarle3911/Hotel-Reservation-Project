'use strict';

angular.
  module('emp').
  component('reservations', {
    templateUrl: '/emp/pages/reservations.template.html',
    controller: ['datatable', '$scope','$http', '$window','$modal',
      function reservationsController(datatable, $scope, $http, $window, $modal) {
        this.query='';
        var self = this;
        self.futureReservations = [];
        self.currentReservations = [];
        self.roomTypes = [];
        
        if ($window.jwtToken) $http.defaults.headers.common['Authorization'] = 'Bearer ' + $window.jwtToken;
        
        //createData($http);
        
        //get the room types to populate modal dropdown
        $http.get('/api/protected/room/type').then(function (res) {
                self.roomTypes = res.data;
        });  
        
        if(!this.current)                   
            //Future Reservations for reservation and check in lists 
            $http.get('/api/protected/reservation/future').then(function (res) {
                self.futureReservations = res.data;
          
                self.futureReservations.forEach(function(resv){
                    resv.roomTypeName = "";
                    resv.startDateF = formatDate(new Date(resv.startDate));
                    resv.endDateF = formatDate(new Date(resv.endDate));            
                                        
                    $http.get('/api/protected/room/type/'+ resv.roomType).then(function (resp) {                        
                        resv.roomTypeName = resp.data.name;
                    });
                                        
                    $http.get('/api/protected/users/email/'+ resv.userEmail).then(function (resp) {
                        resv.firstName = resp.data.firstname;
                        resv.lastName = resp.data.lastname;
                    });                    
                });
                self.datatable.setData(self.futureReservations);            
                
            });           
        else                
            //Current Reservations for check out list  
            $http.get('/api/protected/reservation/current').then(function (res) {
                self.currentReservations = res.data;
                
                self.currentReservations.forEach(function(resv){
                    resv.roomTypeName = "";
                    resv.startDateF = formatDate(new Date(resv.startDate));
                    resv.endDateF = formatDate(new Date(resv.endDate));            
                                        
                    $http.get('/api/protected/room/type/'+ resv.roomType).then(function (resp) {                        
                        resv.roomTypeName = resp.data.name;
                    });
                                        
                    $http.get('/api/protected/users/email/' + resv.userEmail).then(function (resp) {
                        resv.firstName = resp.data.firstname;
                        resv.lastName = resp.data.lastname;                        
                    });                    
                });
                self.datatable.setData(self.currentReservations);            
                        
            });
                  
        this.btnVisible = 'visible';  
        switch(this.action){
          case "create":
            this.btnIcon = "glyphicon glyphicon-plus";
            this.btnTxt = " New Reservation";
            this.actionBtn = "<button type=\"button\" ng-click=\"open(res)\" class=\"btn btn-info btn-md\">Edit</button>";
            this.current = false;
          break;
          
          case "checkin":
            this.btnIcon = "glyphicon glyphicon-plus";
            this.btnTxt = " Add Walk-in";
            this.actionBtn = "<button type=\"button\" ng-click=\"ckin(res)\" class=\"btn btn-info btn-md\">Check-in</button>";            
            this.current = false;
          break;

          case "checkout":
            this.btnVisible = 'hidden';
            this.actionBtn = "<button type=\"button\" ng-click=\"ckout(res)\" class=\"btn btn-info btn-md\">Check-out</button>";            
            this.current = true;
          break;
        }
        var datatableConfig = {
            "name":"Reservations",
            "columns":[
                {
                    "header":"First Name",
                    "property":"firstName",
                    "order":true,
                    "type":"text",
                },
                {
                    "header":"Last Name",
                    "property":"lastName",
                    "order":true,
                    "type":"text",
                },                
                {
                    "header":"Check In Date",
                    "property":"startDateF",
                    "order":true,
                    "type":"text",
                    "format":"date"

                },
                {
                    "header":"Check Out Date",
                    "property":"endDateF",
                    "order":true,
                    "type":"text",
                    "format":"date"
                },                
                {
                    "header":"Number of Guests",
                    "property":"numGuests",
                    "order":true,
                    "type":"text",
                },
                {
                    "header":"Room Type",
                    "property":"roomTypeName",
                    "order":true,
                    "type":"text",
                },
                {
                    "header":"",
                    "property":"",
                    "order":false,
                    "type":"text",
                    "render":this.actionBtn
                                      
                }
            ],
            "pagination":{
            "mode":'local',
            "numberRecordsPerPageList":[{
                    number: 10,
                    clazz: ''
                }, {
                    number: 25,
                    clazz: ''
                }]
            },
            "order":{
                "mode":'local'
            },
            "remove":{ 
                "active":false,
                "mode":'local'
            },
             "filter":{
                "active":true,
                "higlight":true,
                "showbutiton":true
            },
            
        };
        
        //Init the datatable with his configuration
        this.datatable = datatable(datatableConfig);
   
        $scope.open = function (_res) {
                var modalInstance = $modal.open({
                    controller: "ResModalInstanceCtrl",
                    templateUrl: '/emp/pages/reservationsModal.html',
                    resolve: {                                              
                        roomTypes: function (){
                            console.log(self.roomTypes);
                            return self.roomTypes;
                            },
                        res: function () {
                            return _res;
                        }
                    }
                });
            }; 
        $scope.ckin = function (_res) {
                var modalInstance = $modal.open({
                    controller: "ResModalInstanceCtrl",
                    templateUrl: '/emp/pages/checkinModal.html',
                    resolve: {
                        res: function () {
                            return _res;
                        }
                    }
                });
            }; 
            
        $scope.ckout = function (_res) {
                var modalInstance = $modal.open({
                    controller: "ResModalInstanceCtrl",
                    templateUrl: '/emp/pages/checkoutModal.html',
                    resolve: {
                        res: function () {
                            return _res;
                        }
                    }
                });
            };                                            
            
      }],
    bindings: {
      action: '@',
      datatable: '&'
    }
     
  });
  
  app.controller('ResModalInstanceCtrl', function ($scope, roomTypes, res, $modalInstance, $http) {
    $scope.res = res;
    $scope.roomTypes = roomTypes;
    console.log($scope.res); 

    $scope.cancel = function () {
        console.log("Cancel clicked");
        $modalInstance.dismiss('cancel');
    };

    $scope.delete = function () {
        $http.delete('/api/protected/reservation/' + res._id, {_id: res._id})
        .then(
            function (response) {
                // success callback
                console.log("Delete Sucessful");
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
            $http.get('/api/protected/users/email/'+ $scope.res.userEmail).then(function (resp) {
                resp.data.firstName = $scope.res.firstName;
                resp.data.lastName = $scope.res.lastName;
                
                $http.put('/api/protected/users/' + resp.data._id, resp);
            },
            function (resp){
                //should we create a user? need pw, addr, etc.
                //$http.post('/public/users/register')
            });
            
            $http.post('/api/public/reservation', $scope.res)
            .then(
                function (response) {
                    // success callback
                    console.log("Post Sucessful");
                    console.log(respone);
                },
                function (response) {
                    // failure callback
                    console.log("Failed to Post");
                    console.log(respone);
                }
            );
        console.log("ok clicked");
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
