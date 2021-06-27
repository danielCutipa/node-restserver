const { request, response } = require('express')
const jwt = require('jsonwebtoken')

const User = require('../models/user')

const validateJWT = async (req = request, res = response, next) => {
  const token = req.header('x-token')
  if (!token) {
    return res.status(403).json({ msg: 'TOKEN IS required' })
  }

  try {
    const { uid } = jwt.verify(token, process.env.SECRET_KEY)

    // leer el usuario que corresponde al uid
    const user = await User.findById(uid)
    if (!user) {
      return res.status(401).json({
        msg: 'The user not exists'
      })
    }

    // verficar si el uid tiene estado true
    if (user.state == false) {
      return res.status(401).json({
        msg: 'Token is invalid - user with state false'
      })
    }

    req.user = user

    next()
  } catch (error) {
    console.log(error)
    res.status(401).json({
      msg: 'Token is invalid'
    })
  }
}

module.exports = { validateJWT }
