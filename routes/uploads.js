const { Router } = require('express')
const { check } = require('express-validator')

const { allowedCollections } = require('../helpers')
const { validateFields, validateFileUpload } = require('../middlewares')
const {
  uploadFile,
  updateImage,
  getImage,
  updateImageCloudinary
} = require('../controllers/uploads')

const router = Router()

router.post('/', validateFileUpload, uploadFile)

router.put(
  '/:collection/:id',
  [
    validateFileUpload,
    check('id', 'The id must be a mongo id').isMongoId(),
    check('collection').custom((c) =>
      allowedCollections(c, ['users', 'products'])
    ),
    validateFields
  ],
  updateImageCloudinary
  // updateImage
)

router.get(
  '/:collection/:id',
  [
    check('id', 'The id must be a mongo id').isMongoId(),
    check('collection').custom((c) =>
      allowedCollections(c, ['users', 'products'])
    ),
    validateFields
  ],
  getImage
)

module.exports = router
