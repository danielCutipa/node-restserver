const jwt = require('jsonwebtoken')

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
module.exports = { generateJWT }
