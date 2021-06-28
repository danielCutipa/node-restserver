const { request, response } = require('express')

const { Category } = require('../models')

// obtener todas la categorias - publico
const getCategories = async (req = request, res = response) => {
  const { limit = 5, from = 0 } = req.query
  const query = { state: true }

  const [categories, total] = await Promise.all([
    Category.find(query)
      .populate('user', 'name')
      .limit(Number(limit))
      .skip(Number(from)),
    Category.countDocuments(query)
  ])

  res.json({ total, categories })
}

// obtener una categoria por id - publico
const getCategory = async (req, res = response) => {
  const { id } = req.params

  const category = await Category.findById(id).populate('user', 'name')

  res.json(category)
}

// crear categoria - privado - cualquier persona con un token valido
const createCategory = async (req = request, res = response) => {
  const name = req.body.name.toUpperCase()

  const categoryDB = await Category.findOne({ name })
  if (categoryDB) {
    return res.status(400).json({
      msg: `La categoria ${categoryDB.name} ya existe`
    })
  }

  const data = {
    name,
    user: req.user._id
  }
  const category = new Category(data)
  await category.save()

  res.status(201).json(category)
}

//actualizar - privado - cualquiera con token valido
const updatedCategory = async (req = request, res = response) => {
  const { id } = req.params
  const { state, user, ...data } = req.body

  data.name = data.name.toUpperCase()
  data.user = req.user._id

  const category = await Category.findByIdAndUpdate(id, data, { new: true })
  res.json(category)
}

// borrar una categoria . admin
const removeCategory = async (req = request, res = response) => {
  const { id } = req.params

  const category = await Category.findByIdAndUpdate(
    id,
    { state: false },
    { new: true }
  )

  res.json(category)
}

module.exports = {
  getCategories,
  getCategory,
  createCategory,
  updatedCategory,
  removeCategory
}
