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


//SMTP G-Suit
const sendGEmail = {
  EMAIL_USER: process.env.EMAIL_USER,
  EMAIL_PASS: process.env.EMAIL_PASS,
  EMAIL_FROM: process.env.EMAIL_FROM,
  EMAIL_PORT: process.env.EMAIL_PORT,
  clientId: '975688741054-qsre2625tkgveh5jjebdic210b9c2l7g.apps.googleusercontent.com',
  clientSecret: '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',
  refreshToken: '1//0410GTs7ttAJZCgYIARAAGAQSNwF-L9Ir4KaK6nX5h6m_AzNe1F1eQ-jh9JXUvS8lhwIBerNnAFKHyDqayFNo0Dol-kfHfYi0BP0',
  redirectUri: 'https://developers.google.com/oauthplayground'
}

//SMTP gmail
const sendEmail = {
  EMAIL_USER: 'guasimo12@gmail.com',
  EMAIL_PASS: 'nicol1204',
  EMAIL_FROM: 'info@finanservs.com',
  EMAIL_PORT: process.env.EMAIL_PORT,
  clientId: '740240661485-taq1v8e9c41lvulvmhienu82eqd4orjs.apps.googleusercontent.com',
  clientSecret: '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',
  refreshToken: '1//04g3ySFiuG3ZaCgYIARAAGAQSNwF-L9IrdqyBZTmHZK1Nsjr6ZiAVCF-p5rqZ0qZrii3RG5zdxgiFcKo2b5hPfds-pFJU4FIxcHo',
  redirectUri: 'https://developers.google.com/oauthplayground'
}

// // MySql DIgital Ocean-2
// const cnn = mysql.createConnection({
//     host: process.env.DB_HOST,
//     database: process.env.DATABASE,
//     user: process.env.DB_USER,
//     password: process.env.DB_PWD,
//     port: process.env.PORTDB
// })

// // Check connection
// cnn.connect(error => {
//   // if (error) throw error;
//   console.log('Database server runnuning!');
// })


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
  pass: process.env.APC_PASS
}

const ORIGEN = {
  nombre: process.env.NOMBRE,
  agente: process.env.AGENTE
}

const CLIENTIFY = {
  username: process.env.CF_USERNAME,
  password: process.env.CF_PASSWORD
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
  sendEmail,
  sendGEmail,
  ORIGEN,
  CLIENTIFY
}