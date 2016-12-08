'use strict';

angular.
  module('app').
  component('reservations', {
    templateUrl: '/emp/pages/reservations.template.html',
    controller: ['datatable',
      function reservationsController(datatable) {
        this.query='';
        this.reservations = [ //replace with get from resource (restful database service)
          {
            userID : '1',
            roomTypeID : '1',
            startDate : '1/1/2017',
            endDate : '1/5/2017',
            numGuest : '2',
            price : '500'  
          },
          {
            userID : '2',
            roomTypeID : '2',
            startDate : '1/2/2017',
            endDate : '1/7/2017',
            numGuest : '3',
            price : '520' 
          },
          {
            userID : '3',
            roomTypeID : '1',
            startDate : '1/2/2017',
            endDate : '1/5/2017',
            numGuest : '1',
            price : '300' 
          },
          {
            userID : '4',
            roomTypeID : '3',
            startDate : '12/20/2016',
            endDate : '1/3/2017',
            numGuest : '5',
            price : '1500' 
          }          
        ];
        this.btnVisible = 'visible';  
        switch(this.action){
          case "create":
            this.btnIcon = "glyphicon glyphicon-plus";
            this.btnTxt = " New Reservation";
          break;
          
          case "checkin":
            this.btnIcon = "glyphicon glyphicon-plus";
            this.btnTxt = " Add Walk-in";
          break;

          case "checkout":
            this.btnVisible = 'hidden';
          break;
        }
        var datatableConfig = {
            "name":"simple_datatable",
            "columns":[
                {
                    "header":"test",
                    "property":"test",
                    "order":true,
                    "type":"text",
                    "edit":true
                },
                {
                    "header":"test2",
                    "property":"test2",
                    "order":true,
                    "type":"text"
                }
            ],
            "edit":{
                "active":true,
                "columnMode":true
            },
            "pagination":{
                "mode":'local'
            },
            "order":{
                "mode":'local'
            },
            "remove":{
                "active":true,
                "mode":'local'
            }
        };

        //Simple exemple of data
        var datatableData = [{"test":1, "test2":1000},{"test":1, "test2":1000},{"test":1, "test2":1000},
        {"test":1, "test2":1000},{"test":1, "test2":1000},{"test":1, "test2":1000},
        {"test":1, "test2":1000}];

        //Init the datatable with his configuration
        this.datatable = datatable(datatableConfig);
        //Set the data to the datatable
        this.datatable.setData(datatableData);
      }],
    bindings: {
      action: '@',
      datatable: '&'
    }
     
  });
