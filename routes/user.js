const { Router } = require('express')
const { check } = require('express-validator')

const { validateFields } = require('../middlewares/validate-fields')

const {
  usersGet,
  userPost,
  userPut,
  userPatch,
  userDelete
} = require('../controllers/user')
const {
  isRoleValid,
  existsEmail,
  existsUserById
} = require('../helpers/db-validators')

const router = Router()

router.get('/', usersGet)

router.post(
  '/',
  [
    check('name', 'The name is required').not().isEmpty(),
    check(
      'password',
      'The password is required and must have more than 6 letters'
    ).isLength({ min: 6 }),
    check('email', 'The email is invalid').isEmail(),
    check('email').custom(existsEmail),
    // check('rol', 'The rol is invalid').isIn(['ADMIN_ROLE', 'USER_ROLE']),
    check('rol').custom(isRoleValid),
    validateFields
  ],
  userPost
)

router.put(
  '/:id',
  [
    check('id', 'Id is not valid').isMongoId(),
    check('id').custom(existsUserById),
    check('rol').custom(isRoleValid),
    validateFields
  ],
  userPut
)

router.patch('/:id', userPatch)

router.delete(
  '/:id',
  [
    check('id', 'Id is not valid').isMongoId(),
    check('id').custom(existsUserById),
    validateFields
  ],
  userDelete
)

module.exports = router
