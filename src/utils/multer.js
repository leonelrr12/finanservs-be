const aws = require("aws-sdk");
const fs = require('fs')

const { AWS_Access_key_ID, AWS_Secret_access_key, AWS_BUCKET_NAME, AWS_REGION } = process.env

const s3 = new aws.S3({
  region: AWS_REGION,
  accessKeyId: AWS_Access_key_ID,
  secretAccessKey: AWS_Secret_access_key
})

const uploadFile = (file, entity_f, nameImage, id) => {
  const fileStream = fs.createReadStream(file.path)
  const uploadParams = {
    Bucket: AWS_BUCKET_NAME + "/" + entity_f + "/" + nameImage + "/" + id,
    Body: fileStream,
    Key: file.filename
  }
  debugger
  //console.log(uploadParams)
  return s3.upload(uploadParams).promise()
}

module.exports = { uploadFile, s3 }