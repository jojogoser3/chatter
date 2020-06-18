$(document).ready(function () {

     
    let thisroom;
    let thisuser;

    const socket = io('/tech');

    // does a token check if page is loaded
    let currentToken = localStorage.getItem('token');
    socket.emit('tokenCheck', { currentToken });

    socket.on('token_result', (token_state) => {
        if (token_state) {

        } else {
            window.location.pathname = '/';
        }
    })

    socket.on('users', (allusers, usersonline) => {
        $('.online-users').prepend(usersonline);
        for (let i = 0; i < allusers.length; ++i) {
            $('.users').append('<div class="user"><div class="user-name"><div class="status online"></div><p>' + allusers[i] + '</p></div><div class="cur-room">Chilled piece</div></div>');
            //console.log(allusers[i]);
        }
    })

    socket.on('current_user', (this_user) => {
        // sets the current_users name
        
        $('.sub-title').html(this_user);

        //sets the current user
        thisuser = this_user.toString();
    })


    // Sets the current room
    $('.room').on('click', function () {
        var user = $('.sub-title').text();
        var room = $(this).find('.room-name').text();
        socket.emit('join', { room: room, user: user });

        // Sets the current room
        thisroom = room;

        if ($('.sidebar').is(":visible")) {
            $('.page-back').show();
            
        } else {
            $('.page-back').attr("href", "/chatrooms");
        }
    })

    // displays the chats from a specific room
    socket.on('display_chats', (all_chats) => {

        // removes the chats from a other selected room
        $('.chats').find('.message-block').remove();

        for (let i = 0; i < all_chats.length; ++i) {

            //getting current date
            let date = new Date(Date.parse(all_chats[i].date_time));
            var hour = date.getHours();
            var min = date.getMinutes();
            if (min < 10) {
                min = '0' + min;
            } else {

            }
            if (thisuser == all_chats[i]['user_name']) {
                var this_message = '<div class="message-block this-user"><div class="message-info"><div class="message-username">' + all_chats[i]['user_name'] + '</div><div class="message-said">said @ </div><div class="message-time">' + hour + ':' + min + '</div></div><div class="message">' + all_chats[i]['chat_text'] + '</div></div>';
            } else {
                var this_message = '<div class="message-block"><div class="message-info"><div class="message-username">' + all_chats[i]['user_name'] + '</div><div class="message-said">said @ </div><div class="message-time">' + hour + ':' + min + '</div></div><div class="message">' + all_chats[i]['chat_text'] + '</div></div>';
            }
            $('.chats').prepend(this_message);
        }
    })

    // Sends the message to the server
    $('.sendmessage').submit(() => {
        let msg = $('.msg').val();
        if (msg == '') {
            $('.msg').val('');
            $('.msg').attr("placeholder", "Input can't be blank");
            return false;
        } else {
            
            socket.emit('message', { msg: msg, room: thisroom, user: thisuser });
            
            $('.msg').val('');
            return false;
        }


    })

    // Here the message will be displayed with the result from the server
    socket.on('message', (data) => {
        var d = new Date();
        var hour = d.getHours();
        var min = d.getMinutes();
        if (data.user == thisuser) {
            $('.chats').prepend('<div class="message-block this-user"><div class="message-info"><div class="message-username">' + data.user + '</div><div class="message-said">said @</div><div class="message-time">' + hour + ':' + min + '</div></div><div class="message">' + data.msg + '</div></div>');
        } else {
            $('.chats').prepend('<div class="message-block"><div class="message-info"><div class="message-username">' + data.user + '</div><div class="message-said">said @</div><div class="message-time">' + hour + ':' + min + '</div></div><div class="message">' + data.msg + '</div></div>');
        }
    })

    // logout deletes the token and reloads the page to '/'
    $('.logout').click(function () {
        localStorage.removeItem('token');
        location.reload();
    })

    // fixes the return button for the chatrooms page
    if (current_page == "chatrooms") {
        $(window).resize(function () {
            if ($(window).width() < 750) {
                $('.page-back').show();
            } else {
                $('.page-back').hide();
            }
        })
        if ($(window).width() < 750) {
            $('.page-back').show();
        } else {
            $('.page-back').hide();
        }

    }

    // fixes the blue buttons and blue nav items if on a specific page
    if (current_page == "users") {
        $('.page-back').hide();
        $('.bttn-users').addClass('selected');
    } else if (current_page == "chatrooms") {
        $('.bttn-chatroom').addClass('selected');
    } else {
        console.log('page render error')
    }

    ////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////
    ////////////////////////animations//////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////

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