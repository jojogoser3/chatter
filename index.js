const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const port = process.env.PORT || 3000;
const db = require('./queries');
const bodyParser = require('body-parser');

app.use(bodyParser.json());

const handlebars = require('express-handlebars');

app.use(express.static(__dirname + '/public'));


app.set('view engine', 'hbs');
app.engine('hbs', handlebars({
    layoutsDir: __dirname + '/views/layouts',
    partialsDir: __dirname + '/views/partials',
    //new configuration parameter
    extname: 'hbs'
}));


// renders the login page (wich)
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/views/login.html');
});

app.get('/chatrooms', (req, res) => {
    //Serves the body of the page aka "main.handlebars" to the container //aka "index.handlebars"
    res.render('chatrooms', { layout: 'index', title: 'Chatrooms', main: false, page: 'chatrooms' });
});

app.get('/chats', (req, res) => {
    //Serves the body of the page aka "main.handlebars" to the container //aka "index.handlebars"
    res.render('chats', { layout: 'index', title: 'Chatname', main: false, page: 'chats' });
});

app.get('/users', (req, res) => {
    //Serves the body of the page aka "main.handlebars" to the container //aka "index.handlebars"
    return res.render('users', { layout: 'index', title: 'Users', main: true, page: 'users' });
});

server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})

// tech namespace
const tech = io.of('/tech');

tech.on('connection', (socket) => {

    socket.on('join', (data) => {

        socket.join(data.room);
        tech.in(data.room).emit('welcome_message');

        // GET messages
        db.getChats(data.room).then(val => {

            // displaying the retrieved data
            tech.to(socket.id).emit('display_chats', val);

        })
        // 
    })

    socket.on('tokenCheck', (token) => {
        console.log(token);

        // makes token from object to string
        let current_token = JSON.stringify(token.currentToken);
        let correct_token = current_token.replace(/^"(.+(?="$))"$/, '$1');

        // Check if the token is valid
        db.checkToken(token).then(val => {
            if (val) {
                console.log('token here');

                // gets all the info about the current user (with the correct_token otherwise it cant search in the db)
                db.getCurrentUser(correct_token).then(result => {

                    let result_str = result.map((item) => {
                        let user_data = JSON.stringify(item.user_name);
                        return user_data.replace(/^"(.+(?="$))"$/, '$1');
                    })

                    tech.to(socket.id).emit('current_user', result_str);
                })

                db.getUsers().then(val => {
                    console.log(val);
                    let online_users = val.length;
                    tech.to(socket.id).emit('users', val, online_users);
                    tech.to(socket.id).emit('token_result', val);
                })
            }
            else {
                // if token is not valid it will return the outcome to the client 
                console.log('token not here');
                tech.to(socket.id).emit('token_result', val);
            }
        })
    })

    socket.on('getChats', (data) => {
        db.getChats(data.room).then(val => {
            tech.to(socket.id).emit('display_chats', val);
        })
    })

    socket.on('users', (data) => {
        // db.getChats.then(res => console.log(res)).catch(err => console.log(err));
        db.checkUser(data.user).then(val => {
            if (val == true) {
                db.insertUser(data.user).then(val => {
                    tech.to(socket.id).emit('token', val);
                    console.log('username saved');
                });

            } else {
                tech.to(socket.id).emit('user-taken', 'show');
            }
        })
    })

    // removes the current user
    socket.on('deleteuser', (data) => {
        db.deleteUser(data).then(req => {
            if (req == true) {
                console.log(req);
                tech.to(socket.id).emit('userlogout', req);
            } else {
                console.log('userlogout failed')
            }

        })
    })

    socket.on('userisaway', (data) => {
        db.userAway(data).then(req => {
            tech.to(socket.id).emit('useraway', req);
        })
    })

    socket.on('userisonline', (data) => {
        db.userOnline(data).then(req => {
            tech.to(socket.id).emit('useronline', req);
        })
    })

    socket.on('userisoffline', (data) => {
        db.userOffline(data).then(req => {
            tech.to(socket.id).emit('useroffline', req);
        })
    })

    socket.on('message', (data) => {

    })


    socket.on('message', (data) => {

        let encode_message = data.msg.replace(/</g, "&lt;").replace(/>/g, "&gt;");

        let message = {
            user: data.user,
            room: data.room,
            msg: encode_message,
        }

        tech.in(data.room).emit('message', message);
        db.insertChats(message);
    })




})