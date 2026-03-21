const { PutObjectCommand, GetObjectCommand } = require("@aws-sdk/client-s3")
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner")
const { s3 } = require("../config/storage")

// Generate signed upload URL
const generateUploadURL = async (key, contentType) => {
  const command = new PutObjectCommand({
    Bucket: process.env.R2_BUCKET_NAME,
    Key: key,
    ContentType: contentType
  })

  const url = await getSignedUrl(s3, command, { expiresIn: 60 * 5 }) // 5 min

  return url
}


// Generate signed download URL
const generateDownloadURL = async (key) => {
  const command = new GetObjectCommand({
    Bucket: process.env.R2_BUCKET_NAME,
    Key: key
  })

  const url = await getSignedUrl(s3, command, { expiresIn: 60 * 5 }) // 5 min

  return url
}


module.exports = {
  generateUploadURL,
  generateDownloadURL
}