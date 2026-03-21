const { createFile, getUserFiles, deleteFile } = require("../services/file.service")
const { generateUploadURL, generateDownloadURL } = require("../services/storage.service")
const { pool } = require("../config/db")
const crypto = require("crypto")

// Create file metadata
const create = async (req, res, next) => {
  try {
    const { filename, mime_type, size, storage_key } = req.body

    if (!filename || !storage_key) {
      return res.status(400).json({ error: "Filename and storage_key are required" })
    }

    const file = await createFile(req.user.userId, {
      filename,
      mime_type,
      size,
      storage_key
    })

    res.status(201).json({
      message: "File created successfully",
      file
    })
  } catch (error) {
    next(error)
  }
}


// Get all files for logged-in user
const getAll = async (req, res, next) => {
  try {
    const files = await getUserFiles(req.user.userId)

    res.status(200).json({
      message: "Files fetched successfully",
      files
    })
  } catch (error) {
    next(error)
  }
}


// Delete a file
const remove = async (req, res, next) => {
  try {
    const { id } = req.params

    if (!id) {
      return res.status(400).json({ error: "File ID required" })
    }

    const result = await deleteFile(req.user.userId, id)

    res.status(200).json(result)
  } catch (error) {
    next(error)
  }
}


// Get upload URL
const getUploadURL = async (req, res, next) => {
  try {
    const { filename, mime_type } = req.body

    if (!filename || !mime_type) {
      return res.status(400).json({ error: "filename and mime_type required" })
    }

    // Basic filename sanitization
    const safeFilename = filename.replace(/\s+/g, "-")

    // Create unique storage key
    const key = `${req.user.userId}/${crypto.randomUUID()}-${safeFilename}`

    const uploadURL = await generateUploadURL(key, mime_type)

    res.status(200).json({
      message: "Upload URL generated",
      uploadURL,
      key,
      expiresIn: 300 // seconds (5 min)
    })
  } catch (error) {
    next(error)
  }
}


// Get download URL
const getDownloadURL = async (req, res, next) => {
  try {
    const { id } = req.params

    // Get file (ownership enforced)
    const result = await pool.query(
      "SELECT * FROM files WHERE id = $1 AND owner_id = $2",
      [id, req.user.userId]
    )

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "File not found" })
    }

    const file = result.rows[0]

    const downloadURL = await generateDownloadURL(file.storage_key)

    res.status(200).json({
      message: "Download URL generated",
      downloadURL,
      expiresIn: 300 // seconds
    })
  } catch (error) {
    next(error)
  }
}


module.exports = {
  create,
  getAll,
  remove,
  getUploadURL,
  getDownloadURL
}