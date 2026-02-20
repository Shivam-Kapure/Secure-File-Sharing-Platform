const express = require("express")
const { register, login, logout, getMe } = require("../controllers/auth.controller")
const { authenticate } = require("../middlewares/auth.middleware")

const router = express.Router()

router.post("/register", register)
router.post("/login", login)
router.post("/logout", authenticate, logout)
router.get("/me", authenticate, getMe)

module.exports = router