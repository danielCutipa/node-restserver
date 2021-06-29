const path = require('path')
const fs = require('fs')
const { response } = require('express')
const cloudinary = require('cloudinary').v2
cloudinary.config(process.env.CLOUDINARY_URL)

const { uploadFile: uploadFileHelper } = require('../helpers')

const { User, Product } = require('../models')

const returnImageByDefault = (res) => {
  const pathImg = path.join(__dirname, '../assets', 'no-image.jpg')
  if (fs.existsSync(pathImg)) {
    return res.sendFile(pathImg)
  }
  res.json({ msg: 'No image by default' })
}

const uploadFile = async (req, res = response) => {
  try {
    const name = await uploadFileHelper(req.files, undefined, 'imgs')
    res.json({ name })
  } catch (msg) {
    res.status(400).json({ msg })
  }
}

const updateImage = async (req, res = response) => {
  const { id, collection } = req.params

  let model

  switch (collection) {
    case 'users':
      model = await User.findById(id)
      if (!model) {
        return res
          .status(400)
          .json({ msg: `No existe un usuario con el id ${id}` })
      }

      break
    case 'products':
      model = await Product.findById(id)
      if (!model) {
        return res
          .status(400)
          .json({ msg: `No existe un producto con el id ${id}` })
      }

      break
    default:
      return res.status(500).json({ msg: 'Se me olvido validar esto' })
  }

  // limpiar imagenes previas
  if (model.img) {
    // hay que borrar la imagen del servidor
    const pathImg = path.join(__dirname, '../uploads', collection, model.img)
    if (fs.existsSync(pathImg)) {
      fs.unlinkSync(pathImg)
    }
  }

  const fileName = await uploadFileHelper(req.files, undefined, collection)

  model.img = fileName
  await model.save()

  res.json(model)
}

const getImage = async (req, res = response) => {
  const { id, collection } = req.params

  let model

  switch (collection) {
    case 'users':
      model = await User.findById(id)
      if (!model) {
        returnImageByDefault(res)
        // return res
        //   .status(400)
        //   .json({ msg: `No existe un usuario con el id ${id}` })
      }

      break
    case 'products':
      model = await Product.findById(id)
      if (!model) {
        returnImageByDefault(res)
        // return res
        //   .status(400)
        //   .json({ msg: `No existe un producto con el id ${id}` })
      }

      break
    default:
      return res.status(500).json({ msg: 'Se me olvido validar esto' })
  }

  // limpiar imagenes previas
  if (model.img) {
    // hay que borrar la imagen del servidor
    const pathImg = path.join(__dirname, '../uploads', collection, model.img)
    if (fs.existsSync(pathImg)) {
      return res.sendFile(pathImg)
    }
  }

  returnImageByDefault(res)
}

const updateImageCloudinary = async (req, res = response) => {
  const { id, collection } = req.params

  let model

  switch (collection) {
    case 'users':
      model = await User.findById(id)
      if (!model) {
        return res
          .status(400)
          .json({ msg: `No existe un usuario con el id ${id}` })
      }

      break
    case 'products':
      model = await Product.findById(id)
      if (!model) {
        return res
          .status(400)
          .json({ msg: `No existe un producto con el id ${id}` })
      }

      break
    default:
      return res.status(500).json({ msg: 'Se me olvido validar esto' })
  }

  // limpiar imagenes previas
  if (model.img) {
    // hay que borrar la imagen del servidor
    const imgArr = model.img.split('/')
    const name = imgArr[imgArr.length - 1]
    const [public_id] = name.split('.')
    cloudinary.uploader.destroy(public_id)
  }

  const { tempFilePath } = req.files.file
  const { secure_url } = await cloudinary.uploader.upload(tempFilePath)

  model.img = secure_url
  await model.save()

  res.json(model)
}

module.exports = { uploadFile, updateImage, getImage, updateImageCloudinary }
