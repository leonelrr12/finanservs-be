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

let storage = multer.diskStorage({
  destination:(req, file, cb) => {
    cb(null, './subidas')
  },
  filename:(req, file, cb) => {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
  }
})

const upload = multer({ storage })


fileRoutes.get('/file', (request, response) => {
  response.sendFile(__dirname + "/upload.html")
})


fileRoutes.post('/file', upload.single('idUrl') ,(request, response) => {
  console.log(`Store location is ${request.hostname}/${request.file.path}`)
  uploadS3(request.file, request.file.filename, request.file.path)
  return response.send(request.file)
})

const uploadS3 = (file, fileName, filePath) => {
  fs.readFile('subidas\\' + fileName, (err, data) => {
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