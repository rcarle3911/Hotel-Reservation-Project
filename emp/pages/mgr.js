$(document).ready(function () {
    $('.nav li').click(function (event) {
        event.preventDefault();

        //remove all pre-existing active classes
        //$('.active').removeClass('active');

        //add the active class to the link we clicked
        //$(this).addClass('active');

        //Load the content
        //e.g.
        //load the page that the link was pointing to
        $('#MgrContainer').load($(this).find('a').attr('href'));

    });
});