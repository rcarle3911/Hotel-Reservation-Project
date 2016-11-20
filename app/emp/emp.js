$('#myTabs a').click(function (e) {
	e.preventDefault();
  
	var url = $(this).attr("data-url");
  	var href = this.hash;
  	var pane = $(this);
	
	// ajax load from data-url
	$(href).load(url,function(result){      
	    pane.tab('show');
	});
});

// load first tab content
<<<<<<< HEAD
$('#Tab1').load($('.active a').attr("data-url"),function(result){
=======
$('#reservations').load($('.active a').attr("data-url"),function(result){
>>>>>>> master
  $('.active a').tab('show');
});