import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import path from 'path'
import session from 'express-session'
import mysql from 'mysql2/promise.js'
import def from './routers/default.js'
import fs from 'fs/promises'

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

app.listen(8080);