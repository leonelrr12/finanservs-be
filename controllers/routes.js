const appRoutes = require('express').Router()

appRoutes.get('/', (request, response) => {
  response.send('Hola Mundo!!!')
})

appRoutes.get('/laboral_sector_institution', (req, res) => {
  return res.json([
    { id: 1, name: 'Institucion 1' },
    { id: 2, name: 'Institucion 2' },
    { id: 3, name: 'Institucion 3' },
    { id: 4, name: 'Institucion 4' },
    { id: 5, name: 'Institucion 5' },
  ])
})

appRoutes.get('/laboral_sector', (req, res) => {
  return res.json([
    { 
      id: 8, 
      professions: [
        { id: 3, name: 'Planilla 1' },
        { id: 4, name: 'Planilla 2' }
      ],
      sector: 'J', 
      name: 'Jubilado',
      discount_capacity: 'capdescto',
      debt_capacity: 'deuda',
      debt_capacity_mortgage: 'hipot',
      is_active: true
    },

    { 
      id: 2, 
      professions: [
        { id: 1, name: 'Priv Profesion 1' },
        { id: 2, name: 'Priv Profesion 2' }
      ],
      sector: 'P', 
      name: 'Médicos/Enfermeras',
      discount_capacity: 'capdescto',
      debt_capacity: 'deuda',
      debt_capacity_mortgage: 'hipot',
      is_active: true
    },
    { 
      id: 3, 
      professions: [],
      sector: 'P', 
      name: 'Educadores',
      discount_capacity: 'capdescto',
      debt_capacity: 'deuda',
      debt_capacity_mortgage: 'hipot',
      is_active: true
    },
    { 
      id: 4, 
      professions: [],
      sector: 'P', 
      name: 'Otros',
      discount_capacity: 'capdescto',
      debt_capacity: 'deuda',
      debt_capacity_mortgage: 'hipot',
      is_active: true
    },

    { 
      id: 5, 
      professions: [
        { id: 1, name: 'Pub Profesion 1' },
        { id: 2, name: 'Pub Profesion 2' }
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
      professions: [],
      sector: 'Pb', 
      name: 'Educadores',
      discount_capacity: 'capdescto',
      debt_capacity: 'deuda',
      debt_capacity_mortgage: 'hipot',
      is_active: true
    },
    { 
      id: 7, 
      professions: [],
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
        { id: 3, name: 'ACP Profesion 3' },
        { id: 4, name: 'ACP Profesion 4' }
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

appRoutes.get('/laboral_status', (req, res) => {
  return res.json([
    { name: 'Temporal', is_active: true },
    { name: 'Permanente', is_active: true },
    { name: 'Serv. Profesional', is_active: true }
  ])
})

appRoutes.get('/payment_types', (req, res) => {
  return res.json([
    { id: 1, name: '0 a 30 días', is_active: true },
    { id: 2, name: '31 a 60 días', is_active: true },
    { id: 3, name: '61 a 90 días', is_active: true },
    { id: 4, name: 'Arreglo de Pago', is_active: true },
    { id: 5, name: 'Demanda Judicial/ Cuenta Contra Reserva', is_active: true },
  ])
})

// OWNER = '1',
// PARENTS = '2',
// MORTGAGE = '3',
// RENT = '4'

appRoutes.get('/housing_types', (req, res) => {
  return res.json([
    { id: 1, name: 'Casa Propia', is_active: true },
    { id: 2, name: 'Padres o Familiares', is_active: true },
    { id: 3, name: 'Casa Hipotecada', is_active: true },
    { id: 4, name: 'Casa Alquilada', is_active: true }
  ])
})

// CAR_PURCHASE = '0',
// WEDDING = '1',
// HOME_IMPROVEMENTS = '2',
// SCHOOL = '3',
// TRAVEL = '4',
// TEENAGE_PARTY = '5'

appRoutes.get('/purpose', (req, res) => {
  return res.json([
    { name: 'Compra de Auto', is_active: true },
    { name: 'Boda', is_active: true },
    { name: 'Remodelacion', is_active: true },
    { name: 'Colegio', is_active: true },
    { name: 'Viaje', is_active: true },
    { name: 'Quince años', is_active: true }
  ])
})

module.exports = appRoutes