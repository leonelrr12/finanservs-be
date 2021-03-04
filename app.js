const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const appRoutes = require('./controllers/routes')
const app = express()

app.use(cors())
app.use(express.static('build'))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use('/api', appRoutes)

module.exports = app
