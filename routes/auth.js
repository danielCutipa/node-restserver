const { Router } = require('express')
const { check } = require('express-validator')

const { login, googleSignIn, renewToken } = require('../controllers/auth')

const { validateFields, validateJWT } = require('../middlewares')

const router = Router()

router.post(
  '/login',
  [
    check('email', 'The email is required').isEmail(),
    check('password', 'Password is required').not().isEmpty(),
    validateFields
  ],
  login
)

router.post(
  '/google',
  [
    check('id_token', 'The id_token is required').not().isEmpty(),
    validateFields
  ],
  googleSignIn
)

router.get('/', validateJWT, renewToken)

module.exports = router
