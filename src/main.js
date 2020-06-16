$(document).ready(function () {
    if ($(window).width() < 750) {
        // for the footer input en buttons (temp)
        $('.input-footer').hide();
    }

    var content_counter = 0;

    $('.room').click(function () {
        // some 
        content_counter++;
        
        if(content_counter == 2){
            content_counter = 1;
        }
        console.log(content_counter);
        $('.content-inner').show();
        $('.input-footer').show();

       
        if ($(window).width() > 750) {

        } else {

            // for the footer input en buttons (temp)
            
            $('.bttns-footer').hide();

            $('#sidebar').hide();
            $('.content-inner').show();
        }
    })

    $(window).resize(function () {
        if ($(window).width() > 750) {
            $('#sidebar').show();
            
            // for the footer input en buttons (temp)

            $('.sidebar-rooms').show();


        } else {
            if(content_counter == 1){
               
                    $('#sidebar').hide();
                    $('.bttns-footer').hide();
                    $('.content-inner').show();
                
                

            }
            // for the footer input en buttons (temp)
            
                
            //     $('.bttns-footer').show();
            // } else {
                
            //     $('#content-rooms').show();
            // }
            //$('.input-footer').hide();


            if ($('.inner-content').is(":visible")) {
                $('#sidebar').hide();
            } else {

            }
        }
    })


    // dropdown
    var i = 0;
    var nav = $('nav');

    $(window).resize(function () {
        if ($(window).width() > 750) {
            if (nav.is(":visible")) {
                console.log('still here fucker')
            } else {
                nav.show();
                console.log('lol');
            }
            if ($('.chat').is(":visible")) {
                alert(1);
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