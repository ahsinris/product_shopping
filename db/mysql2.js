import mysql from 'mysql2'
import dotenv from 'dotenv'
dotenv.config()

const dbconn = mysql.createPool({
  host: process.env.HOST,
  user: process.env.DBUSER,
  password: process.env.PASSWORD,
  database: process.env.DATABASE
}).promise()

export default dbconn
