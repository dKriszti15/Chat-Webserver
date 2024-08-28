import express from 'express';
import morgan from 'morgan';
import path from 'path';
import session from 'express-session';
import mysql from 'mysql2/promise.js';
import defRouterFactory from './routers/default.js';
import fs from 'fs/promises';
import userRouter from './routers/userSpec.js';
import { Server } from 'socket.io';

const PORT = process.env.PORT || 8000;

const app = express();

const connection = await mysql.createConnection({
  database: 'webchat',
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: 'root',
  multipleStatements: 'true',
});

const script = await fs.readFile('script.sql', 'utf8');
await connection.query(script);

app.set('view engine', 'ejs');
app.set('views', path.join(process.cwd(), 'frontend/views'));

app.use(
  session({
    secret: '142e6ecf42884f03',
    resave: false,
    saveUninitialized: true,
  })
);

app.use(express.urlencoded({ extended: true }));
app.use(express.static('frontend/public'));
app.use(express.json());
app.use(morgan('tiny'));

const server = app.listen(PORT, () => {
  console.log(`Server running on port: ${PORT} ...`);
});

const io = new Server(server);
let connectedSockets = {};

app.use('/', defRouterFactory(connectedSockets));
app.use('/', userRouter);

io.on('connection', (socket) => {
  socket.on('register', (username) => {
    connectedSockets[username] = socket.id;
    io.emit('clients-total', Object.keys(connectedSockets).length);
  });

  socket.on('disconnect', () => {
    for (let username in connectedSockets) {
      if (connectedSockets[username] === socket.id) {
        delete connectedSockets[username];
        break;
      }
    }
    io.emit('clients-total', Object.keys(connectedSockets).length);
  });

  socket.on('message', (data) => {
    socket.broadcast.emit('chatMessage', data);
  });

  socket.on('privateMessage', (data) => {
    const destSocket = connectedSockets[data.to];
    if (destSocket) {
      io.to(destSocket).emit('privateChatMessage', data);
    } else {
      console.log('User not connected');
    }
  });
});
