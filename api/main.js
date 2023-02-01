const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const helmet = require('helmet')
const adminRouter = require('./routes/admin.js')

const PORT = 3000
console.log('Starting the server...')

const app = express()

app.use(cors())
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        scriptSrc: ["'self'", "'unsafe-inline'", 'https:'],
        imgSrc: ["'self'", 'data:', 'https:'],
      },
    },
    crossOriginEmbedderPolicy: { policy: 'credentialless' },
  })
)
app.use(
  morgan(':remote-addr - :remote-user [:date[iso]] :method :url :status (:response-time ms) - :res[content-length]')
)
app.use(express.json())

app.get('/api', (req, res) => {
  res.send('LGL api. Hello there!')
})

app.use('/api/admin', adminRouter)

app.use(express.static('../web'))

app.listen(PORT, () => {
  console.log('Listening on port:', PORT)
})
