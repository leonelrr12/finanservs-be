require('dotenv').config()
const mysql = require('mysql2')

const PORT = process.env.PORT
const MONGODB_URI = process.env.MONGODB_URI


// MySql
const cnn = mysql.createConnection({
  host:'localhost',
  database:'finanservs',
  user:'rsanchez',
  password:'cafekotowa'
})

// Check connection
cnn.connect(error => {
  if (error) throw error;
  console.log('Database server runnuning!');
})


module.exports = {
  MONGODB_URI,
  PORT,
  cnn
}