
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

app.controller('TabsDemoCtrl', function ($scope) {
  
});

app.controller('mgrCtrl', ['$timeout', function ($timeout) {

var view = this; 
view.tabShown = false; 

view.tabs = [
    { title:'User Accounts', contenturl:'/emp/mgrpages/mgrusers.html', icon: 'glyphicon glyphicon-user' },
    { title:'Room Management', contenturl:'/emp/mgrpages/mgrrooms.html', icon: 'glyphicon glyphicon-bed'},
    { title:'Occupancy Report', contenturl:'/emp/mgrpages/mgroccrpt.html', icon: 'glyphicon glyphicon-list-alt'}, 
    { title:'Housekeeping Report', contenturl:'/emp/mgrpages/mgrmaidrpt.html', icon: 'glyphicon glyphicon-file'}
  ];
    
  }
]);