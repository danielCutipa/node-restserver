const { Socket } = require('socket.io')

const { checkJWT } = require('../helpers')
const { ChatMessages } = require('../models')

const chatMessages = new ChatMessages()

const socketController = async (socket = new Socket(), io) => {
  const user = await checkJWT(socket.handshake.headers['x-token'])
  if (!user) {
    return socket.disconnect()
  }

  // agregar el usuario conectado
  chatMessages.connectUser(user)
  io.emit('usuarios-activos', chatMessages.usersArr)
  socket.emit('recibir-mensajes', chatMessages.last10)

  // Conectarlo a una sala especial
  socket.join(user.id) // salas: global, socket.id, user.id

  // Limpiar cuando alguien se desconecta
  socket.on('disconnect', () => {
    chatMessages.disconnectUser(user.id)
    io.emit('usuarios-activos', chatMessages.usersArr)
  })

  socket.on('enviar-mensaje', ({ uid, mensaje }) => {
    if (uid) {
      // Mensaje privado
      socket.to(uid).emit('mensaje-privado', { de: user.name, mensaje })
    } else {
      // Mensaje publico
      chatMessages.sendMessage(user.id, user.name, mensaje)
      io.emit('recibir-mensajes', chatMessages.messages)
    }
  })
}

module.exports = { socketController }
// socket.on('recibir-mensajes', () => {
//   // TODO:
// })

// socket.on('usuarios-activos', () => {
//   // TODO:
// })

// socket.on('mensaje-privado', () => {
//   // TODO:
// })
