$('#modalUserTabs a').click(function (e) {
	e.preventDefault();
  
	var url = $(this).attr("data-url");
  	var href = this.hash;
  	var pane = $(this);
	
	// ajax load from data-url
	$(href).load(url,function(result){      
	    pane.tab('show');
	});
});
oTable = $('#tblUsers').DataTable( {
        "paging": false,
		"pageLength": -1,
        "ordering": true,
        "info": false, 
		"filter": true,
        "scrollY": "600px",
        "scrollCollapse": true
    } );

// load first tab content
$('#ModalUser').load($('.activeN a').attr("data-url"),function(result){
  $('.activeN a').tab('show');
    oTable.search($(this).val()).draw() ;

});


$('#txtUserSearch').keyup(function(){
      oTable.search($(this).val()).draw() ;
});