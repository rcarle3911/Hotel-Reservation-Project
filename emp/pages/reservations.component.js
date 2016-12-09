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
            firstName : 'Joe',
            lastName : 'Moe',
            roomTypeID : '1',
            startDate : '1/1/2017',
            endDate : '1/5/2017',
            numGuest : '2',
            price : '500'  
          },
          {
            firstName : 'Bob',
            lastName : 'Kabob',
            roomTypeID : '2',
            startDate : '1/2/2017',
            endDate : '1/7/2017',
            numGuest : '3',
            price : '520' 
          },
          {
            firstName : 'Sam',
            lastName : 'Iam',
            roomTypeID : '1',
            startDate : '1/2/2017',
            endDate : '1/5/2017',
            numGuest : '1',
            price : '300' 
          },
          {
            firstName : 'Roy',
            lastName : 'Boy',
            roomTypeID : '3',
            startDate : '12/20/2016',
            endDate : '1/3/2017',
            numGuest : '5',
            price : '1500' 
          },
          {
            firstName : 'Roy',
            lastName : 'Boy',
            roomTypeID : '3',
            startDate : '12/20/2016',
            endDate : '1/3/2017',
            numGuest : '5',
            price : '1500' 
          } ,
          {
            firstName : 'Roy',
            lastName : 'Boy',
            roomTypeID : '3',
            startDate : '12/20/2016',
            endDate : '1/3/2017',
            numGuest : '5',
            price : '1500' 
          } ,
          {
            firstName : 'Roy',
            lastName : 'Boy',
            roomTypeID : '3',
            startDate : '12/20/2016',
            endDate : '1/3/2017',
            numGuest : '5',
            price : '1500' 
          } ,
          {
            firstName : 'Roy',
            lastName : 'Boy',
            roomTypeID : '3',
            startDate : '12/20/2016',
            endDate : '1/3/2017',
            numGuest : '5',
            price : '1500' 
          } ,
          {
            firstName : 'Roy',
            lastName : 'Boy',
            roomTypeID : '3',
            startDate : '12/20/2016',
            endDate : '1/3/2017',
            numGuest : '5',
            price : '1500' 
          } ,
          {
            firstName : 'Roy',
            lastName : 'Boy',
            roomTypeID : '3',
            startDate : '12/20/2016',
            endDate : '1/3/2017',
            numGuest : '5',
            price : '1500' 
          } ,
          {
            firstName : 'Roy',
            lastName : 'Boy',
            roomTypeID : '3',
            startDate : '12/20/2016',
            endDate : '1/3/2017',
            numGuest : '5',
            price : '1500' 
          } ,
          {
            firstName : 'Roy',
            lastName : 'Boy',
            roomTypeID : '3',
            startDate : '12/20/2016',
            endDate : '1/3/2017',
            numGuest : '5',
            price : '1500' 
          } ,
          {
            firstName : 'Roy',
            lastName : 'Boy',
            roomTypeID : '3',
            startDate : '12/20/2016',
            endDate : '1/3/2017',
            numGuest : '5',
            price : '1500' 
          } ,
          {
            firstName : 'Roy',
            lastName : 'Boy',
            roomTypeID : '3',
            startDate : '12/20/2016',
            endDate : '1/3/2017',
            numGuest : '5',
            price : '1500' 
          } ,
          {
            firstName : 'Roy',
            lastName : 'Boy',
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
            "name":"Reservations",
            "columns":[
                {
                    "header":"First Name",
                    "property":"firstName",
                    "order":true,
                    "type":"text",
                    "edit":true
                },
                {
                    "header":"Last Name",
                    "property":"lastName",
                    "order":true,
                    "type":"text"
                },
                {
                    "header":"Check In Date",
                    "property":"startDate",
                    "order":true,
                    "type":"date",
                    "format":"date"
                },
                {
                    "header":"Check Out Date",
                    "property":"endDate",
                    "order":true,
                    "type":"date",
                    "format":"date"
                },
                {
                    "header":"",
                    "property":"",
                    "order":false,
                    "type":"text",
                    "render":"<button type=\"button\" class=\"btn btn-info btn-md\">Edit</button>"
                                      
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
                "active":true,
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
        //Set the data to the datatable
        this.datatable.setData(this.reservations);
      }],
    bindings: {
      action: '@',
      datatable: '&'
    }
     
  });
