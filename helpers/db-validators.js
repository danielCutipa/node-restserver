const Role = require('../models/role')
const User = require('../models/user')

const isRoleValid = async (rol = '') => {
  const existsRole = await Role.findOne({ rol })
  if (!existsRole) {
    throw new Error(`The role ${rol} is not resgitered in database`)
  }
}

const existsEmail = async (email = '') => {
  // verfiy if email exists
  const existEmail = await User.findOne({ email })
  if (existEmail) {
    throw new Error('That email is already registered')
  }
}

const existsUserById = async (id) => {
  // verfiy if email exists
  const existUser = await User.findById(id)
  if (!existUser) {
    throw new Error(`The id ${id} not exists`)
  }
}

module.exports = { isRoleValid, existsEmail, existsUserById }
