const express = require('express');
const app = express();
const http = require('http');
const { Server } = require("socket.io");
const cors = require("cors");
app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "https://44d7-202-131-112-74.ngrok-free.app"
    },
});
let arr = new Array(9).fill('')
let currentPlayer = '√';
let count = 1
io.on('connection', (socket) => {
    //audio logic
    // socket.on('create_room', (roomId) => {
    //     console.log('room_id', roomId);
    //     if (!rooms[roomId]) {
    //         rooms[roomId] = []; // Array to store user IDs
    //     }
    //     rooms[roomId].push(socket.id);
    //     socket.broadcast.to(roomId).emit('user-joined', socket.id);

    //     console.log('A user created room:', roomId);
    // });

    // socket.on('join-room', (roomId) => {
    //     if (rooms[roomId]) {
    //         rooms[roomId].push(socket.id);
    //         socket.broadcast.to(roomId).emit('user-joined', socket.id);
    //         socket.emit('users-in-room', rooms[roomId]); // Array of user IDs
    //         console.log('A user joined room:', roomId);
    //     } else {
    //         socket.emit('room-not-found', roomId);
    //     }
    // });

    // socket.on('audio-stream', (stream) => {
    //     console.log(stream);
    //     io.emit('audio-stream', {
    //         stream
    //     })
    // })
    socket.on('userId', (id) => {
        socket.broadcast.emit('getUserId', {
            id
        })
    })
    socket.on('call_request', () => {
        socket.broadcast.emit('requested')
    })





    //Game logic
    socket.on('handleClick', (data) => {
        const nextPlayer = count % 2 ? '√' : 'X';
        currentPlayer = count % 2 ? 'X' : '√';
        arr[data] = nextPlayer;
        count = count + 1
        io.emit('received_On_click', {
            arr, currentPlayer, count
        })
    })
    socket.on('restart', () => {
        arr = new Array(9).fill('');
        currentPlayer = '√';
        count = 1;
        io.emit('update', {
            arr: new Array(9).fill(''),
            currentPlayer: '√',
            count: 1
        })
    })
    io.emit('initialData', { arr, currentPlayer, count })
    socket.on('disconnect', () => {
        arr = new Array(9).fill('');
        currentPlayer = '√';
        count = 1;
    })
})

server.listen(3001, () => {
    console.log("SERVER IS RUNNING");
});



