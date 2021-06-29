const validarCampos = require('./validate-fields')
const validarJWT = require('./validate-jwt')
const validarRoles = require('./validate-role')
const validarArchivo = require('./validate-file')

module.exports = {
  ...validarCampos,
  ...validarJWT,
  ...validarRoles,
  ...validarArchivo
}
