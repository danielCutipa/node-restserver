const { Schema, model } = require('mongoose')

const ProductSchema = Schema({
  name: { type: String, required: [true, 'The name is required!'] },
  state: {
    type: Boolean,
    default: true,
    required: true
  },
  price: {
    type: Number,
    default: 0
  },
  description: { type: String },
  available: { type: Boolean, default: true },
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  category: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
  img: { type: String }
})

ProductSchema.methods.toJSON = function () {
  const { __v, state, ...args } = this.toObject()

  return args
}

module.exports = model('Product', ProductSchema)
