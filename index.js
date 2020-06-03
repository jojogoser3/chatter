const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const port = process.env.PORT || 3000;
const db = require('./queries');
const handlebars = require('express-handlebars');

db.getChats.then(res => console.log(res)).catch(err => console.log(err));

app.use(express.static(__dirname + '/public'));

//instead of app.set('view engine', 'handlebars'); 
app.set('view engine', 'hbs');

app.engine('hbs', handlebars({
    layoutsDir: __dirname + '/views/layouts',
    partialsDir: __dirname + '/views/partials',
    //new configuration parameter
    extname: 'hbs'
}));

app.get('/', (req, res) => {
    //Serves the body of the page aka "main.handlebars" to the container //aka "index.handlebars"
    res.sendFile(__dirname + '/views/login.html');
});

app.get('/chatrooms', (req, res) => {
    //Serves the body of the page aka "main.handlebars" to the container //aka "index.handlebars"
    res.render('chatrooms', { layout: 'index', title: 'Chatrooms', main: 'false', page: 'chatrooms' });
});

app.get('/chats', (req, res) => {
    //Serves the body of the page aka "main.handlebars" to the container //aka "index.handlebars"
    res.render('chats', { layout: 'index' , title: 'Chatname', main: 'false', page: 'chats' });
});

app.get('/users', (req, res) => {
    //Serves the body of the page aka "main.handlebars" to the container //aka "index.handlebars"
    res.render('users', { layout: 'index', title: 'Users', main: 'true', page: 'users' });
});


server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/views/main.html');
})

app.get('/rooms/javascript', (req, res) => {
    res.sendFile(__dirname + '/public/javascript.html');
})

app.get('/rooms/css', (req, res) => {
    res.sendFile(__dirname + '/public/css.html');
})

app.get('/chatrooms/swift', (req, res) => {
    //Serves the body of the page aka "main.handlebars" to the container //aka "index.handlebars"
    res.render('rooms/swift', { layout: 'index' , title: 'Chatname' });
});

// tech namespace
const tech = io.of('/tech');

tech.on('connection', (socket) => {
    socket.on('join', (data) => {
        socket.join(data.room);
        tech.in(data.room).emit('message', `New user joined ${data.room}`)
    })

    socket.on('message', (data) => {
        console.log(`message: ${data.msg}`);
        tech.in(data.room).emit('message', data.msg)
    })

    socket.on('disconnect', () => {
        console.log('user disconnected');

        tech.emit('message', 'user disconnected ')
    })
})