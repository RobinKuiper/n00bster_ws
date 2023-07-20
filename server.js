const app = require('express')();
const http = require('http').Server(app);
require('dotenv').config()
const io = require('socket.io')(http, {
    cors: {
        origin: process.env.CORS || "http://localhost:3000",
        methods: ["GET", "POST"]
    }
});
const port = process.env.PORT || 8081;

// Stored tokens
const tokens = {};

// Stored users
const users = {};

// set up initialization and authorization method
io.use((socket, next) => {
    const auth = socket.request.headers.authorization;
    const user = socket.request.headers.user;
    if (auth && user) {
        const token = auth.replace('Bearer ', '');
        // do some security check with token TODO: validate jwt? if from react. validate server token if from server
        // ...
        // store token and bind with specific socket id
        if (!tokens[token] && !users[token]) {
            tokens[token] = socket.id;
            users[token] = user;
        }
        return next();
    } else {
        return next(new Error('no authorization header'));
    }
});

io.on('connection', function (socket) {
    console.log('SocketIO > Connected socket ' + socket.id);
    const room = socket.handshake.headers['x-room'];

    if (room) {
        socket.join(room);
        console.log('joined room ' + room)
    }

    socket.on('message', message => {
        if (message.room) {
            // socket.join(message.room);
            socket.broadcast.to(message.room).emit('message', message.body)
        }
    });

    socket.on('date_picked', message => {
        if (message.room) {
            socket.broadcast.to(message.room).emit('date_picked', message.object)
        }
    });

    socket.on('date_unpicked', message => {
        if (message.room) {
            socket.broadcast.to(message.room).emit('date_unpicked', message.object)
        }
    });

    socket.on('date_added', message => {
        if (message.room) {
            socket.broadcast.to(message.room).emit('date_added', message.date)
        }
    });

    socket.on('date_removed', message => {
        if (message.room) {
            socket.broadcast.to(message.room).emit('date_removed', message.date)
        }
    });

    socket.on('necessity_added', message => {
        if (message.room) {
            socket.broadcast.to(message.room).emit('necessity_added', message.necessity)
        }
    });

    socket.on('necessity_removed', message => {
        if (message.room) {
            socket.broadcast.to(message.room).emit('necessity_removed', message.necessity)
        }
    });

    socket.on('necessity_picked', message => {
        if (message.room) {
            socket.broadcast.to(message.room).emit('necessity_picked', message.necessity)
        }
    });

    socket.on('necessity_unpicked', message => {
        if (message.room) {
            socket.broadcast.to(message.room).emit('necessity_unpicked', message.necessity)
        }
    });

    socket.on('disconnect', () => {
        console.log('SocketIO > Disconnected socket ' + socket.id);
    });
});

http.listen(port, function () {
    console.log('listening on *:' + port);
});
