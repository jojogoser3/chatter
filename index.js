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
    //new configuration parameter
    extname: 'hbs'
}));

app.get('/', (req, res) => {
//Serves the body of the page aka "main.handlebars" to the container //aka "index.handlebars"
    res.sendFile(__dirname + '/views/login.html');
});

app.get('/chatrooms', (req, res) => {
    //Serves the body of the page aka "main.handlebars" to the container //aka "index.handlebars"
        res.render('login', {layout : 'index'});
    });

server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/views/main.html');
})

// app.get('/javascript', (req, res) => {
//     res.sendFile(__dirname + '/public/javascript.html');
// })

// app.get('/css', (req, res) => {
//     res.sendFile(__dirname + '/public/css.html');
// })

// app.get('/swift', (req, res) => {
//     res.sendFile(__dirname + '/public/swift.html');
// })

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