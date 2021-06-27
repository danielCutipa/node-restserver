const { request, response } = require('express')

const usersGet = (req = request, res = response) => {
  const query = req.query

  res.json({
    ok: true,
    msg: 'GET API controller',
    query
  })
}

const userPost = (req, res = response) => {
  const body = req.body

  res.json({
    ok: true,
    msg: 'POST API controller',
    body
  })
}

const userPut = (req, res = response) => {
  const id = req.params.id

  res.json({
    ok: true,
    msg: 'PUT API controller',
    id
  })
}

const userPatch = (req, res = response) => {
  const id = req.params.id

  res.json({
    ok: true,
    msg: 'PATCH API controller'
  })
}

const userDelete = (req, res = response) => {
  const id = req.params.id

  res.json({
    ok: true,
    msg: 'DELETE API controller'
  })
}

module.exports = {
  usersGet,
  userPost,
  userPut,
  userPatch,
  userDelete
}
