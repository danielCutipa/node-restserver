const validarCampos = require('../middlewares/validate-fields')
const validarJWT = require('../middlewares/validate-jwt')
const validarRoles = require('../middlewares/validate-role')

module.exports = {
  ...validarCampos,
  ...validarJWT,
  ...validarRoles
}
