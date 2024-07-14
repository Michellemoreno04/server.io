import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';


const app = express();

app.use(cors())
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173", // Cambia esto a la URL de tu frontend
        methods: ["GET", "POST"]
    }
});
io.on('connection', (socket) => {
    console.log('a user connected: ', socket.id);

     // Enviar el ID del socket al cliente
     socket.emit('me', socket.id);

    socket.on('disconnect', () => {
        console.log('user disconnected: ', socket.id);
    });

    socket.on('join-room', (room) => {
        socket.join(room);
        socket.broadcast.to(room).emit('user-connected', socket.id);
    });

    socket.on('signal', (data) => {
        io.to(data.to).emit('signal', {
            from: data.from,
            signal: data.signal
        });
    });
});

const port = process.env.PORT || 3000

server.listen(port, () => {
    console.log('listening on *:3000');
});
