const fileRoutes = require('express').Router()
const path = require('path')
const multer = require('multer')
const AWS = require('aws-sdk')
const fs = require('fs')
const config = require('../utils/config')

const s3 = new AWS.S3({
  accessKeyId: config.AWS_Access_key_ID,
  secretAccessKey: config.AWS_Secret_access_key
})


fileRoutes.get('/file', (request, response) => {
  response.sendFile(__dirname + "/upload.html")
})


// destination:(req, file, cb) => {
//   cb(null, './subidas')
// },
let storage = multer.diskStorage({
  destination: path.join(__dirname, '../../subidas'),
  filename:(req, file, cb) => {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
  }
})

const upload = multer({ 
  storage 
}).single('idUrl')

fileRoutes.post('/file', upload ,(request, response) => {
  console.log(`Store location is ${request.hostname}/${request.file.path}`)
  uploadS3(request.file, request.file.filename, request.file.path)
  return response.send(request.file)
})

const uploadS3 = (file, fileName, filePath) => {
  console.log(__dirname + '../../subidas/' + fileName);
  fs.readFile(__dirname + '../../subidas/' + fileName, (err, data) => {
    if(err) throw err
    const paramsPut = {
      Bucket: 'finanservs',
      Key: 'prospects/' + fileName,
      Body: data
    }
    s3.putObject(paramsPut, (err, data) => {
      if(err) throw err
      console.log(data)
    })
  })
}

module.exports = fileRoutes