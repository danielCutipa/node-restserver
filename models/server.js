const express = require('express')
const cors = require('cors')
const { dbConnection } = require('../database/config')
require('dotenv').config()

class Server {
  constructor() {
    this.app = express()
    this.port = process.env.PORT

    this.paths = {
      auth: '/api/auth',
      search: '/api/search',
      users: '/api/users',
      categories: '/api/categories',
      products: '/api/products'
    }

    // Connect to database
    this.connectDB()

    // Middlewares
    this.middlewares()

    // Routes of my app
    this.routes()
  }

  async connectDB() {
    await dbConnection()
  }

  middlewares() {
    // Cors
    this.app.use(cors())

    // Read and parser the body
    this.app.use(express.json())

    // Dir public
    this.app.use(express.static('public'))
  }

  routes() {
    this.app.use(this.paths.auth, require('../routes/auth'))
    this.app.use(this.paths.search, require('../routes/search'))
    this.app.use(this.paths.users, require('../routes/users'))
    this.app.use(this.paths.categories, require('../routes/categories'))
    this.app.use(this.paths.products, require('../routes/products'))
  }

  listen() {
    this.app.listen(this.port, () => {
      console.log(`Server is running at port ${this.port}`)
    })
  }
}

module.exports = Server
