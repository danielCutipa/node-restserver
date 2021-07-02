const jwt = require('jsonwebtoken')

const { User } = require('../models')

const generateJWT = (uid = '') => {
  return new Promise((res, rej) => {
    const payload = { uid }

    jwt.sign(
      payload,
      process.env.SECRET_KEY,
      {
        expiresIn: '4H'
      },
      (err, token) => {
        if (err) {
          console.log(err)
          rej('No se pudo generate el token')
        } else {
          res(token)
        }
      }
    )
  })
}

const checkJWT = async (token = '') => {
  try {
    if (token.length < 10) {
      return null
    }

    const { uid } = jwt.verify(token, process.env.SECRET_KEY)

    const user = await User.findById(uid)

    if (user && user.state) {
      return user
    }
    return null
  } catch (error) {
    console.log(error)
    return null
  }
}
module.exports = { generateJWT, checkJWT }
