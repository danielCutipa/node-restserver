const { request, response } = require('express')
const bcryptjs = require('bcryptjs')

const User = require('../models/user')
const { generateJWT } = require('../helpers/generateJWT')
const { googleVerify } = require('../helpers/google-verify')

const login = async (req = request, res = response) => {
  const { email, password } = req.body

  try {
    // verificar si el email existe
    const user = await User.findOne({ email })
    if (!user) {
      return res.status(400).json({
        msg: 'User / Password is wrong!'
      })
    }

    // si el usuario es activo
    if (user.state === false) {
      return res.status(400).json({ msg: 'User is disable' })
    }

    // verficar contraseña
    const validPassword = bcryptjs.compareSync(password, user.password)
    if (!validPassword) {
      return res.status(400).json({ msg: 'Password is wrong' })
    }

    // generate JWT
    const token = await generateJWT(user.id)

    res.json({ user, token })
  } catch (error) {
    console.log(error)
    res.status(500).json({ msg: 'Internal server error, Ups!' })
  }
}

const googleSignIn = async (req, res = response) => {
  const { id_token } = req.body

  try {
    const { email, name, img } = await googleVerify(id_token)

    let user = await User.findOne({ email })
    if (!user) {
      const data = {
        email,
        name,
        password: ':P',
        img,
        google: true
      }

      user = new User(data)
      await user.save()
    }

    // si el usuario en DB
    if (!user.state) {
      return res.status(401).json({
        msg: 'Hable con el administrador, usuario bloqueado'
      })
    }

    const token = await generateJWT(user.id)

    res.json({ user, token })
  } catch (error) {
    console.log(error)

    res.status(400).json({
      msg: 'Google token is invalid'
    })
  }
}

const renewToken = async (req, res = response) => {
  const { user } = req
  const token = await generateJWT(user.id)

  res.json({ user, token })
}

module.exports = { login, googleSignIn, renewToken }
