otblHistory = $('#tblHistory').DataTable({
    "paging": false,
    "pageLength": -1,
    "ordering": true,
    "info": false,
    "filter": true
});

$('#txtHisotySearch').keyup(function () {
    otblHistory.search($(this).val()).draw();
})