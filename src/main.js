$(document).ready(function () {
    if ($(window).width() < 750) {
        // for the footer input en buttons (temp)
        $('.input-footer').hide();
        
    }
    
    var content_counter = 0;

    // if you click a room the layout changes to the chat mode
    $('.room').click(function () {
        // some 
        content_counter++;

        if(content_counter == 2){
            content_counter = 1;
        }
        
        $('.content-inner').show();
        $('.input-footer').show();
    
        if ($(window).width() > 750) {

        } else {
            $('.bttns-footer').hide();
            $('#sidebar').hide();
            $('.content-inner').show();
        }
    })

    
    // the sidebar returns if the width is lower than 750
    $(window).resize(function () {
        if ($(window).width() > 750) {
            $('#sidebar').show();
            $('.sidebar-rooms').show();

        } else {
            if(content_counter == 1){
               
                    $('#sidebar').hide();
                    $('.bttns-footer').hide();
                    $('.content-inner').show();

            }

            if ($('.inner-content').is(":visible")) {
                
                $('#sidebar').hide();
                
            } else {
                
            }
        }
    })


    // dropdown
    var nav = $('nav');

    $(window).resize(function () {
        if ($(window).width() > 750) {
            if (nav.is(":visible")) {
            } else {
                nav.show();
            }
        }
    });

    $('.dropdown').click(function (e) {
        nav.toggle()
        $(this).find('.fa-bars').toggle();
        $(this).find('.fa-times').toggle();
        $('.content, footer').click(function () {
            nav.hide();
        })

    })

    


});