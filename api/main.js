const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const helmet = require('helmet')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const db = require('./database.js')

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

app.use(express.json())

app.use('/', express.static('../web'))
app.use('/resources', express.static('../resources'))

app.get('/api', (req, res) => {
  res.send('LGL api. Hello there!')
})

app.post('/api/login', (req, res) => {
  const { username, password } = req.body.login

  const user = db.getCollection('users').findOne((user) => user.username === username)
  if (!user) {
    res.status(401).json({ error: 'Invalid login/password' })
  }

  bcrypt.compare(password, user.password).then((result) => {
    if (!result) {
      res.status(401).send(JSON.stringify({ error: 'Invalid login/password' }))
    } else {
      // TODO: generate and send JWT
      const token = jwt.sign({ username: user.username }, process.env.SECRET, { expiresIn: 60 * 60 * 6 /* 6 hours */ })
      res.json({
        token,
        username: user.username,
      })
    }
  })
})

app.use('/api/recipes', recipeRouter)
app.use('/api/ingredients', ingredientRouter)

app.listen(PORT, () => {
  console.log('Listening on port:', PORT)
})
