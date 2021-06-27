const { request, response } = require('express')

const validateRole = (req = request, res = response, next) => {
  const { user } = req

  if (!user) {
    return res.status(500).json({ msg: 'Internal server error Ups' })
  }

  if (user.rol !== 'ADMIN_ROLE') {
    return res
      .status(401)
      .json({ msg: `${user.name} is not admin, cannot do that` })
  }

  next()
}

const hasRole = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.rol)) {
      return res.status(401).json({
        msg: `The service required one of these roles ${roles}`
      })
    }

    next()
  }
}

module.exports = { validateRole, hasRole }
