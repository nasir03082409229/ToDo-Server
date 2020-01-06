const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose')
const ToDo = require('./models/todo')
const app = express();
var socket = require('socket.io');

mongoose.connect('mongodb://admin123:admin123@ds249079.mlab.com:49079/oauth', () => {
    console.log('MONGO CONNECT')
})
app.set(express.static('public'))
app.use(function (req, res, next) {
    var allowedOrigins = ['http://localhost:3000', 'http://localhost:3000?'];
    var origin = req.headers.origin;
    if (allowedOrigins.indexOf(origin) > -1) {
        res.setHeader('Access-Control-Allow-Origin', origin);
    }
    res.header('Access-Control-Allow-Methods', 'GET, OPTIONS, POST, PUT');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.header('Access-Control-Allow-Credentials', true);
    return next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.get('/', (req, res, err) => {
    res.send({ msg: 'OK bhai' })
})
app.get('/todos', (req, res, err) => {
    ToDo.find().then((data) => {
        res.send({ allToDos: data })
    })
})

app.use('/todo', require('./routes/todo'))
let server = app.listen(process.env.PORT || 4001, () => {
    console.log('Listen At 4001')
})
let io = socket(server);

io.on('connection', (socket) => {
     // ADD TODO
    socket.on('ADD_TODO', (data) => {
        ToDo.create(data).then((data) => {
            io.sockets.emit('GET_TODO_ADD', data);
        })
    });
    // DELET TODO 
    socket.on('DELETE_TODO', (id) => {
        ToDo.findByIdAndRemove({ _id: id }).then((todo) => {
            io.sockets.emit('GET_TODO_DELETE', todo._id);
        })
    });
    // Completed Todo
    socket.on('COMPLETED_TODO', (id) => {
        ToDo.findByIdAndUpdate({ _id: id }, { isDone: true }).then(() => {
            ToDo.findOne({ _id: id }).then((todo) => {
                io.sockets.emit('GET_TODO_COMPLETED', todo._id);
            })
        })
    });
    // Update Todo 
    socket.on('UPDATE_TODO', (data) => {
        ToDo.findByIdAndUpdate({ _id: data.id }, data.todo).then(() => {
            ToDo.findOne({ _id: data.id }).then((todo) => {
                io.sockets.emit('GET_TODO_UPDATE', todo);
            })
        })
    });
});