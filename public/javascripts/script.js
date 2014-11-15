$(document).ready(function() {
    $('#text').css({
        position:'absolute',
        left: ($(window).width() - $('#text').outerWidth())/2,
        top: ($(window).height() - $('#text').outerHeight())/2
    });
});