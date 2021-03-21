const admRoutes = require('express').Router()
const config = require('../utils/config')
const logger = require('../utils/logger')


admRoutes.get('/', (request, response) => {
  response.send('Hola Mundo!!! Desde Admin Routes')
})


admRoutes.get('/prospects', (request, response) => {
  let sql = "SELECT a.id, a.name, id_personal, b.name as entity, email, a.cellphone,"

  sql += " idUrl as imag_id,"
  sql += " socialSecurityProofUrl as imag_fss,"
  sql += " publicGoodProofUrl as imag_rs,"
  sql += " workLetterUrl as imag_lw,"
  sql += " payStubUrl as imag_cp,"

  sql += " c.name as estado, fcreate, datediff(now(), fcreate) as dias"
  sql += " FROM prospects a"
  sql += " INNER JOIN entities_f b ON b.id_ruta=a.entity_f"
  sql += " INNER JOIN estados_tramite c ON c.id=a.estado;"

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

admRoutes.post('/prospects', (request, response) => {
  const sql = "INSERT INTO prospects (id_personal,idUser,name,fname,fname_2,lname,lname_2,entity_f,estado,email,cellphone,phoneNumber,idUrl,socialSecurityProofUrl,publicGoodProofUrl,workLetterUrl,payStubUrl,origin_idUser,gender,birthDate,contractType,jobSector,occupation,paymentFrecuency,profession,residenceType,civil_status,province,district,salary,fcreate,fupdate,quotation,application,sign) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,now(),now(),?,?,?)"

  let {id_personal,idUser,name,fname,fname_2,lname,lname_2,entity_f,estado,email,cellPhone,phoneNumber,idUrl,socialSecurityProofUrl,publicGoodProofUrl,workLetterUrl,payStubUrl,origin_idUser,gender,birthDate,contractType,jobSector,occupation,paymentFrecuency,profession,residenceType,civil_status,province,district,salary,quotation,application,sign} = request.body

  estado = 1 // Nuevo registro queda con estatus de nuevo
  birthDate = birthDate.slice(0,10)
  const params = [id_personal,idUser,name,fname,fname_2,lname,lname_2,entity_f,estado,email,cellPhone,phoneNumber,idUrl,socialSecurityProofUrl,publicGoodProofUrl,workLetterUrl,payStubUrl,origin_idUser,gender,birthDate,contractType,jobSector,occupation,paymentFrecuency,profession,residenceType,civil_status,province,district,salary,quotation,application,sign]

  console.log(request.body);
  console.log(params);
  response.send('Ok!')

  config.cnn.query(sql, params, (error, results, next) => {
    if (error) {
      logger.error('Error SQL:', error.sqlMessage)
      response.status(500)
    } 
    response.send('Ok!')
  })
})

admRoutes.get('/prospects/:id', (request, response) => {

  const sql = "SELECT * FROM prospects WHERE id = ?;"

  const params = [request.params.id];

  config.cnn.query(sql, params, (error, results) => {
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

admRoutes.get('/prospects/aproach/:id', (request, response) => {
  let sql = "SELECT a.id, a.name, id_personal, b.name as entity, email, a.cellphone,"

  sql += " idUrl as imag_id,"
  sql += " socialSecurityProofUrl as imag_fss,"
  sql += " publicGoodProofUrl as imag_rs,"
  sql += " workLetterUrl as imag_lw,"
  sql += " payStubUrl as imag_cp,"

  sql += " c.name as estado, fcreate, datediff(now(), fcreate) as dias"
  sql += " FROM prospects a"
  sql += " INNER JOIN entities_f b ON b.id_ruta=a.entity_f"
  sql += " INNER JOIN estados_tramite c ON c.id=a.estado"
  sql += " WHERE id_personal = ?;"

  const params = [request.params.id];
  
  config.cnn.query(sql, params, (error, results) => {
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

admRoutes.get('/prospects/entity_f/:id', (request, response) => {
  let sql = "SELECT a.id, a.name, id_personal, b.name as entity, email, a.cellphone,"

  sql += " idUrl as imag_id,"
  sql += " socialSecurityProofUrl as imag_fss,"
  sql += " publicGoodProofUrl as imag_rs,"
  sql += " workLetterUrl as imag_lw,"
  sql += " payStubUrl as imag_cp,"

  sql += " c.name as estado, fcreate, datediff(now(), fcreate) as dias"
  sql += " FROM prospects a"
  sql += " INNER JOIN entities_f b ON b.id_ruta=a.entity_f"
  sql += " INNER JOIN estados_tramite c ON c.id=a.estado"
  sql += " WHERE entity_f = ?;"

  const params = [request.params.id];
 
  config.cnn.query(sql, params, (error, results) => {
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

admRoutes.put('/prospects/entity_f/:id', (request, response) => {
  const id = request.params.id

  const sql = "UPDATE prospects SET estado=?, fupdate=now() WHERE id = ?"

  const params = request.body

  config.cnn.query(sql, params, (error, results, next) => {
    if (error) {
      logger.error('Error SQL:', error.sqlMessage)
      response.status(500)
    } 
    response.send('Ok!')
  })
})
 

admRoutes.get('/sectors', (request, response) => {
  const sql = "SELECT * FROM sectors"

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

admRoutes.get('/sectors/:id', (request, response) => {
  const sql = "SELECT * FROM sectors WHERE id = ?"

  const params = [request.params.id];

  config.cnn.query(sql, params, (error, results) => {
    if (error) {
      logger.error('Error SQL:', error.sqlMessage)
      response.status(500)
    } 
    if (results.length > 0) {
      response.json(results[0])
    } else {
      response.send('Not results!')
    }
  })
}) 

admRoutes.post('/sectors', (request, response) => {
  const sql = "SELECT max(id) + 1 as id FROM sectors"
  config.cnn.query(sql, (error, results) => {
    if (error) {
      logger.error('Error SQL:', error.sqlMessage)
      response.status(500)
    } 
    const { id } = results[0]

    const sql = "INSERT INTO sectors (id, name, short_name) VALUES (?, ?, ?)"

    const {name, short_name} = request.body
    const params = [id, name, short_name];

    config.cnn.query(sql, params, (error, results, next) => {
      if (error) {
        logger.error('Error SQL:', error.sqlMessage)
        response.status(500)
      } 
      response.send('Ok!')
    })
  })
})

admRoutes.put('/sectors', (request, response) => {
  const sql = "UPDATE sectors SET name=?, short_name=? WHERE id = ?"

  const {id, name, short_name} = request.body
  const params = [name, short_name, id];

  config.cnn.query(sql, params, (error, results) => {
    if (error) {
      logger.error('Error SQL:', error.sqlMessage)
      response.status(500)
    } 
    response.send('Ok!')
  })
})

admRoutes.delete('/sectors/:id', (request, response) => {
  const sql = "DELETE FROM sectors WHERE id = ?"
  const params = [request.params.id]; 

  config.cnn.query(sql, params, (error, results) => {
    if (error) {
      logger.error('Error SQL:', error.sqlMessage)
      response.status(500)
    } 
    if (results.affectedRows > 0) {
      response.send('Ok!')
    } else {
      logger.error('Error SQL:', 'No existe registro a eliminar!')
      response.status(500)
    }
  })
})


admRoutes.get('/civilstatus', (request, response) => {
  const sql = "SELECT * FROM civil_status"

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

admRoutes.get('/civilstatus/:id', (request, response) => {
  const sql = "SELECT * FROM civil_status WHERE id = ?"

  const params = [request.params.id];

  config.cnn.query(sql, params, (error, results) => {
    if (error) {
      logger.error('Error SQL:', error.sqlMessage)
      response.status(500)
    } 
    if (results.length > 0) {
      response.json(results[0])
    } else {
      response.send('Not results!')
    }
  })
}) 

admRoutes.post('/civilstatus', (request, response) => {
  const sql = "SELECT max(id) + 1 as id FROM civil_status"
  config.cnn.query(sql, (error, results) => {
    if (error) {
      logger.error('Error SQL:', error.sqlMessage)
      response.status(500)
    } 
    const { id } = results[0]

    const sql = "INSERT INTO civil_status (id, name) VALUES (?, ?)"

    const {name} = request.body
    const params = [id, name];

    config.cnn.query(sql, params, (error, results, next) => {
      if (error) {
        logger.error('Error SQL:', error.sqlMessage)
        response.status(500)
      } 
      response.send('Ok!')
    })
  })
})

admRoutes.put('/civilstatus', (request, response) => {
  const sql = "UPDATE civil_status SET name=? WHERE id = ?"

  const {id, name} = request.body
  const params = [name, id];

  config.cnn.query(sql, params, (error, results) => {
    if (error) {
      logger.error('Error SQL:', error.sqlMessage)
      response.status(500)
    } 
    response.send('Ok!')
  })
})

admRoutes.delete('/civilstatus/:id', (request, response) => {
  const sql = "DELETE FROM civil_status WHERE id = ?"
  const params = [request.params.id]; 

  config.cnn.query(sql, params, (error, results) => {
    if (error) {
      logger.error('Error SQL:', error.sqlMessage)
      response.status(500)
    } 
    if (results.affectedRows > 0) {
      response.send('Ok!')
    } else {
      logger.error('Error SQL:', 'No existe registro a eliminar!')
      response.status(500)
    }
  })
})


admRoutes.get('/profesions', (request, response) => {
  const sql = "SELECT * FROM profesions"

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

admRoutes.get('/profesions/:id', (request, response) => {
  const sql = "SELECT * FROM profesions WHERE id = ?"

  const params = [request.params.id];

  config.cnn.query(sql, params, (error, results) => {
    if (error) {
      logger.error('Error SQL:', error.sqlMessage)
      response.status(500)
    } 
    if (results.length > 0) {
      response.json(results[0])
    } else {
      response.send('Not results!')
    }
  })
}) 

admRoutes.post('/profesions', (request, response) => {
  const sql = "SELECT max(id) + 1 as id FROM profesions"
  config.cnn.query(sql, (error, results) => {
    if (error) {
      logger.error('Error SQL:', error.sqlMessage)
      response.status(500)
    } 
    const { id } = results[0]

    const sql = "INSERT INTO profesions (id, name) VALUES (?, ?)"

    const {name} = request.body
    const params = [id, name];

    config.cnn.query(sql, params, (error, results, next) => {
      if (error) {
        logger.error('Error SQL:', error.sqlMessage)
        response.status(500)
      } 
      response.send('Ok!')
    })
  })
})

admRoutes.put('/profesions', (request, response) => {
  const sql = "UPDATE profesions SET name=? WHERE id = ?"

  const {id, name} = request.body
  const params = [name, id];

  config.cnn.query(sql, params, (error, results) => {
    if (error) {
      logger.error('Error SQL:', error.sqlMessage)
      response.status(500)
    } 
    response.send('Ok!')
  })
})

admRoutes.delete('/profesions/:id', (request, response) => {
  const sql = "DELETE FROM profesions WHERE id = ?"
  const params = [request.params.id]; 

  config.cnn.query(sql, params, (error, results) => {
    if (error) {
      logger.error('Error SQL:', error.sqlMessage)
      response.status(500)
    } 
    if (results.affectedRows > 0) {
      response.send('Ok!')
    } else {
      logger.error('Error SQL:', 'No existe registro a eliminar!')
      response.status(500)
    }
  })
})


admRoutes.get('/profesions_lw', (request, response) => {
  const sql = "SELECT count(id) totalRecord FROM profesions_lw"

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

admRoutes.get('/profesions_lw/:page/:linePage', (request, response) => {
  // const sql = "SELECT id, titulo as name FROM profesions_lw LIMIT ?, ?"
  const sql = "SELECT id, titulo as name FROM profesions_lw"
  const page = parseInt(request.params.page)
  const linePage = parseInt(request.params.linePage)
  const params = [page, linePage]

  console.log(params);
  // config.cnn.query(sql, params, (error, results) => {
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

admRoutes.get('/profesions_lw/:id', (request, response) => {
  const sql = "SELECT id, titulo as name FROM profesions_lw WHERE id = ?"
  const params = [request.params.id]

  config.cnn.query(sql, params, (error, results) => {
    if (error) {
      logger.error('Error SQL:', error.sqlMessage)
      response.status(500)
    } 
    if (results.length > 0) {
      response.json(results[0])
    } else {
      response.send('Not results!')
    }
  })
}) 

admRoutes.post('/profesions_lw', (request, response) => {
  const sql = "SELECT max(id) + 1 as id FROM profesions_lw"
  config.cnn.query(sql, (error, results) => {
    if (error) {
      logger.error('Error SQL:', error.sqlMessage)
      response.status(500)
    } 
    const { id } = results[0]

    const sql = "INSERT INTO profesions_lw (id, titulo) VALUES (?, ?)"

    const {name} = request.body
    const params = [id, name];

    config.cnn.query(sql, params, (error, results, next) => {
      if (error) {
        logger.error('Error SQL:', error.sqlMessage)
        response.status(500)
      } 
      response.send('Ok!')
    })
  })
})

admRoutes.put('/profesions_lw', (request, response) => {
  const sql = "UPDATE profesions_lw SET titulo=? WHERE id = ?"
  const {id, name} = request.body
  const params = [name, id];

  config.cnn.query(sql, params, (error, results) => {
    if (error) {
      logger.error('Error SQL:', error.sqlMessage)
      response.status(500)
    } 
    response.send('Ok!')
  })
})

admRoutes.delete('/profesions_lw/:id', (request, response) => {
  const sql = "DELETE FROM profesions_lw WHERE id = ?"
  const params = [request.params.id]; 

  config.cnn.query(sql, params, (error, results) => {
    if (error) {
      logger.error('Error SQL:', error.sqlMessage)
      response.status(500)
    } 
    if (results.affectedRows > 0) {
      response.send('Ok!')
    } else {
      logger.error('Error SQL:', 'No existe registro a eliminar!')
      response.status(500)
    }
  })
})


admRoutes.get('/institutions', (request, response) => {
  const sql = "SELECT * FROM institutions"

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

admRoutes.get('/institutions/:id', (request, response) => {
  const sql = "SELECT * FROM institutions WHERE id = ?"

  const params = [request.params.id];

  config.cnn.query(sql, params, (error, results) => {
    if (error) {
      logger.error('Error SQL:', error.sqlMessage)
      response.status(500)
    } 
    if (results.length > 0) {
      response.json(results[0])
    } else {
      response.send('Not results!')
    }
  })
}) 

admRoutes.post('/institutions', (request, response) => {
  const sql = "SELECT max(id) + 1 as id FROM institutions"
  config.cnn.query(sql, (error, results) => {
    if (error) {
      logger.error('Error SQL:', error.sqlMessage)
      response.status(500)
    } 
    const { id } = results[0]

    const sql = "INSERT INTO institutions (id, name) VALUES (?, ?)"

    const {name} = request.body
    const params = [id, name];

    config.cnn.query(sql, params, (error, results, next) => {
      if (error) {
        logger.error('Error SQL:', error.sqlMessage)
        response.status(500)
      } 
      response.send('Ok!')
    })
  })
})

admRoutes.put('/institutions', (request, response) => {
  const sql = "UPDATE institutions SET name=? WHERE id = ?"

  const {id, name} = request.body
  const params = [name, id];

  config.cnn.query(sql, params, (error, results) => {
    if (error) {
      logger.error('Error SQL:', error.sqlMessage)
      response.status(500)
    } 
    response.send('Ok!')
  })
})

admRoutes.delete('/institutions/:id', (request, response) => {
  const sql = "DELETE FROM institutions WHERE id = ?"
  const params = [request.params.id]; 

  config.cnn.query(sql, params, (error, results) => {
    if (error) {
      logger.error('Error SQL:', error.sqlMessage)
      response.status(500)
    } 
    if (results.affectedRows > 0) {
      response.send('Ok!')
    } else {
      logger.error('Error SQL:', 'No existe registro a eliminar!')
      response.status(500)
    }
  })
})


admRoutes.get('/planillas_j', (request, response) => {
  const sql = "SELECT * FROM planillas_j"

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

admRoutes.get('/planillas_j/:id', (request, response) => {
  const sql = "SELECT * FROM planillas_j WHERE id = ?"

  const params = [request.params.id];

  config.cnn.query(sql, params, (error, results) => {
    if (error) {
      logger.error('Error SQL:', error.sqlMessage)
      response.status(500)
    } 
    if (results.length > 0) {
      response.json(results[0])
    } else {
      response.send('Not results!')
    }
  })
}) 

admRoutes.post('/planillas_j', (request, response) => {
  const sql = "SELECT max(id) + 1 as id FROM planillas_j"
  config.cnn.query(sql, (error, results) => {
    if (error) {
      logger.error('Error SQL:', error.sqlMessage)
      response.status(500)
    } 
    const { id } = results[0]

    const sql = "INSERT INTO planillas_j (id, name) VALUES (?, ?)"

    const {name} = request.body
    const params = [id, name];

    config.cnn.query(sql, params, (error, results, next) => {
      if (error) {
        logger.error('Error SQL:', error.sqlMessage)
        response.status(500)
      } 
      response.send('Ok!')
    })
  })
})

admRoutes.put('/planillas_j', (request, response) => {
  const sql = "UPDATE planillas_j SET name=? WHERE id = ?"

  const {id, name} = request.body
  const params = [name, id];

  config.cnn.query(sql, params, (error, results) => {
    if (error) {
      logger.error('Error SQL:', error.sqlMessage)
      response.status(500)
    } 
    response.send('Ok!')
  })
})

admRoutes.delete('/planillas_j/:id', (request, response) => {
  const sql = "DELETE FROM planillas_j WHERE id = ?"
  const params = [request.params.id]; 

  config.cnn.query(sql, params, (error, results) => {
    if (error) {
      logger.error('Error SQL:', error.sqlMessage)
      response.status(500)
    } 
    if (results.affectedRows > 0) {
      response.send('Ok!')
    } else {
      logger.error('Error SQL:', 'No existe registro a eliminar!')
      response.status(500)
    }
  })
})


admRoutes.get('/housings', (request, response) => {
  const sql = "SELECT id, name, CASE WHEN is_active THEN 'Si' ELSE 'No' END as is_active FROM housings"

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

admRoutes.get('/housings/:id', (request, response) => {
  const sql = "SELECT id, name, CASE WHEN is_active THEN 'Si' ELSE 'No' END as is_active FROM housings WHERE id = ?"

  const params = [request.params.id];

  config.cnn.query(sql, params, (error, results) => {
    if (error) {
      logger.error('Error SQL:', error.sqlMessage)
      response.status(500)
    } 
    if (results.length > 0) {
      response.json(results[0])
    } else {
      response.send('Not results!')
    }
  })
}) 

admRoutes.post('/housings', (request, response) => {
  const sql = "SELECT max(id) + 1 as id FROM housings"
  config.cnn.query(sql, (error, results) => {
    if (error) {
      logger.error('Error SQL:', error.sqlMessage)
      response.status(500)
    } 
    const { id } = results[0]

    const sql = "INSERT INTO housings (id, name, is_active) VALUES (?, ?, ?)"

    const {name, is_active} = request.body
    const params = [id, name, is_active === 'Si' ? true : false];

    config.cnn.query(sql, params, (error, results, next) => {
      if (error) {
        logger.error('Error SQL:', error.sqlMessage)
        response.status(500)
      } 
      response.send('Ok!')
    })
  })
})

admRoutes.put('/housings', (request, response) => {
  const sql = "UPDATE housings SET name=?, is_active=? WHERE id = ?"

  const {id, name, is_active} = request.body
  const params = [name, is_active === 'Si' ? true : false, id];

  config.cnn.query(sql, params, (error, results) => {
    if (error) {
      logger.error('Error SQL:', error.sqlMessage)
      response.status(500)
    } 
    response.send('Ok!')
  })
})

admRoutes.delete('/housings/:id', (request, response) => {
  const sql = "DELETE FROM housings WHERE id = ?"
  const params = [request.params.id]; 

  config.cnn.query(sql, params, (error, results) => {
    if (error) {
      logger.error('Error SQL:', error.sqlMessage)
      response.status(500)
    } 
    if (results.affectedRows > 0) {
      response.send('Ok!')
    } else {
      logger.error('Error SQL:', 'No existe registro a eliminar!')
      response.status(500)
    }
  })
})


admRoutes.get('/purposes', (request, response) => {
  const sql = "SELECT id, name, CASE WHEN is_active THEN 'Si' ELSE 'No' END as is_active FROM purposes"

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

admRoutes.get('/purposes/:id', (request, response) => {
  const sql = "SELECT id, name, CASE WHEN is_active THEN 'Si' ELSE 'No' END as is_active FROM purposes WHERE id = ?"

  const params = [request.params.id];

  config.cnn.query(sql, params, (error, results) => {
    if (error) {
      logger.error('Error SQL:', error.sqlMessage)
      response.status(500)
    } 
    if (results.length > 0) {
      response.json(results[0])
    } else {
      response.send('Not results!')
    }
  })
}) 

admRoutes.post('/purposes', (request, response) => {
  const sql = "SELECT max(id) + 1 as id FROM purposes"
  config.cnn.query(sql, (error, results) => {
    if (error) {
      logger.error('Error SQL:', error.sqlMessage)
      response.status(500)
    } 
    const { id } = results[0]

    const sql = "INSERT INTO purposes (id, name, is_active) VALUES (?, ?, ?)"

    const {name, is_active} = request.body
    const params = [id, name, is_active === 'Si' ? true : false];

    config.cnn.query(sql, params, (error, results, next) => {
      if (error) {
        logger.error('Error SQL:', error.sqlMessage)
        response.status(500)
      } 
      response.send('Ok!')
    })
  })
})

admRoutes.put('/purposes', (request, response) => {
  const sql = "UPDATE purposes SET name=?, is_active=? WHERE id = ?"

  const {id, name, is_active} = request.body
  const params = [name, is_active === 'Si' ? true : false, id];

  config.cnn.query(sql, params, (error, results) => {
    if (error) {
      logger.error('Error SQL:', error.sqlMessage)
      response.status(500)
    } 
    response.send('Ok!')
  })
})

admRoutes.delete('/purposes/:id', (request, response) => {
  const sql = "DELETE FROM purposes WHERE id = ?"
  const params = [request.params.id]; 

  config.cnn.query(sql, params, (error, results) => {
    if (error) {
      logger.error('Error SQL:', error.sqlMessage)
      response.status(500)
    } 
    if (results.affectedRows > 0) {
      response.send('Ok!')
    } else {
      logger.error('Error SQL:', 'No existe registro a eliminar!')
      response.status(500)
    }
  })
})


admRoutes.get('/payments', (request, response) => {
  const sql = "SELECT id, name, CASE WHEN is_active THEN 'Si' ELSE 'No' END as is_active FROM payments"

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

admRoutes.get('/payments/:id', (request, response) => {
  const sql = "SELECT id, name, CASE WHEN is_active THEN 'Si' ELSE 'No' END as is_active FROM payments WHERE id = ?"

  const params = [request.params.id];

  config.cnn.query(sql, params, (error, results) => {
    if (error) {
      logger.error('Error SQL:', error.sqlMessage)
      response.status(500)
    } 
    if (results.length > 0) {
      response.json(results[0])
    } else {
      response.send('Not results!')
    }
  })
}) 

admRoutes.post('/payments', (request, response) => {
  const sql = "SELECT max(id) + 1 as id FROM payments"
  config.cnn.query(sql, (error, results) => {
    if (error) {
      logger.error('Error SQL:', error.sqlMessage)
      response.status(500)
    } 
    const { id } = results[0]

    const sql = "INSERT INTO payments (id, name, is_active) VALUES (?, ?, ?)"

    const {name, is_active} = request.body
    const params = [id, name, is_active === 'Si' ? true : false];

    config.cnn.query(sql, params, (error, results, next) => {
      if (error) {
        logger.error('Error SQL:', error.sqlMessage)
        response.status(500)
      } 
      response.send('Ok!')
    })
  })
})

admRoutes.put('/payments', (request, response) => {
  const sql = "UPDATE payments SET name=?, is_active=? WHERE id = ?"

  const {id, name, is_active} = request.body
  const params = [name, is_active === 'Si' ? true : false, id];

  config.cnn.query(sql, params, (error, results) => {
    if (error) {
      logger.error('Error SQL:', error.sqlMessage)
      response.status(500)
    } 
    response.send('Ok!')
  })
})

admRoutes.delete('/payments/:id', (request, response) => {
  const sql = "DELETE FROM payments WHERE id = ?"
  const params = [request.params.id]; 

  config.cnn.query(sql, params, (error, results) => {
    if (error) {
      logger.error('Error SQL:', error.sqlMessage)
      response.status(500)
    } 
    if (results.affectedRows > 0) {
      response.send('Ok!')
    } else {
      logger.error('Error SQL:', 'No existe registro a eliminar!')
      response.status(500)
    }
  })
})


admRoutes.get('/entities_f', (request, response) => {
  const sql = "SELECT id, name, id_ruta, contact, phone_number, cellphone, CASE WHEN is_active THEN 'Si' ELSE 'No' END as is_active FROM entities_f"

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

admRoutes.get('/entities_f/:id', (request, response) => {
  const sql = "SELECT id, name, id_ruta, contact, phone_number, cellphone, CASE WHEN is_active THEN 'Si' ELSE 'No' END as is_active FROM entities_f WHERE id = ?"

  const params = [request.params.id];

  config.cnn.query(sql, params, (error, results) => {
    if (error) {
      logger.error('Error SQL:', error.sqlMessage)
      response.status(500)
    } 
    if (results.length > 0) {
      response.json(results[0])
    } else {
      response.send('Not results!')
    }
  })
}) 

admRoutes.post('/entities_f', (request, response) => {
  const sql = "INSERT INTO entities_f (name, id_ruta, contact, phone_number, cellphone, is_active) VALUES (?, ?, ?, ?, ?, ?)"
  const {name, id_ruta, contact, phone_number, cellphone, is_active} = request.body
  const params = [name, id_ruta, contact, phone_number, cellphone, is_active === 'Si' ? true : false];

  config.cnn.query(sql, params, (error, results, next) => {
    if (error) {
      logger.error('Error SQL:', error.sqlMessage)
      response.status(500)
    } 
    response.send('Ok!')
  })
})

admRoutes.put('/entities_f', (request, response) => {
  const sql = "UPDATE entities_f SET name=?, id_ruta=?, contact=?, phone_number=?, cellphone=?, is_active=? WHERE id = ?"

  const {id, name, id_ruta, contact, phone_number, cellphone, is_active} = request.body
  const params = [name, id_ruta, contact, phone_number, cellphone, is_active === 'Si' ? true : false, id];

  config.cnn.query(sql, params, (error, results) => {
    if (error) {
      logger.error('Error SQL:', error.sqlMessage)
      response.status(500)
    } 
    response.send('Ok!')
  })
})

admRoutes.delete('/entities_f/:id', (request, response) => {
  const sql = "DELETE FROM entities_f WHERE id = ?"
  const params = [request.params.id]; 

  config.cnn.query(sql, params, (error, results) => {
    if (error) {
      logger.error('Error SQL:', error.sqlMessage)
      response.status(500)
    } 
    if (results.affectedRows > 0) {
      response.send('Ok!')
    } else {
      logger.error('Error SQL:', 'No existe registro a eliminar!')
      response.status(500)
    }
  })
})

module.exports = admRoutes