const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const loginRouter = require('express').Router()
const User = require('../models/User')

loginRouter.post('/', async (request, response) => {
  const body = request.body

  // const user = await User.findOne({ username: body.username })
  // const passwordCorrect = user === null
  //   ? false
  //   : await bcrypt.compare(body.password.toString(), user.passwordHash.toString())

  // if (!(user && passwordCorrect)) {
  //   return response.status(401).json({
  //     error: 'invalid username or password'
  //   })
  // }

  const user = new User ({
    username: 'finanservs',
    id: 999
  })

  const userForToken = {
    username: user.username,
    id: user.id
  }

  const token = jwt.sign(userForToken, process.env.SECRET)

  response
    .status(200)
    .send({ 
      token, 
      username: user.username, 
      name: user.name 
    })
})

loginRouter.post('/token-verify', async (request, response) => {

  const body = request.body

  // const authorization = request.get('authorization')
  const token = body.token
  const decodedToken = jwt.verify(token, process.env.SECRET)
  if(!token || !decodedToken) {
    response
      .status(401).json({ error: 'token missing or invalid' })
      .end()
  } else {
    response
      .status(200)
      // .send(authorization.substring(7))
      .send(token)   
  }

  // if(authorization && authorization.toLowerCase().startsWith('bearer ')) {
  // if(authorization && authorization.toLowerCase()) {
  //   response
  //     .status(200)
  //     // .send(authorization.substring(7))
  //     .send(authorization)
  // }
  // response
  //     .status(401)
  //     .end()

})

module.exports = loginRouter