import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import path from 'path'
import session from 'express-session'
import mysql from 'mysql2/promise.js'
import def from './routers/default.js'

const app = express();



app.set('view engine', 'ejs');

app.set('views', path.join(process.cwd(), 'frontend/views'));

app.use(express.json());

app.use(cors({origin: true}));

app.use(morgan('tiny'));

app.use('/*', def);

app.listen(8080);