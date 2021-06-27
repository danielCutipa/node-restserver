const { request, response } = require('express')
const bcryptjs = require('bcryptjs')

const User = require('../models/user')

const usersGet = async (req = request, res = response) => {
  const { limit = 5, from = 0 } = req.query
  const query = { state: true }
  const [users, total] = await Promise.all([
    User.find(query).limit(Number(limit)).skip(Number(from)),
    User.countDocuments(query)
  ])

  res.json({ total, users })
}

const userPost = async (req = request, res = response) => {
  const { name, email, password, rol } = req.body
  const user = new User({ name, email, password, rol })

  // encrypt the password
  const salt = bcryptjs.genSaltSync()
  user.password = bcryptjs.hashSync(password, salt)

  await user.save()

  res.json(user)
}

const userPut = async (req = request, res = response) => {
  const { id } = req.params
  const { _id, password, google, email, ...args } = req.body

  if (password) {
    const salt = bcryptjs.genSaltSync()
    args.password = bcryptjs.hashSync(password, salt)
  }

  const user = await User.findByIdAndUpdate(id, args)

  res.json(user)
}

const userPatch = (req = request, res = response) => {
  const id = req.params.id

  res.json({
    ok: true,
    msg: 'PATCH API controller'
  })
}

const userDelete = async (req = request, res = response) => {
  const { id } = req.params

  // fisicamente lo borramos
  // const user = await User.findByIdAndDelete(id)

  const user = await User.findByIdAndUpdate(id, { state: false })

  res.json(user)
}

module.exports = {
  usersGet,
  userPost,
  userPut,
  userPatch,
  userDelete
}
