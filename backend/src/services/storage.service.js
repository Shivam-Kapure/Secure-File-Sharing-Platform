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
const generateDownloadURL = async (key, filename, expiresIn = 60 * 5) => {
  const params = {
    Bucket: process.env.R2_BUCKET_NAME,
    Key: key
  }

  // Force actual download if filename is provided
  if (filename) {
    params.ResponseContentDisposition = `attachment; filename="${filename}"`
  }

  const command = new GetObjectCommand(params)

  const url = await getSignedUrl(s3, command, { expiresIn }) // dynamically typed expiration

  return url
}


module.exports = {
  generateUploadURL,
  generateDownloadURL
}