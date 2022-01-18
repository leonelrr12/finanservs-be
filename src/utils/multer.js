require('dotenv').config()
const aws = require("aws-sdk")
const fs = require('fs')
const config = require('./config')

const { AWS_Access_key_ID, AWS_Secret_access_key, AWS_BUCKET_NAME, AWS_BUCKET_REGION } = config

const s3 = new aws.S3({
  region: AWS_BUCKET_REGION,
  accessKeyId: AWS_Access_key_ID,
  secretAccessKey: AWS_Secret_access_key
})

const uploadFile = async (file, entity_f, nameImage, id) => {
  const fileStream = fs.createReadStream(file.path)
  console.log(file.filename)
  const ext = file.filename.split('.')[1]
  const uploadParams = {
    Bucket: AWS_BUCKET_NAME + "/" + entity_f + "/" + nameImage, 
    Body: fileStream,
    Key: id+'.'+ext
  }
  return await s3.upload(uploadParams).promise()
}

const uploadFile2 = async (file, entity_f, nameImage, id) => {
  const fileStream = fs.createReadStream(file)
  const uploadParams = {
    Bucket: AWS_BUCKET_NAME + "/" + entity_f + "/" + nameImage,
    Body: fileStream,
    Key: id
  }
  return await s3.upload(uploadParams).promise()
}

module.exports = { uploadFile, s3, uploadFile2 }