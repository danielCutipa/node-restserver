const url = window.location.hostname.includes('localhost')
  ? 'http://localhost:8080/api/auth'
  : 'https://restserver-curso-node-daniel.herokuapp.com/api/auth'

let user = null
let socket = null

// Referencias HTML
const txtUid = document.querySelector('#txtUid')
const txtMensaje = document.querySelector('#txtMensaje')
const ulUsers = document.querySelector('#ulUsers')
const ulMensajes = document.querySelector('#ulMensajes')
const btnSalir = document.querySelector('#btnSalir')

const validarJWT = async () => {
  const token = localStorage.getItem('token') || ''
  console.log({ token })

  if (token.length <= 10) {
    window.location = 'index.html'
    throw new Error('No hay token en el servidor')
  }

  const res = await fetch(url, {
    headers: { 'x-token': token }
  })

  const { user: userDB, token: tokenDB } = await res.json()
  console.log({ tokenDB })
  localStorage.setItem('token', tokenDB)
  user = userDB
  console.log({ user })
  document.title = user.name

  await connectSocket()
}

const connectSocket = async () => {
  socket = io({
    extraHeaders: {
      'x-token': localStorage.getItem('token')
    }
  })

  socket.on('connect', () => {
    console.log('Sockets online')
  })

  socket.on('disconnect', () => {
    console.log('Sockets offline')
  })

  socket.on('recibir-mensajes', dibujarMensajes)

  socket.on('usuarios-activos', dibujarUsuarios)

  socket.on('mensaje-privado', (payload) => {
    // TODO:
    console.log(payload)
  })
}

const dibujarUsuarios = (users = []) => {
  let usersHtml = ''
  users.forEach(({ name, uid }) => {
    usersHtml += `
      <li>
        <p>
          <h5 class='text-success'>${name}</h5>
          <span class='fs-6 text-muted'>${uid}</span>
        </p>
      </li>
    `
  })

  ulUsers.innerHTML = usersHtml
}

const dibujarMensajes = (messages = []) => {
  let messagesHtml = ''
  messages.forEach(({ name, uid, message }) => {
    messagesHtml += `
      <li>
        <p>
          <span class='text-primary'>${name}</span>
          <span>${message}</span>
        </p>
      </li>
    `
  })

  ulMensajes.innerHTML = messagesHtml
}

txtMensaje.addEventListener('keyup', ({ keyCode }) => {
  if (keyCode !== 13) return

  const mensaje = txtMensaje.value
  const uid = txtUid.value
  if (mensaje.length === 0) return

  socket.emit('enviar-mensaje', { mensaje, uid })
  txtMensaje.value = ''
})

const main = async () => {
  await validarJWT()
}

main()
