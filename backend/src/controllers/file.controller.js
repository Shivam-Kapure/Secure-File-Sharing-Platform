const { createFile, getUserFiles, deleteFile } = require("../services/file.service")

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


module.exports = {
  create,
  getAll,
  remove
}