const { Role, User, Category, Product } = require('../models')

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

const existsCategoryById = async (id) => {
  // verfiy if email exists
  const existCategory = await Category.findById(id)
  if (!existCategory) {
    throw new Error(`The id ${id} not exists`)
  }
}

const existsProductById = async (id) => {
  // verfiy if email exists
  const existProduct = await Product.findById(id)
  if (!existProduct) {
    throw new Error(`The id ${id} not exists`)
  }
}

module.exports = {
  isRoleValid,
  existsEmail,
  existsUserById,
  existsCategoryById,
  existsProductById
}
