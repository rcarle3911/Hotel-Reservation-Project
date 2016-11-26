otblHistory = $('#tblRes').DataTable({
    "paging": false,
    "pageLength": -1,
    "ordering": true,
    "info": false,
    "filter": true
});

$('#txtResSearch').keyup(function () {
    otblHistory.search($(this).val()).draw();
})