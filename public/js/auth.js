const myForm = document.querySelector('form')

const url = window.location.hostname.includes('localhost')
  ? 'http://localhost:8080/api/auth'
  : 'https://restserver-curso-node-daniel.herokuapp.com/api/auth'

myForm.addEventListener('submit', (e) => {
  e.preventDefault()

  const formData = {}

  for (let el of myForm.elements) {
    if (el.name.length > 0) {
      formData[el.name] = el.value
    }
  }

  fetch(url + '/login', {
    method: 'POST',
    body: JSON.stringify(formData),
    headers: { 'Content-Type': 'application/json' }
  })
    .then((res) => res.json())
    .then((data) => {
      // user15@user.com
      // 123455
      console.log({ data })
      const { msg, token } = data
      if (msg) {
        return console.error(msg)
      }

      localStorage.setItem('token', token)
      window.location = 'chat.html'
    })
    .catch((err) => console.error(err))
})

function onSignIn(googleUser) {
  // Useful data for your client-side scripts:
  // var profile = googleUser.getBasicProfile()
  // console.log('ID: ' + profile.getId()) // Don't send this directly to your server!
  // console.log('Full Name: ' + profile.getName())
  // console.log('Given Name: ' + profile.getGivenName())
  // console.log('Family Name: ' + profile.getFamilyName())
  // console.log('Image URL: ' + profile.getImageUrl())
  // console.log('Email: ' + profile.getEmail())

  // The ID token you need to pass to your backend:
  var id_token = googleUser.getAuthResponse().id_token
  console.log('ID Token: ' + id_token)

  const data = { id_token }

  fetch(url + '/google', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })
    .then((res) => res.json())
    .then((data) => {
      console.log('Nuestro SERVER', data)
      localStorage.setItem('token', data.token)
      window.location = 'chat.html'
    })
    .catch(console.log)
}

function signOut() {
  var auth2 = gapi.auth2.getAuthInstance()
  auth2.signOut().then(function () {
    console.log('User signed out.')
  })
}
