
//Controller Stuff
var app = angular.module('app', ['ultimateDataTableServices','ui.bootstrap','reservations' ]);

app.controller('EmpCtrl', ['$timeout', function ($timeout) {

var view = this; 
view.tabShown = false; 

view.tabs = [
    { title:'Reservations', content : 'create', icon: 'glyphicon glyphicon-calendar', usesres : 'visible'},
    { title:'Check In',  content : 'checkin', icon: 'glyphicon glyphicon-log-in', usesres : 'visible'},
    { title:'Check-Out', content : 'checkout', icon: 'glyphicon glyphicon-log-out', usesres : 'visible'}, 
    { title:'Management', contenturl:'/emp/mgrpages/manager.html', icon: 'glyphicon glyphicon-wrench', usesres : 'hidden'}
  ];
    
    view.tabSelect = function(){
      $timeout(function() {
        view.tabShown = true;
      });
    };

    
  }
]);
