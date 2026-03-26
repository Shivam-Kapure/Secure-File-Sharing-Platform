const {
  createShareLink,
  getFileByToken,
  revokeShareLink
} = require("../services/share.service")

const { generateDownloadURL } = require("../services/storage.service")

// Create share link
const create = async (req, res, next) => {
  try {
    const { id: fileId } = req.params
    const { permission, expires_at } = req.body

    if (!permission) {
      return res.status(400).json({ error: "Permission is required" })
    }

    if (!["view", "download", "edit"].includes(permission)) {
      return res.status(400).json({ error: "Invalid permission type" })
    }

    const share = await createShareLink(
      req.user.userId,
      fileId,
      permission,
      expires_at
    )

    let cloudflareLink = undefined;
    if (permission === 'download') {
      const { pool } = require("../config/db");
      const result = await pool.query("SELECT storage_key, filename FROM files WHERE id = $1", [fileId]);
      if (result.rows.length > 0) {
        let expiresInSeconds = 60 * 60 * 24 * 7; // up to 7 days
        if (expires_at) {
           const timeDiff = Math.floor((new Date(expires_at).getTime() - Date.now()) / 1000);
           expiresInSeconds = Math.max(1, Math.min(expiresInSeconds, timeDiff));
        }
        cloudflareLink = await generateDownloadURL(result.rows[0].storage_key, result.rows[0].filename, expiresInSeconds);
      }
    }

    res.status(201).json({
      message: "Share link created successfully",
      share,
      cloudflareLink
    })
  } catch (error) {
    next(error)
  }
}


// Public access via token
const accessByToken = async (req, res, next) => {
  try {
    const { token } = req.params

    const share = await getFileByToken(token)

    const isDownload = share.permission === "download"
    const downloadURL = await generateDownloadURL(
      share.storage_key,
      isDownload ? share.filename : undefined
    )

    res.status(200).json({
      message: "Share link valid",
      file: {
        filename: share.filename,
        mime_type: share.mime_type,
        size: share.size
      },
      permission: share.permission,
      downloadURL
    })

    // 🔥 OPTIONAL (better UX)
    // return res.redirect(downloadURL)

  } catch (error) {
    next(error)
  }
}


// Revoke share link
const revoke = async (req, res, next) => {
  try {
    const { id: shareId } = req.params

    const result = await revokeShareLink(req.user.userId, shareId)

    res.status(200).json(result)
  } catch (error) {
    next(error)
  }
}

module.exports = {
  create,
  accessByToken,
  revoke
}