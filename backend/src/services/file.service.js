const { pool } = require("../config/db")

// Create file metadata
const createFile = async (ownerId, fileData) => {
  const { filename, mime_type, size, storage_key } = fileData

  const result = await pool.query(
    `
    INSERT INTO files (owner_id, filename, mime_type, size, storage_key)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING id, filename, mime_type, size, created_at
    `,
    [ownerId, filename, mime_type, size, storage_key]
  )

  return result.rows[0]
}


// Get all files for a user
const getUserFiles = async (ownerId) => {
  const result = await pool.query(
    `
    SELECT id, filename, mime_type, size, created_at
    FROM files
    WHERE owner_id = $1
    ORDER BY created_at DESC
    `,
    [ownerId]
  )

  return result.rows
}


// Delete a file (ownership enforced)
const deleteFile = async (ownerId, fileId) => {
  const result = await pool.query(
    `
    DELETE FROM files
    WHERE id = $1 AND owner_id = $2
    RETURNING id
    `,
    [fileId, ownerId]
  )

  if (result.rows.length === 0) {
    throw { status: 404, message: "File not found or unauthorized" }
  }

  return { message: "File deleted successfully" }
}


module.exports = {
  createFile,
  getUserFiles,
  deleteFile
}