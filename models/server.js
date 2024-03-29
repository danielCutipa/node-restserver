const express = require('express')
const cors = require('cors')
const fileUpload = require('express-fileupload')
const { dbConnection } = require('../database/config')
const { socketController } = require('../sockets/controller')

class Server {
  constructor() {
    this.app = express()
    this.port = process.env.PORT
    this.server = require('http').createServer(this.app)
    this.io = require('socket.io')(this.server)

    this.paths = {
      auth: '/api/auth',
      search: '/api/search',
      users: '/api/users',
      categories: '/api/categories',
      products: '/api/products',
      uploads: '/api/uploads'
    }

    // Connect to database
    this.connectDB()

    // Middlewares
    this.middlewares()

    // Routes of my app
    this.routes()

    // Sockets
    this.sockets()
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

    // Fileupload
    this.app.use(
      fileUpload({
        useTempFiles: true,
        tempFileDir: '/tmp/',
        createParentPath: true
      })
    )
  }

  routes() {
    this.app.use(this.paths.auth, require('../routes/auth'))
    this.app.use(this.paths.search, require('../routes/search'))
    this.app.use(this.paths.users, require('../routes/users'))
    this.app.use(this.paths.categories, require('../routes/categories'))
    this.app.use(this.paths.products, require('../routes/products'))
    this.app.use(this.paths.uploads, require('../routes/uploads'))
  }

  sockets() {
    this.io.on('connect', (socket) => socketController(socket, this.io))
  }

  listen() {
    this.server.listen(this.port, () => {
      console.log(`Server is running at port ${this.port}`)
    })
  }
}

module.exports = Server
