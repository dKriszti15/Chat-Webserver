import mysql from 'mysql2/promise.js';

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'webchat',
  connectionLimit: 100,
  queueLimit: 0,
});

export default pool;
