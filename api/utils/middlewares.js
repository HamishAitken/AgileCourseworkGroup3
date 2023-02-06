const jwt = require('jsonwebtoken')

const withJWTRole = (role) => {
  return (req, res, next) => {
    const authorization = req.headers.authorization
    if (authorization && authorization.startsWith('Bearer ')) {
      const token = authorization.substring(7)
      try {
        const payload = jwt.verify(token, process.env.JWT_SECRET)
        if (payload.role && payload.role === role) {
          return next()
        } else {
          return res.status(403).json({ error: 'Not Authorized' })
        }
      } catch (e) {
        if (e instanceof jwt.JsonWebTokenError || e instanceof jwt.TokenExpiredError) {
          return res.status(401).json({ error: 'Invalid Token' })
        } else {
          throw e
        }
      }
    }
    return res.status(401).json({ error: 'Not Authenticated' })
  }
}

module.exports = { withJWTRole }
