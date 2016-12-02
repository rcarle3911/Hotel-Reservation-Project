'use strict';

angular.
  module('reservations').
  component('reservations', {
    templateUrl: '/emp/pages/reservations.template.html',
    controller: 
      function reservationsController() {
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
        this.query = "";
        this.action = "create";
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
            this.btnIcon = "glyphicon glyphicon-log-out";
            this.btnTxt = " Check-out"
          break;
        }
        
        
      }
    
  });
