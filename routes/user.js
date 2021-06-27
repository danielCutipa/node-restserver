const { Router } = require('express')

const {
  usersGet,
  userPost,
  userPut,
  userPatch,
  userDelete
} = require('../controllers/user')

const router = Router()

router.get('/', usersGet)

router.post('/', userPost)

router.put('/:id', userPut)

router.patch('/:id', userPatch)

router.delete('/:id', userDelete)

module.exports = router
