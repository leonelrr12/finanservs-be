const fileRoutes = require('express').Router()
const multer = require('multer')
const config = require('../utils/config')
const { uploadFile } = require("../utils/multer")
const fs = require('fs')


const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: function(req, file, cb) {
    cb(null, file.originalname)
  }
})

const upload = multer({ storage: storage })

fileRoutes.post('/file', upload.single('idUrl'), async (req, res) => {
  const { bucket, entity_f, nameImage } = req.body
  //console.log(req)
  console.log(entity_f, nameImage)
  const file = req.file
  //console.log(file)
  const result = await uploadFile(file, entity_f, nameImage)
  console.log(result)
  try {
    fs.unlinkSync(file.path)
    //console.log('File removed')
  } catch(err) {
    console.error('Something wrong happened removing the file', err)
  }
  const description = req.body.description
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


module.exports = fileRoutes