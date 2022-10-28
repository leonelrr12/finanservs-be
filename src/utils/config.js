require('dotenv').config()
const mongoose = require('mongoose')
const mysql = require('mysql2')

const PORT = process.env.PORT || 3001
const HOST = process.env.HOST

const AWS_BUCKET_NAME = process.env.AWS_BUCKET_NAME
const AWS_BUCKET_REGION = process.env.AWS_BUCKET_REGION
const AWS_Access_key_ID = process.env.AWS_Access_key_ID
const AWS_Secret_access_key = process.env.AWS_Secret_access_key

const MDB_HOST = process.env.MDB_HOST
const MDB_DATABASE = process.env.MDB_DATABASE
const MDB_USER = process.env.MDB_USER
const MDB_PWD = process.env.MDB_PWD
const MDB_PORT = process.env.MDB_PORT
const MDB_PROTOCOL = process.env.MDB_PROTOCOL


//SMTP gmail
const sendGEmail = {
  EMAIL_FROM: process.env.EMAIL_FROM,
  EMAIL_USER: process.env.EMAIL_USER,
  CLIENT_ID: process.env.CLIENT_ID,
  CLIENT_SECRET: process.env.CLIENT_SECRET,
  REDIRECT_URI: process.env.REDIRECT_URI,
  REFRESH_TOKEN: process.env.REFRESH_TOKEN
}


// MongoDB Digital Ocean-2
const MONGODB_URI = "mongodb+srv://doadmin:30x814oJ67N2gyYW@db-mongodb-nyc3-97071-024615bf.mongo.ondigitalocean.com/Finanservs?authSource=admin&replicaSet=db-mongodb-nyc3-97071&tls=true&tlsCAFile=ca-certificate-MDB.crt"


// MySql Digital Ocean-2
const cnn = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  database: process.env.DATABASE,
  password: process.env.DB_PWD,
  port: process.env.PORTDB,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

const APC = {
  user: process.env.APC_USER,
  pass: process.env.APC_PASS,
}

const ORIGEN = {
  nombre: process.env.NOMBRE,
  agente: process.env.AGENTE
}

const CLIENTIFY = {
  username: process.env.CF_USERNAME,
  password: process.env.CF_PASSWORD
}


const redirectRuta = (entity_f) => {
  return new Promise(resolve => {
    cnn.query("SELECT coalesce(redirect, id_ruta) as redirect FROM entities_f where id_ruta = ?", [entity_f], (error, results) => {
      if (error) {
        return resolve(entity_f)
      } 
      if(results.length) {
        resolve(results[0].redirect)
      } else {
        resolve(entity_f)
      }
    })
  })
}


module.exports = {
  APC,
  AWS_BUCKET_NAME,
  AWS_BUCKET_REGION,
  AWS_Access_key_ID,
  AWS_Secret_access_key,
  PORT,
  HOST,
  cnn,
  MONGODB_URI,
  sendGEmail,
  ORIGEN,
  CLIENTIFY,
  redirectRuta
}