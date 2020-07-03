$(document).ready(function () {
    const socket = io('/tech');

    // does a token check if page is loaded
    var currentToken = localStorage.getItem('token');
    socket.emit('tokenCheck', { currentToken });

    // sends user data
    $('form').submit((e) => {
        e.preventDefault();
        let user = $('.username').val();

        // dubble check if the input is 5 characters long
        if (user == '' || user.length < 5) {
            $('.msg').attr("placeholder", "Input can't be blank");
            $('.form-fail-text').show();
            return false;
        }
        socket.emit('users', { user });
    })

    // set token if not already made
    socket.on('token', (currentToken) => {
        localStorage.setItem('token', currentToken);
        socket.emit('tokenCheck', { currentToken });
    })

    // if token is valid it will redirect to /users
    socket.on('token_result', (token_state) => {
        if (token_state) {
            window.location.pathname = '/users';
        } else {

        }
    })

    socket.on('user-taken', () => {
        $('.input-field').addClass('taken');
        $('.form-fail-text').show();
    })

    socket.on('message', (msg) => {

    })

});