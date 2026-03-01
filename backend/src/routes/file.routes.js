const express = require("express")
const { create, getAll, remove } = require("../controllers/file.controller")
const { authenticate } = require("../middlewares/auth.middleware")

const router = express.Router()

// All routes protected
router.post("/", authenticate, create)
router.get("/", authenticate, getAll)
router.delete("/:id", authenticate, remove)

module.exports = router