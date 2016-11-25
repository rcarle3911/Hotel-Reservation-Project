$('#modalTabs a').click(function (e) {
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
$('#ModalCheckIn').load($('.activeM a').attr("data-url"),function(result){
  $('.activeM a').tab('show');
});

$('#tblCheckin').DataTable( {
        "paging":         false,
				"pageLength": -1,
        "ordering": true,
        "info":     false
    } );