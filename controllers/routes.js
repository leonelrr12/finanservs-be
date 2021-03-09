const appRoutes = require('express').Router()

appRoutes.get('/', (request, response) => {
  response.send('Hola Mundo!!!')
})

appRoutes.get('/laboral_sector_institution', (req, res) => {
  return res.json([
    { id: 1, name: 'Caja de Seguro Social (CSS)' },
    { id: 2, name: 'Ministerio de Salud' },
    { id: 3, name: 'Hospital del Niño' },
    { id: 4, name: 'Hospital Santo Tomás' },
    { id: 5, name: 'Instituto Oncológico Nacional' },
    { id: 6, name: 'Instituto Nacional de Medicina Fisica Y Rehabilitacion' },
  ])
})

appRoutes.get('/laboral_sector', (req, res) => {
  return res.json([
    { 
      id: 8, 
      professions: [
        { id: 1, name: 'Planilla 14 (Jubilados por edad)' },
        { id: 2, name: 'Planilla 24 (Jubilados por edad con fondo complementario)' },
        { id: 3, name: 'Planilla 17 (Jubilación anticipada por Leyes Especiales)' },
        { id: 4, name: 'Planilla 27 (Jubilación anticipada con fondo complementario – Leyes especiales)' },
        { id: 5, name: 'Planilla 19 (Jubilación por años de servicios – Policías, Educadores, Médicos y Enfermeras)' },
        { id: 6, name: 'Planilla 29 (Jubilación por años de servicios con fondo complementario)' },
        { id: 7, name: 'Planilla 34 (Pensión de vejez por retiro anticipado)' },
        { id: 8, name: 'Planilla 35(Pensión de retiro por vejez proporcional)' },
        { id: 9, name: 'Planilla 36 (Pensión de retiro por vejez proporcional anticipada)' },
        { id: 10, name: 'Planilla 37 (Pensión especiales – trabajadores agrícolas y construcción)' },
        { id: 11, name: 'Planilla 13( Solo por excepción)' },
        { id: 12, name: 'Planilla 23( Solo por excepción)' },
        { id: 13, name: 'Planilla 20 y 25 (viudas ) ( Solo por excepción)' },
        
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
      name: 'Médicos/ Enfermeras',
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
      name: 'Médicos/ Enfermeras',
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

appRoutes.get('/marital_status', (req, res) => {
  return res.json([
    { id: 1, name: 'Casado' },
    { id: 2, name: 'Soltero' },
    { id: 3, name: 'Unido' },
  ])
})

module.exports = appRoutes