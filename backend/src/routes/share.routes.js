const express = require("express")
const { authenticate } = require("../middlewares/auth.middleware")
const {
  create,
  accessByToken,
  revoke
} = require("../controllers/share.controller")

const router = express.Router()

router.post("/files/:id/share", authenticate, create)
router.get("/:token", accessByToken)
router.patch("/:id/revoke", authenticate, revoke)

module.exports = router