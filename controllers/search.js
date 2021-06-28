const { response } = require('express')
const { ObjectId } = require('mongoose').Types

const { User, Product, Category, Role } = require('../models')

const allowedCollections = ['products', 'categories', 'roles', 'users']

const searchUsers = async (term = '', res = response) => {
  const isMongoId = ObjectId.isValid(term)
  if (isMongoId) {
    const user = await User.findById(term)
    return res.json({ results: user ? [user] : [] })
  }

  const regex = new RegExp(term, 'i')

  const users = await User.find({
    $or: [{ name: regex }, { email: regex }],
    state: true
  })

  res.json({ results: users })
}

const searchProducts = async (term = '', res = response) => {
  const isMongoId = ObjectId.isValid(term)
  if (isMongoId) {
    const product = await Product.findById(term).populate('category', 'name')
    return res.json({ results: product ? [product] : [] })
  }

  const regex = new RegExp(term, 'i')

  const products = await Product.find({
    $or: [{ name: regex }, { description: regex }],
    state: true
  }).populate('category', 'name')

  res.json({ results: products })
}

const searchCategories = async (term = '', res = response) => {
  const isMongoId = ObjectId.isValid(term)
  if (isMongoId) {
    const category = await Category.findById(term)
    return res.json({ results: category ? [category] : [] })
  }

  const regex = new RegExp(term, 'i')

  const categories = await Category.find({ name: regex, state: true })

  res.json({ results: categories })
}

const searchRoles = async (term = '', res = response) => {
  const isMongoId = ObjectId.isValid(term)
  if (isMongoId) {
    const rol = await Role.findById(term)
    return res.json({ results: rol ? [rol] : [] })
  }

  const regex = new RegExp(term, 'i')

  const roles = await Role.find({ rol: regex, state: true })

  res.json({ results: roles })
}

const search = async (req, res = response) => {
  const { collection, term } = req.params
  if (!allowedCollections.includes(collection)) {
    return res
      .status(400)
      .json({ msg: `Las colecciones permitidas son: ${allowedCollections} ` })
  }

  switch (collection) {
    case 'users':
      searchUsers(term, res)
      break
    case 'products':
      searchProducts(term, res)
      break
    case 'categories':
      searchCategories(term, res)
      break
    case 'roles':
      searchRoles(term, res)
      break
    default:
      res.status(500).json({ msg: 'Se me olvido hacer esta busqueda' })
  }
}

module.exports = { search }
