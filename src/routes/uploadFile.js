const fileRoutes = require('express').Router()
const path = require('path')
const multer = require('multer')
const aws = require('aws-sdk')
const fs = require('fs')
const config = require('../utils/config')

const s3 = new aws.S3({
  // endpoint: "nyc3.digitaloceanspaces.com",
  accessKeyId: config.AWS_Access_key_ID,
  secretAccessKey: config.AWS_Secret_access_key
})

fileRoutes.get('/file', (request, response) => {
  response.sendFile(__dirname + "/upload.html")
})

let storage = multer.diskStorage({
  destination: path.join(__dirname, '../../uploads'),
  filename:(req, file, cb) => {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
  }
})

const upload = multer({ 
  storage 
}).single('idUrl')

fileRoutes.post('/file', upload ,(request, response) => {
  console.log(`Store location is ${request.hostname}/${request.file.path}`)
  uploadS3(request)
  return response.send(request.file)
})

const uploadS3 = (request) => {

  const fileName = request.file.filename
  const filePath = request.file.path
  const {entity_f, prospect, nameImage} = request.body
  const ext = fileName.split('.')[1]

  fs.readFile(filePath, (err, data) => {
    if(err) throw err
    const paramsPut = {
      Bucket: 'finanservs',
      Key: `prospects/${entity_f}/${prospect}/${nameImage}.${ext}`,
      Body: data
    }
    s3.putObject(paramsPut, (err, data) => {
      if(err) throw err
      console.log(data)
    })
  })

  fs.unlinkSync(filePath)
}


module.exports = fileRoutes