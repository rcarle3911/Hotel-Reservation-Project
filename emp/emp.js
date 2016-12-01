
//Controller Stuff
var app = angular.module('app', ['ui.bootstrap','ui.grid']);

app.controller('EmpCtrl', ['$timeout', function ($timeout) {

var view = this; 
view.tabShown = false; 

 view.data = [{
      "firstName": "Cox",
      "lastName": "Carney",
      "company": "Enormo has a rather long company name that might need to be displayed in a tooltip",
      "employed": true
    }, {
      "firstName": "Lorraine",
      "lastName": "Wise",
      "company": "Comveyer",
      "employed": false
    }, {
      "firstName": "Nancy",
      "lastName": "Waters",
      "company": "Fuelton",
      "employed": false
    }];

    view.gridOptions = {
      columnDefs: [{
        name: 'firstName',
        width: '20%'
      }, {
        name: 'lastName',
        width: '20%'
      }, {
        name: 'company',
        width: '50%',
        cellTooltip: function(row) {
          return row.entity.company;
        },
        cellTemplate: '<div class="ui-grid-cell-contents wrap" white-space: normal title="TOOLTIP">{{COL_FIELD CUSTOM_FILTERS}}</div>'
      }, {
        name: 'employed',
        width: '30%'
      }],
      data: view.data
    };
    
    view.tabSelect = function(){
      $timeout(function() {
        view.tabShown = true;
      });
    };

    
  }
]);