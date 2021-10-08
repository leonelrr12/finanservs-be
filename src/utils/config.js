require('dotenv').config()
const mongoose = require('mongoose')
const mysql = require('mysql2')

const PORT = process.env.PORT || 3001
const HOST = process.env.HOST
const AWS_Access_key_ID = process.env.AWS_Access_key_ID
const AWS_Secret_access_key = process.env.AWS_Secret_access_key

const MDB_HOST = process.env.MDB_HOST
const MDB_DATABASE = process.env.MDB_DATABASE
const MDB_USER = process.env.MDB_USER
const MDB_PWD = process.env.MDB_PWD
const MDB_PORT = process.env.MDB_PORT
const MDB_PROTOCOL = process.env.MDB_PROTOCOL


// MySql DIgital Ocean-2
const cnn = mysql.createConnection({
    host: process.env.DB_HOST,
    database: process.env.DATABASE,
    user: process.env.DB_USER,
    password: process.env.DB_PWD,
    port: process.env.PORTDB
})

// MongoDB DIgital Ocean-2
// const MONGODB_URI = `mongodb+srv://${MDB_USER}:${MDB_PWD}@db-mongodb-nyc3-97071-024615bf.mongo.ondigitalocean.com/${MDB_DATABASE}?authSource=${MDB_DATABASE}?authSource=admin&replicaSet=db-mongodb-nyc3-97071&tls=true&tlsCAFile=ca-certificate-MDB.crt`
const MONGODB_URI = "mongodb+srv://doadmin:30x814oJ67N2gyYW@db-mongodb-nyc3-97071-024615bf.mongo.ondigitalocean.com/Finanservs?authSource=admin&replicaSet=db-mongodb-nyc3-97071&tls=true&tlsCAFile=ca-certificate-MDB.crt"

// cnnMDB = mongoose.connect(MONGODB_URI)

// const strCnnMDB = {
//   MONGODB_URI: `mongodb+srv://${MDB_USER}:${MDB_PWD}@db-mongodb-nyc3-97071-024615bf.mongo.ondigitalocean.com/${MDB_DATABASE}?authSource=${MDB_DATABASE}?&replicaSet=db-mongodb-nyc3-97071`
// }


// const cnnMDB = mongoose.connection
// cnnMDB.on('error', function(err){
//   console.log('connection error', err)
// })

// cnnMDB.once('open', function(){
//   console.log('Connection to DB successful')
// })
// const cnnMDB = mongoose.connection



// Check connection
cnn.connect(error => {
  // if (error) throw error;
  console.log('Database server runnuning!');
})


module.exports = {
  AWS_Access_key_ID,
  AWS_Secret_access_key,
  PORT,
  HOST,
  cnn,
  MONGODB_URI
}