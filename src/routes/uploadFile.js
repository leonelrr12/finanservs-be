const fileRoutes = require('express').Router()
const multer = require('multer')
const config = require('../utils/config')
const { uploadFile, uploadFile2 } = require("../utils/multer")
const PDF = require('html-pdf')
const fs = require('fs')
const path = require('path');

fileRoutes.get('/prueba', async (req, res) => {
  res.sendFile(path.join(__dirname+'/upload.html'))
})

const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: function(req, file, cb) {
    cb(null, file.originalname)
  }
})
const storage2 = multer.diskStorage({
  destination: 'pdfs/',
  filename: function(req, file, cb) {
    cb(null, file.originalname)
  }
})

const upload = multer({ storage: storage })
const upload2 = multer({ storage2: storage })

fileRoutes.post('/file', upload.single('idUrl'), async (req, res) => {
  const { entity_f, nameImage, prospect } = req.body
  console.log(entity_f, nameImage)
  const file = req.file
  const result = await uploadFile(file, entity_f, nameImage, prospect)
  console.log(result)
  try {
    fs.unlinkSync(file.path)
  } catch(err) {
    console.error('Something wrong happened removing the file', err)
  }
  res.send(result)
})

fileRoutes.post('/file2', upload2.single('idUrl'), async (req, res) => {
  const { fileName, entity_f, nameImage, prospect } = req.body
  console.log(fileName, entity_f, nameImage)
  const result = await uploadFile2(fileName, entity_f, nameImage, prospect)
  console.log(result)
  try {
    fs.unlinkSync(fileName)
  } catch(err) {
    console.error('Something wrong happened removing the file', err)
  }
  res.send(result)
})

fileRoutes.get('/list', async (request, response) => {
  const { bucket, entity_f } = request.body
  console.log(bucket, entity_f);

  AWS.config.update({region: 'us-east-1'})

  const s3 = new AWS.S3({apiVersion: '2021-09-22'})

  const params = {
    Bucket: bucket
  }


  s3.listObjects(params, (err, data) => {
    if(err) throw err

    const newD = []
    data.Contents.map(item=>{
      console.log(item.Key)
      const x = item.Key.split('/')
      console.log(x.lengt, x[0], entity_f)
      if(x.length > 1) {
        if(x[0] === entity_f && x[1].length > 0) {
          newD.push({ETag: item.ETag, file: x[1]})
        }
      }
    })
    console.log(newD)
    response.status(200).json(newD)
  })
})


fileRoutes.post('/createPDF', async (req, res) => {

  const content  = `
  <!doctype html>
  <html>
      <head>
          <meta charset="utf-8">
          <title>PDF Result Template</title>
          <style>
              h1 {
                  color: green;
              }
          </style>
      </head>
      <body>
          <div id="pageHeader" style="border-bottom: 1px solid #ddd; padding-bottom: 5px;">
              <p>Finanservs.com - Referencias de Crédito de APC</p>
          </div>
          <div id="pageFooter" style="border-top: 1px solid #ddd; padding-top: 5px;">
              <p style="color: #666; width: 70%; margin: 0; padding-bottom: 5px; text-align: let; font-family: sans-serif; font-size: .65em; float: left;"><a href="https://finanservs.com" target="_blank">https://finanservs.com</a></p>
              <p style="color: #666; margin: 0; padding-bottom: 5px; text-align: right; font-family: sans-serif; font-size: .65em">Página {{page}} de {{pages}}</p>
          </div>
          <h1>111 Pruebas de Refencias Bancarias con html-pdf</h1>
          <p>222 Lorem Ipsum es simplemente el texto de relleno de las imprentas y archivos de texto. Lorem Ipsum ha sido el texto de relleno estándar de las industrias desde el año 1500, cuando un impresor (N. del T. persona que se dedica a la imprenta) desconocido usó una galería de textos y los mezcló de tal manera que logró hacer un libro de textos especimen. No sólo sobrevivió 500 años, sino que tambien ingresó como texto de relleno en documentos electrónicos, quedando esencialmente igual al original. Fue popularizado en los 60s con la creación de las hojas "Letraset", las cuales contenian pasajes de Lorem Ipsum, y más recientemente con software de autoedición, como por ejemplo Aldus PageMaker, el cual incluye versiones de Lorem Ipsum.</p>
      </body>
  </html>`

  console.log(content)

  const options = { 
    format: 'Letter', 
    border: {
        "top": "0.3in",            // default is 0, units: mm, cm, in, px
        "right": "1in",
        "bottom": "0.31in",
        "left": "1in"
    },
  }

  let fileName = path.join(`./pdfs/tmp-pdf-${Date.now()}.pdf`)

  await PDF.create(content, options).toFile(fileName, (err, res2) => {
    if(err) {
      console.log(err)
    } else {
      // console.log(res.filename)
      res.send(res2)
    }
  })
})

module.exports = fileRoutes