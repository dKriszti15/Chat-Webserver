import express from 'express'
import morgan from 'morgan'
import path from 'path'
import session from 'express-session'
import mysql from 'mysql2/promise.js'
import def from './routers/default.js'
import fs from 'fs/promises'
import userRouter from './routers/userSpec.js'
import { Server } from 'socket.io'

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
  
// script.sql futtatasa
const script = await fs.readFile('script.sql', 'utf8');
await connection.query(script);
  

app.set('view engine', 'ejs');

app.set('views', path.join(process.cwd(), 'frontend/views'));

app.use(
    session({
      secret: '142e6ecf42884f03',
      resave: false,
      saveUninitialized: true,
    }),
  );
  
app.use(express.urlencoded({ extended: true }));

app.use(express.static('frontend/public'));

app.use(express.json());

app.use(morgan('tiny'));

app.use('/', def); 

app.use('/', userRouter);

const server = app.listen(PORT, () => {
  console.log(`Server running on port: ${PORT} ...`);
});

const io = new Server(server);

let connectedSockets = new Set();

io.on('connection', onConnection)

function onConnection(socket) {
  connectedSockets.add(socket.id);

  console.log('Socket connected: ', socket.id);

  io.emit('clients-total', connectedSockets.size)

  socket.on('disconnect', () => {
    console.log('Socket disconnected: ', socket.id);
    connectedSockets.delete(socket.id);
    io.emit('clients-total', connectedSockets.size)
  })

  socket.on('message', (data) => {
    socket.broadcast.emit('chatMessage', data)
  })
}