const { Router } = require('express')
const { check } = require('express-validator')

const { validateFields, validateJWT, isAdminRole } = require('../middlewares')

const {
  getCategories,
  getCategory,
  createCategory,
  updatedCategory,
  removeCategory
} = require('../controllers/category')
const { existsCategoryById } = require('../helpers/db-validators')

const router = Router()

router.get('/', getCategories)

router.get(
  '/:id',
  [
    check('id', 'Id is not valid').isMongoId(),
    check('id').custom(existsCategoryById),
    validateFields
  ],
  getCategory
)

router.post(
  '/',
  [
    validateJWT,
    check('name', 'The name is required').not().isEmpty(),
    validateFields
  ],
  createCategory
)

router.put(
  '/:id',
  [
    validateJWT,
    check('id', 'Id is not valid').isMongoId(),
    check('id').custom(existsCategoryById),
    check('name', 'The name is required').not().isEmpty(),
    validateFields
  ],
  updatedCategory
)

router.delete(
  '/:id',
  [
    validateJWT,
    isAdminRole,
    check('id', 'Id is not valid').isMongoId(),
    check('id').custom(existsCategoryById),
    validateFields
  ],
  removeCategory
)

module.exports = router
