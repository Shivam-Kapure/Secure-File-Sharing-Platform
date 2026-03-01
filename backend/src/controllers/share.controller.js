const {
  createShareLink,
  getFileByToken,
  revokeShareLink
} = require("../services/share.service")

// Create share link (authenticated)
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

    res.status(201).json({
      message: "Share link created successfully",
      share
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

    res.status(200).json({
      message: "Share link valid",
      file: {
        filename: share.filename,
        mime_type: share.mime_type,
        size: share.size
      },
      permission: share.permission
    })
  } catch (error) {
    next(error)
  }
}


// Revoke share link (authenticated)
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