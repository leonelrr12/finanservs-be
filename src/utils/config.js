require('dotenv').config()
const mysql = require('mysql2')

const PORT = process.env.PORT
const MONGODB_URI = process.env.MONGODB_URI

// MySql de James - IS
const cnn = mysql.createConnection({
    host: '69.10.63.218',
    database: 'finanservs',
    user: 'AdminFinanservs',
    password: '0t_pYv70'
})

// // MySql -->  Dockert
// const cnn = mysql.createConnection({
//   host:'localhost',
//   database:'finanservs',
//   user:'rsanchez',
//   password:'cafekotowa'
// })

// // MySql clever-cloud.com
// const cnn = mysql.createConnection({
//   host:'bjxexd6ulauq7ap6pqxv-mysql.services.clever-cloud.com',
//   database:'bjxexd6ulauq7ap6pqxv',
//   user:'usch2d6auluhu2pz',
//   password:'2mO43d7a0ih8POFWvyBL'
// })


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