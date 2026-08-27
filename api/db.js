import mysql from 'mysql2/promise';

const db = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'pedro2026@12',
  database: 'teacher_pedro',
});

export default db;