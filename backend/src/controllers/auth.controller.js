const { registerUser, loginUser } = require("../services/auth.service")

const register = async (req, res, next) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password required" })
    }

    const user = await registerUser(email, password)

    res.status(201).json(user)
  } catch (error) {
    next(error)
  }
}

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password required" })
    }

    const data = await loginUser(email, password)

    res.status(200).json(data)
  } catch (error) {
    next(error)
  }
}

module.exports = {
  register,
  login
}
