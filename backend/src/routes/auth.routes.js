const express = require("express")
const { register, login, logout } = require("../controllers/auth.controller")
const { authenticate } = require("../middlewares/auth.middleware")

const router = express.Router()

router.post("/register", register)
router.post("/login", login)
router.post("/logout", authenticate, logout)

// Protected test route — use this to verify auth works
router.get("/me", authenticate, (req, res) => {
    res.status(200).json({
        message: "Authenticated",
        userId: req.user.userId
    })
})

module.exports = router