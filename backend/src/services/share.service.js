const { pool } = require("../config/db")
const crypto = require("crypto")

// Generate secure token
const generateToken = () => {
  return crypto.randomBytes(32).toString("hex")
}


// Create share link
const createShareLink = async (ownerId, fileId, permission, expiresAt) => {
  // Ensure file belongs to user
  const fileCheck = await pool.query(
    "SELECT id FROM files WHERE id = $1 AND owner_id = $2",
    [fileId, ownerId]
  )

  if (fileCheck.rows.length === 0) {
    throw { status: 404, message: "File not found or unauthorized" }
  }

  const token = generateToken()

  const result = await pool.query(
    `
    INSERT INTO file_shares (file_id, share_token, permission, expires_at)
    VALUES ($1, $2, $3, $4)
    RETURNING id, share_token, permission, expires_at, created_at
    `,
    [fileId, token, permission, expiresAt || null]
  )

  return result.rows[0]
}


// Get file by share token (public access)
const getFileByToken = async (token) => {
  const result = await pool.query(
    `
    SELECT fs.*, f.filename, f.mime_type, f.size
    FROM file_shares fs
    JOIN files f ON fs.file_id = f.id
    WHERE fs.share_token = $1
    `,
    [token]
  )

  if (result.rows.length === 0) {
    throw { status: 404, message: "Invalid share link" }
  }

  const share = result.rows[0]

  if (share.revoked) {
    throw { status: 403, message: "This share link has been revoked" }
  }

  if (share.expires_at && new Date(share.expires_at) < new Date()) {
    throw { status: 403, message: "This share link has expired" }
  }

  return share
}


// Revoke share link
const revokeShareLink = async (ownerId, shareId) => {
  const result = await pool.query(
    `
    UPDATE file_shares
    SET revoked = TRUE
    WHERE id = $1
    AND file_id IN (
        SELECT id FROM files WHERE owner_id = $2
    )
    RETURNING id
    `,
    [shareId, ownerId]
  )

  if (result.rows.length === 0) {
    throw { status: 404, message: "Share link not found or unauthorized" }
  }

  return { message: "Share link revoked successfully" }
}


module.exports = {
  createShareLink,
  getFileByToken,
  revokeShareLink
}