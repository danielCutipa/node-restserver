const { Router } = require('express')
const { check } = require('express-validator')

const { validateFields, validateJWT } = require('../middlewares')
const {
  existsProductById,
  existsCategoryById
} = require('../helpers/db-validators')
const {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  removeProduct
} = require('../controllers/product')

const router = Router()

router.get('/', getProducts)

router.get(
  '/:id',
  [
    check('id', 'Id is not valid').isMongoId(),
    check('id').custom(existsProductById),
    validateFields
  ],
  getProduct
)

router.post(
  '/',
  [
    validateJWT,
    check('name', 'The name is required').not().isEmpty(),
    check('category', 'Id id not valid').isMongoId(),
    check('category').custom(existsCategoryById),
    validateFields
  ],
  createProduct
)

router.put(
  '/:id',
  [
    validateJWT,
    check('id', 'Id is not valid').isMongoId(),
    check('id').custom(existsProductById),
    validateFields
  ],
  updateProduct
)

router.delete(
  '/:id',
  [
    validateJWT,
    check('id', 'Id is not valid').isMongoId(),
    check('id').custom(existsProductById),
    validateFields
  ],
  removeProduct
)

module.exports = router
