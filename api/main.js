const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const helmet = require('helmet')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const db = require('./utils/database.js')

const recipeRouter = require('./routes/recipes.js')
const ingredientRouter = require('./routes/ingredients.js')

require('dotenv').config()
const PORT = 3001

console.log('Starting the server...')

const app = express()

app.use(cors())
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        scriptSrc: ["'self'", "'unsafe-inline'", 'https:'],
        scriptSrcAttr: ["'unsafe-inline'"],
        imgSrc: ["'self'", 'data:', 'https:'],
        upgradeInsecureRequests: null,
      },
    },
    crossOriginEmbedderPolicy: { policy: 'credentialless' },
  })
)

app.use(
  morgan(':remote-addr - :remote-user [:date[iso]] :method :url :status (:response-time ms) - :res[content-length]')
)

app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.use('/', express.static('../web'))
app.use('/resources', express.static('../resources'))

app.get('/api', (req, res) => {
  res.send('LGL api. Hello there!')
})

app.post('/api/login', (req, res) => {
  const { username, password } = req.body
  if (!username || username.length === 0 || !password || password.length === 0)
    return res.status(400).json({ error: 'Invalid request' })

  const user = db.getCollection('users').findOne((user) => user.username === username)
  if (!user) {
    return res.status(401).json({ error: 'Invalid login/password' })
  }

  bcrypt.compare(password, user.password).then((result) => {
    if (!result) {
      res.status(401).send(JSON.stringify({ error: 'Invalid login/password' }))
    } else {
      // TODO: generate and send JWT
      const token = jwt.sign(
        {
          username: user.username,
          role: 'admin',
        },
        process.env.JWT_SECRET,
        { expiresIn: 60 * 60 * 6 /* 6 hours */ }
      )
      res.json({
        token,
        username: user.username,
      })
    }
  })
})

// app.post('/api/verify', (req, res) => {
//   const token = jwt.verify(req.body.token, process.env.JWT_SECRET)
//   console.log(token)
//   res.status(200).send()
// })

app.use('/api/recipes', recipeRouter)
app.use('/api/ingredients', ingredientRouter)

app.listen(PORT, () => {
  console.log('Listening on port:', PORT)
})
