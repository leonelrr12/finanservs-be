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
// mongoose.connect(
//   `mongodb+srv://${MDB_USER}:${MDB_PWD}@db-mongodb-nyc3-97071-024615bf.mongo.ondigitalocean.com/${MDB_DATABASE}?authSource=${MDB_DATABASE}?&replicaSet=db-mongodb-nyc3-97071`
// ).then(db => console.log("MongoDB is Online!"))
// .catch(e => console.log("Error: ", e.message))

const strCnnMDB = {
  MONGODB_URI: `mongodb+srv://${MDB_USER}:${MDB_PWD}@db-mongodb-nyc3-97071-024615bf.mongo.ondigitalocean.com/${MDB_DATABASE}?authSource=${MDB_DATABASE}?&replicaSet=db-mongodb-nyc3-97071`
}

let cnnMDB = undefined
// try {
//     cnnMDB = mongoose.connect(strCnnMDB.MONGODB_URI, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true
//   })
//   console.log("Mongodb is connected to", MDB_HOST)
// }
// catch {e => console.log({"Error": e.message})}


// Check connection
cnn.connect(error => {
  if (error) throw error;
  console.log('Database server runnuning!');
})


module.exports = {
  AWS_Access_key_ID,
  AWS_Secret_access_key,
  PORT,
  HOST,
  cnn,
  cnnMDB
}