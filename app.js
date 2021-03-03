const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const jwt = require('jsonwebtoken')
config = require('./configs/config')
const app = express()

app.set('key', config.key)

app.use(cors())

app.use(bodyParser.urlencoded({ extended: true }))

app.use(bodyParser.json())

app.get('/', (request, response) => {
  response.send('Hola Mundo!!!')
})

app.post('/api-token-auth', (req, res) => {
  if(req.body.username === "leonel" && req.body.password === "123456") {
const payload = {
 check:  true
};
const token = jwt.sign(payload, app.get('key'), {
 expiresIn: 1440
});
res.json({
 token: token
});
  } else {
      res.json({ mensaje: "Usuario o contraseña incorrectos"})
  }
})

// Register a route that requires a valid token to view data
app.get('/api', function(req, res){
  var token = req.query.token;
  jwt.verify(token, 'supersecret', function(err, decoded){
    if(!err){
      var secrets = {"accountNumber" : "938291239","pin" : "11289","account" : "Finance"};
      res.json(secrets);
    } else {
      res.send(err);
    }
  })
})

app.post('/api-token-verify', (req, res) => {

})

app.get('/api/laboral_sector_institution', (req, res) => {
  return res.json([
    { id: 1, name: 'Institucion 1' },
    { id: 2, name: 'Institucion 2' },
    { id: 3, name: 'Institucion 3' },
    { id: 4, name: 'Institucion 4' },
    { id: 5, name: 'Institucion 5' },
  ])
})

app.get('/api/laboral_sector', (req, res) => {
  return res.json([
    { 
      id: 5, 
      professions: [
        { id: 1, name: 'Profesion 1' },
        { id: 2, name: 'Profesion 2' }
      ],
      sector: 'Pb', 
      name: 'Médicos/Enfermeras',
      discount_capacity: 'capdescto',
      debt_capacity: 'deuda',
      debt_capacity_mortgage: 'hipot',
      is_active: true
    },
    { 
      id: 6, 
      professions: [
        { id: 3, name: 'Profesion 3' },
        { id: 4, name: 'Profesion 4' }
      ],
      sector: 'Pb', 
      name: 'Educadores',
      discount_capacity: 'capdescto',
      debt_capacity: 'deuda',
      debt_capacity_mortgage: 'hipot',
      is_active: true
    },
    { 
      id: 7, 
      professions: [
        { id: 3, name: 'Profesion 3' },
        { id: 4, name: 'Profesion 4' }
      ],
      sector: 'Pb', 
      name: 'Administrativos de Gobierno',
      discount_capacity: 'capdescto',
      debt_capacity: 'deuda',
      debt_capacity_mortgage: 'hipot',
      is_active: true
    },
    { 
      id: 8, 
      professions: [
        { id: 3, name: 'Profesion 3' },
        { id: 4, name: 'Profesion 4' }
      ],
      sector: 'Pb', 
      name: 'ACP',
      discount_capacity: 'capdescto',
      debt_capacity: 'deuda',
      debt_capacity_mortgage: 'hipot',
      is_active: true
    },
  ])
})


const PORT = 3001 
app.listen(PORT, () => {
  console.log('Application runing on port: ', PORT);
})
