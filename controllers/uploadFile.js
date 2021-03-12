const fileRoutes = require('express').Router()
const path = require('path')
const multer = require('multer')

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
  return response.send('Prueba con el modulo de File Load!')
})

fileRoutes.post('/file', upload.single('file') ,(request, response) => {
  console.log(`Store location is ${request.hostname}/${request.file.path}`)
  return response.send(request.file)
})

module.exports = fileRoutes