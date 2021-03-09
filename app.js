const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const appRoutes = require('./controllers/routes')
const middleware = require('./utils/middlerware')
const usersRouter = require('./controllers/users')
const logger = require('./utils/logger')
const mongoose = require('mongoose')
const config = require('./utils/config')
const loginRouter = require('./controllers/login')
const app = express()

logger.info('connecting to', config.MONGODB_URI)

mongoose.connect(config.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true
})
  .then(() => {
    logger.info('Connected to MondoDB')
  })
  .catch(error => {
    logger.error('Error connecting to MongoDB: ', error.message)
  })

app.use(cors())
app.use(express.static('build'))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(middleware.requestLogger)

app.use('/api/login', loginRouter)
app.use('/api/users', usersRouter)
app.use('/api', appRoutes)

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app
