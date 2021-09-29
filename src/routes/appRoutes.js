const appRoutes = require('express').Router()
const axios = require('axios')

const config = require('../utils/config')
const America = require('../data/America')
const Beny = require('../data/Beny')
const Joann = require('../data/Joann')
const Maribet = require('../data/Maribet')
const Milagros = require('../data/Milagros')
const { json } = require('express')



appRoutes.get('/', (request, response) => {
  response.send('Hola Mundo!!!')
})

appRoutes.get('/today-is', (request, response) => {
  const dt1 = new Date()
  const dt2 = new Intl.DateTimeFormat('es-ES',{dateStyle: 'full'}).format(dt1)
  response.json({ hoyes: dt2 })
})


appRoutes.get('/APC-PRUEBA', (request, response) => {
  // response.json(America())
  // response.json(Beny())
  // response.json(Joann())
  response.json(Maribet())
  // response.json(Milagros())
})


appRoutes.get('/APC', (request, response) => {
  
  const URL = "https://apirestapc20210918231653.azurewebsites.net/api/APCScore"

  axios.get(URL)
  .then((res) => {
      //console.log(res.data)
      const result = res.data
      const SCORE = result["SC"]["SCORE"]
      const PI = result["SC"]["PI"]
      const EXCLUSION = result["SC"]["EXCLUSION"]
      console.log(SCORE,PI,EXCLUSION)

      const dato = []
      Object.entries(result["DET"]).forEach(([key, value]) => {
        if(value !== null) {
          value.SCORE = SCORE
          value.PI = PI
          value.EXCLUSION = EXCLUSION
          delete value['MONTO_CODIFICADO']
          delete value['COD_GRUPO_ECON']
          delete value['TIPO_ASOC']
          delete value['MONTO_CODIFICADO']
          delete value['FEC_INICIO_REL']
          delete value['FEC_FIN_REL']
          delete value['FEC_ACTUALIZACION']
          dato.push(value)
        }
      });
      
      //console.log(dato)
      response.json(dato)
  }).catch((error) => {
      console.log(error)
  });

})


appRoutes.post('/APC', (request, response) => {

  const { usuario, clave, cliente, tipo, producto } = request.body
  

})


appRoutes.get('/sectors', (request, response) => {
  const sql = "SELECT * FROM sectors"

  config.cnn.query(sql, (error, results) => {
    if (error) throw error
    if (results.length > 0) {
      response.json(results)
    } else {
      response.send('Not results!')
    }
  })
})

appRoutes.get('/profesions', (request, response) => {
  const sql = "SELECT * FROM profesions"

  config.cnn.query(sql, (error, results) => {
    if (error) throw error
    if (results.length > 0) {
      response.json(results)
    } else {
      response.send('Not results!')
    }
  })
})


appRoutes.get('/profesions_acp', (request, response) => {
  const sql = "SELECT id, titulo as name FROM profesions_acp"

  config.cnn.query(sql, (error, results) => {
    if (error) throw error
    if (results.length > 0) {
      response.json(results)
    } else {
      response.send('Not results!')
    }
  })
})

appRoutes.get('/profesions_lw', (request, response) => {
  const sql = "SELECT id, titulo as name FROM profesions_lw"

  config.cnn.query(sql, (error, results) => {
    if (error) throw error
    if (results.length > 0) {
      response.json(results)
    } else {
      response.send('Not results!')
    }
  })
})

appRoutes.get('/planillas_j', (request, response) => {
  const sql = "SELECT * FROM planillas_j"

  config.cnn.query(sql, (error, results) => {
    if (error) throw error
    if (results.length > 0) {
      response.json(results)
    } else {
      response.send('Not results!')
    }
  })
})

appRoutes.get('/ranges_pol', (request, response) => {
  const sql = "SELECT id, name FROM ranges_pol WHERE is_active = true"

  config.cnn.query(sql, (error, results) => {
    if (error) throw error
    if (results.length > 0) {
      response.json(results)
    } else {
      response.send('Not results!')
    }
  })
})

appRoutes.get('/laboral_sector_institution', (request, response) => {
  const sql = "SELECT * FROM institutions"

  config.cnn.query(sql, (error, results) => {
    if (error) throw error
    if (results.length > 0) {
      response.json(results)
    } else {
      response.send('Not results!')
    }
  })
})

appRoutes.get('/laboral_sector', (request, response) => {
  let sql = "select a.id_profesion as id, short_name as sector, id_sector, c.name as name"
  sql += " from sector_profesion a"
  sql += " inner join sectors b on b.id=a.id_sector"
  sql += " inner join profesions c on c.id=a.id_profesion"
  sql += " where is_active = true;"
  
  config.cnn.query(sql, (error, results) => {
    if (error) throw error
    if (results.length > 0) {
      response.json(results)
    } else {
      response.send('Not results!')
    }
  })
})

appRoutes.get('/laboral_sector_entity_f', (request, response) => {
  // let sql = "select a.id_code, b.id, short_name as sector, c.id, c.name as name,"
  let sql = "select id_ruta as ruta, id_sector, id_profesion,"
  sql += " descto_ship as discount_capacity,"
  sql += " descto_chip as discount_capacity_mortgage,"
  sql += " deuda_ship as debt_capacity,"
  sql += " deuda_chip as debt_capacity_mortgage,"
  sql += " plazo_max,"
  sql += " tasa,"
  sql += " comision,"
  sql += " mount_min,"
  sql += " mount_max"
  sql += " from entity_params a"
  sql += " inner join entities_f d on d.id = a.id_entity_f"
  sql += " inner join sector_profesion b on b.id=a.id_sector_profesion"
  sql += " where d.is_active = 1"
  // sql += " where a.id_entity_f = ? and a.id_code = ? and a.id_profesion = ?"

  const params = [request.params.id,  request.params.id2, request.params.id3];

  config.cnn.query(sql, params, (error, results) => {
    if (error) throw error
    if (results.length > 0) {
      response.json(results)
    } else {
      response.send('Not results!')
    }
  })
})

appRoutes.get('/laboral_status', (request, response) => {
  const sql = "SELECT name, is_active FROM laboral_status  WHERE is_active = true"

  config.cnn.query(sql, (error, results) => {
    if (error) throw error
    if (results.length > 0) {
      response.json(results)
    } else {
      response.send('Not results!')
    }
  })
})

appRoutes.get('/payment_types', (request, response) => {
  const sql = "SELECT * FROM payments"

  config.cnn.query(sql, (error, results) => {
    if (error) throw error
    if (results.length > 0) {
      response.json(results)
    } else {
      response.send('Not results!')
    }
  })
})

// OWNER = '1',
// PARENTS = '2',
// MORTGAGE = '3',
// RENT = '4'

appRoutes.get('/housing_types', (request, response) => {
  const sql = "SELECT * FROM housings  WHERE is_active = true"

  config.cnn.query(sql, (error, results) => {
    if (error) throw error
    if (results.length > 0) {
      response.json(results)
    } else {
      response.send('Not results!')
    }
  })
})

// CAR_PURCHASE = '0',
// WEDDING = '1',
// HOME_IMPROVEMENTS = '2',
// SCHOOL = '3',
// TRAVEL = '4',
// TEENAGE_PARTY = '5'

appRoutes.get('/purpose', (request, response) => {
  const sql = "SELECT * FROM purposes WHERE is_active = true"

  config.cnn.query(sql, (error, results) => {
    if (error) throw error
    if (results.length > 0) {
      response.json(results)
    } else {
      response.send('Not results!')
    }
  })
})

appRoutes.get('/marital_status', (request, response) => {
  const sql = "SELECT id, name FROM civil_status"

  config.cnn.query(sql, (error, results) => {
    if (error) throw error
    if (results.length > 0) {
      response.json(results)
    } else {
      response.send('Not results!')
    }
  })
})



appRoutes.get('/provinces', (request, response) => {
  const sql = "SELECT * FROM provinces"

  config.cnn.query(sql, (error, results) => {
    if (error) throw error
    if (results.length > 0) {
      response.json(results)
    } else {
      response.send('Not results!')
    }
  })
})

appRoutes.get('/districts', (request, response) => {
  const sql = "SELECT * FROM districts"

  config.cnn.query(sql, (error, results) => {
    if (error) throw error
    if (results.length > 0) {
      response.json(results)
    } else {
      response.send('Not results!')
    }
  })
})

appRoutes.get('/counties', (request, response) => {
  const sql = "SELECT * FROM counties"

  config.cnn.query(sql, (error, results) => {
    if (error) throw error
    if (results.length > 0) {
      response.json(results)
    } else {
      response.send('Not results!')
    }
  })
})

appRoutes.get('/type_documents', (request, response) => {
  const sql = "SELECT id, name, id_name FROM type_documents WHERE is_active = true"

  config.cnn.query(sql, (error, results) => {
    if (error) {
      logger.error('Error SQL:', error.sqlMessage)
      response.status(500)
    } 
    if (results.length > 0) {
      response.json(results)
    } else {
      response.send('Not results!')
    }
  })
})

appRoutes.get('/terms_loan', (request, response) => {
  const sql = "SELECT id, name FROM terms_loan WHERE is_active = true"

  config.cnn.query(sql, (error, results) => {
    if (error) {
      logger.error('Error SQL:', error.sqlMessage)
      response.status(500)
    } 
    if (results.length > 0) {
      response.json(results)
    } else {
      response.send('Not results!')
    }
  })
})

appRoutes.get('/nationality', (request, response) => {
  const sql = "SELECT id, name FROM nationality WHERE is_active = true"

  config.cnn.query(sql, (error, results) => {
    if (error) {
      logger.error('Error SQL:', error.sqlMessage)
      response.status(500)
    } 
    if (results.length > 0) {
      response.json(results)
    } else {
      response.send('Not results!')
    }
  })
})

appRoutes.get('/entities_f', (request, response) => {
  const sql = "SELECT id, name, id_ruta FROM entities_f WHERE is_active = true"

  config.cnn.query(sql, (error, results) => {
    if (error) {
      logger.error('Error SQL:', error.sqlMessage)
      response.status(500)
    } 
    if (results.length > 0) {
      response.json(results)
    } else {
      response.send('Not results!')
    }
  })
})

appRoutes.get('/sector_profesion', (request, response) => {
  let sql = "SELECT a.id, concat(b.name, ' - ', c.name) as name"
  sql += " FROM sector_profesion a"
  sql += " INNER JOIN sectors b ON b.id = a.id_sector"
  sql += " INNER JOIN profesions c ON c.id = a.id_profesion"
  sql += " WHERE is_active = true"

  config.cnn.query(sql, (error, results) => {
    if (error) {
      logger.error('Error SQL:', error.sqlMessage)
      response.status(500)
    } 
    if (results.length > 0) {
      response.json(results)
    } else {
      response.send('Not results!')
    }
  })
})


//**********************************************//
//**********************************************//
//** Extraccion de tasas para Financomer */
//** 2021-08-04 LLRR */
//**********************************************//
//**********************************************//

appRoutes.get('/subgrupo_institution', (request, response) => {
  const sql = "SELECT id, name, tasa_mes_menor, tasa_mes_mayor, anios, plazo_maximo FROM subgrupo_inst"

  config.cnn.query(sql, (error, results) => {
    if (error) {
      logger.error('Error SQL:', error.sqlMessage)
      response.status(500)
    } 
    if (results.length > 0) {
      response.json(results)
    } else {
      response.send('Not results!')
    }
  })
})


module.exports = appRoutes