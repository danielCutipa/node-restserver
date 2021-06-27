const express = require('express')
const cors = require('cors')
require('dotenv').config()

class Server {
  constructor() {
    this.app = express()
    this.port = process.env.PORT
    this.usersPath = '/api/users'

    // Middlewares
    this.middlewares()

    // Routes of my app
    this.routes()
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
    this.app.use(this.usersPath, require('../routes/user'))
  }

  listen() {
    this.app.listen(this.port, () => {
      console.log(`Server is running at port ${this.port}`)
    })
  }
}

module.exports = Server
