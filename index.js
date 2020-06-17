const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const port = process.env.PORT || 3000;
const db = require('./queries');
const bodyParser = require('body-parser');
const lol = require('swup');

app.use(bodyParser.json());

const handlebars = require('express-handlebars');

// db.getChats.then(res => console.log(res)).catch(err => console.log(err));

app.use(express.static(__dirname + '/public'));


//instead of app.set('view engine', 'handlebars'); 
app.set('view engine', 'hbs');
app.engine('hbs', handlebars({
    layoutsDir: __dirname + '/views/layouts',
    partialsDir: __dirname + '/views/partials',
    //new configuration parameter
    extname: 'hbs'
}));



// app.engine('handlebars', handlebars({
//     helpers: {
//         get_length: function (obj) { alert(1) }
//     }
// }))
// var user = new Array;

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
    // }

    // });

});

server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/views/main.html');
})

app.get('/chatrooms/css', (req, res) => {
    res.sendFile(__dirname + '/public/javascript.html');
})

app.get('/chatrooms/html', (req, res) => {
    res.sendFile(__dirname + '/public/css.html');
})

app.get('/chatrooms', (req, res) => {
    //Serves the body of the page aka "main.handlebars" to the container //aka "index.handlebars"
    return res.render('chatrooms', { layout: 'index', title: 'Users', main: false, page: 'users', room: 'javascript' });
    // }
})
    // });


// tech namespace
const tech = io.of('/tech');

tech.on('connection', (socket) => {

    socket.on('join', (data) => {
       
        socket.join(data.room);

            // GET messages
            db.getChats(data.room).then(val => {
            console.log(val);
            
            // displaying the retrieved data
            tech.to(socket.id).emit('display_chats', val);
        
        })
        tech.in(data.room).emit('');
        // tech.in(data.room).emit('message', `New user joined ${data.room}`);
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
                    // let stringified = JSON.stringify(result);
                    // let parsedObj = JSON.parse(stringified);

                    let result_str = result.map((item) => {
                        let user_data = JSON.stringify(item.user_name);
                        return user_data.replace(/^"(.+(?="$))"$/, '$1');
                    })
                    
                    tech.to(socket.id).emit('current_user', result_str);
                })

                db.getUsers().then(val => {
                    // all users to strings
                    let result_str = val.map((item) => {
                        let user_data = JSON.stringify(item.user_name);
                        return user_data.replace(/^"(.+(?="$))"$/, '$1');
                    })

                    //  users online now
                     let online_users = result_str.length;
                     tech.to(socket.id).emit('users', result_str, online_users);
                     console.log(val);
                     tech.to(socket.id).emit('token_result', val);
                    // if token is not valid it will return the outcome to the client 
                })}
                else {
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


        //    alldata.then(res => console.log(res)).catch(err => console.log(err));

        // let promise = new Promise(function(resolve, reject) {
        //         resolve(db.checkUser(data));
        // }).then(result => {
        //     console.log(result);
        // })



        // new Promise(function(resolve, reject) {
        //     console.log();
        //     resolve();
        // }).then(result => console.log(result));


        // tech.emit('message', 'user disconnected');
    })

    socket.on('message', (data) => {
        
        console.log(`message: ${data.user}`);
        
        // tech.in(data.room).emit('message', data.msg);
    })


    socket.on('message', (data) => {
        
        let message = {
            user: data.user,
            room: data.room,
            msg: data.msg,
        }
        
        tech.in(data.room).emit('message', message);
        console.log(message.user);
        db.insertChats(message);
    })

    socket.on('disconnect', () => {
        
        // tech.emit('message', 'user disconnected');
    })
})