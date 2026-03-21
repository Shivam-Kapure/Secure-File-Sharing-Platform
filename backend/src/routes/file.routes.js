const express = require("express")
const {
  create,
  getAll,
  remove,
  getUploadURL,
  getDownloadURL
} = require("../controllers/file.controller")
const { authenticate } = require("../middlewares/auth.middleware")

const router = express.Router()

// All routes protected
router.post("/", authenticate, create)
router.get("/", authenticate, getAll)
router.delete("/:id", authenticate, remove)

// Upload URL
router.post("/upload-url", authenticate, getUploadURL)

// Download URL
router.get("/:id/download-url", authenticate, getDownloadURL)

module.exports = router