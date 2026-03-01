const express = require("express")
const { authenticate } = require("../middlewares/auth.middleware")
const {
  create,
  accessByToken,
  revoke
} = require("../controllers/share.controller")

const router = express.Router()

// Create share link (owner only)
router.post("/files/:id/share", authenticate, create)

// Public access via token (no auth)
router.get("/:token", accessByToken)

// Revoke share link (owner only)
router.patch("/:id/revoke", authenticate, revoke)

module.exports = router