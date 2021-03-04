const app = require('./app')
const http = require('http')
const config = require('./configs/config')

const server = http.createServer(app)

const PORT = config.PORT
server.listen(PORT, () => {
  console.log(`Server conecting on port ${config.PORT}`)
})