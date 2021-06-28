const { request, response } = require('express')

const { Product } = require('../models')

const getProducts = async (req = request, res = response) => {
  const { limit = 5, from = 0 } = req.query
  const query = { state: true }

  const [products, total] = await Promise.all([
    Product.find(query)
      .populate('user', 'name')
      .populate('category', 'name')
      .limit(Number(limit))
      .skip(Number(from)),
    Product.countDocuments(query)
  ])

  res.json({ total, products })
}

const getProduct = async (req, res = response) => {
  const { id } = req.params

  const product = await Product.findById(id)
    .populate('user', 'name')
    .populate('category', 'name')

  res.json(product)
}

const createProduct = async (req = request, res = response) => {
  const { user, state, ...data } = req.body
  const name = data.name.toUpperCase()
  const productDB = await Product.findOne({ name })
  if (productDB) {
    return res.status(400).json({ msg: `El product ${name}, ya existe` })
  }
  data.name = name
  data.user = req.user._id

  const product = new Product(data)
  await product.save()
  res.json(product)
}

const updateProduct = async (req = request, res = response) => {
  const { id } = req.params
  const { state, user, ...data } = req.body
  if (data.name) {
    data.name = data.name.toUpperCase()
  }
  data.user = req.user._id
  const product = await Product.findByIdAndUpdate(id, data, { new: true })
  res.json(product)
}

const removeProduct = async (req = request, res = response) => {
  const { id } = req.params

  const product = await Product.findByIdAndUpdate(
    id,
    { state: false },
    { new: true }
  )

  res.json(product)
}

module.exports = {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  removeProduct
}
