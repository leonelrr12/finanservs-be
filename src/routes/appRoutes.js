const appRoutes = require('express').Router()
const axios = require('axios')
const mongoose = require('mongoose')
const Prospect = require('../models/Prospect')

const config = require('../utils/config')


appRoutes.get('/', (request, response) => {
  response.send('Hola Mundo!!!')
})

appRoutes.get('/today-is', (request, response) => {
  const dt1 = new Date()
  const dt2 = new Intl.DateTimeFormat('es-ES',{dateStyle: 'full'}).format(dt1)
  response.json({ hoyes: dt2 })
})


appRoutes.post('/tracking', async (req, res) => {

  await mongoose.connect(config.MONGODB_URI, {
    useNewUrlParser: true, 
    useUnifiedTopology: true
  })
    .then(() => console.log('MongoDB Connected...'))
    .catch((err) => console.log(err))

    const {
      Numero_Id,
      Nombre,
      Segundo_Nombre,
      Apellido_Paterno,
      Apellido_Materno,
      Email,
      Celular,
      Genero,
      Nacionalidad,
      Fecha_Nac,
      Estado_Civil,
      Telefono_Casa,
      Provincia,
      Distrito,
      Corregimiento,
      Calle_No,

      Sector, 
      Profesion, 
      Institucion,
      Tipo_Residencia, 
      Tipo_Contrato_Res, 
      Mensualidad,
      Historial_Credito, 
      Frecuencia_Pago,

      Salario, 
      Servicios_Profesionales, 
      Viaticos,
      Tipo_Contrato,
      Meses_Trabajo_Actual,
      Compañia_Trabajo,
      Cargo,
      Direccion_Trabajo,
      Telefono_Trabajo,
      Extension_Trabajo,
      Trabajo_Anterior,
      Meses_Trabajo_Anterior,

      Entidad_Seleccionada,
      Prestamo_Opciones,

      Img_ID,
      Img_Ficha_CSS,
      Img_Servicio_Publico,
      Img_Carta_Trabajo,
      Img_Comprobante_Pago,
      Img_Autoriza_APC,
      
      Ref_Familia_Nombre,
      Ref_Familia_Apellido,
      Ref_Familia_Parentesco,
      Ref_Familia_Telefono,
      Ref_Familia_Casa_No,
      Ref_Familia_Empresa,
      Ref_Familia_Empresa_Telefono,
      Ref_Familia_Empresa_Extension,

      Ref_No_Familia_Nombre,
      Ref_No_Familia_Apellido,
      Ref_No_Familia_Parentesco,
      Ref_No_Familia_Telefono,
      Ref_No_Familia_Casa_No,
      Ref_No_Familia_Empresa,
      Ref_No_Familia_Empresa_Telefono,
      Ref_No_Familia_Empresa_Extension,
    
    } = req.body

  const opciones = Prestamo_Opciones ? JSON.parse(Prestamo_Opciones): ([{
    bank: '',
    loan: 0.00,
    term: 0,
    paysYear: 0.00,
    monthlyFee: 0.00,
    cashOnHand: 0.00
  }])

  const newProspect =  new Prospect({
    Numero_Id,
    Prospect: {
      Nombre,
      Segundo_Nombre,
      Apellido_Paterno,
      Apellido_Materno,
      Email,
      Celular,
      Genero,
      Nacionalidad,
      Fecha_Nac,
      Nacionalidad,
      Estado_Civil,
      Telefono_Casa,
      Provincia,
      Distrito,
      Corregimiento,
      Calle_No
    },

    Info: {
      Sector, 
      Profesion, 
      Institucion,
      Tipo_Residencia, 
      Tipo_Contrato_Res,
      Mensualidad,
      Historial_Credito, 
      Frecuencia_Pago,
    },
    
    Ingresos: {
      Salario, 
      Servicios_Profesionales, 
      Viaticos
    },

    Trabajo_Actual: {
      Tipo_Contrato,
      Meses_Trabajo_Actual,
      Compañia_Trabajo,
      Cargo,
      Direccion_Trabajo,
      Telefono_Trabajo,
      Extension_Trabajo,
      Trabajo_Anterior,
      Meses_Trabajo_Anterior,
    },

    Entidad_Seleccionada,
    Prestamo_Opciones: opciones,

    Documentos: {
      Img_ID,
      Img_Ficha_CSS,
      Img_Servicio_Publico,
      Img_Carta_Trabajo,
      Img_Comprobante_Pago,
      Img_Autoriza_APC,
    },

    Ref_Personal_Familia: {
      Ref_Familia_Nombre,
      Ref_Familia_Apellido,
      Ref_Familia_Parentesco,
      Ref_Familia_Telefono,
      Ref_Familia_Casa_No,
      Ref_Familia_Empresa,
      Ref_Familia_Empresa_Telefono,
      Ref_Familia_Empresa_Extension,
    },

    Ref_Personal_No_Familia: {
      Ref_No_Familia_Nombre,
      Ref_No_Familia_Apellido,
      Ref_No_Familia_Parentesco,
      Ref_No_Familia_Telefono,
      Ref_No_Familia_Casa_No,
      Ref_No_Familia_Empresa,
      Ref_No_Familia_Empresa_Telefono,
      Ref_No_Familia_Empresa_Extension,
    },
  })

  let ID = newProspect._id
  await newProspect.save()

  res.send({"ID": ID})
})


appRoutes.put('/tracking', async (req, res) => {

  await mongoose.connect(config.MONGODB_URI, {
    useNewUrlParser: true, useUnifiedTopology: true
  })
  .then(() => console.log('MongoDB Connected...'))
  .catch((err) => console.log(err))

  const {
    Numero_Id,
    Nombre,
    Segundo_Nombre,
    Apellido_Paterno,
    Apellido_Materno,
    Email,
    Celular,
    Genero,
    Nacionalidad,
    Fecha_Nac,
    Estado_Civil,
    Telefono_Casa,
    Provincia,
    Distrito,
    Corregimiento,
    Calle_No,

    Sector, 
    Profesion, 
    Institucion,
    Ocupacion,
    Planilla_CSS,
    Tipo_Residencia,  
    Mensualidad,
    Historial_Credito, 
    Frecuencia_Pago,

    Salario, 
    Servicios_Profesionales, 
    Viaticos,
    Tipo_Contrato,
    Meses_Trabajo_Actual,
    Compania_Trabajo,
    Cargo,
    Direccion_Trabajo,
    Telefono_Trabajo,
    Extension_Trabajo,
    Trabajo_Anterior,
    Meses_Trabajo_Anterior,

    Entidad_Seleccionada,
    Prestamo_Opciones,

    Img_ID,
    Img_Ficha_CSS,
    Img_Servicio_Publico,
    Img_Carta_Trabajo,
    Img_Comprobante_Pago,
    Img_Autoriza_APC,
    
    Ref_Familia_Nombre,
    Ref_Familia_Apellido,
    Ref_Familia_Parentesco,
    Ref_Familia_Telefono,
    Ref_Familia_Casa_No,
    Ref_Familia_Empresa,
    Ref_Familia_Empresa_Telefono,
    Ref_Familia_Empresa_Extension,

    Ref_No_Familia_Nombre,
    Ref_No_Familia_Apellido,
    Ref_No_Familia_Parentesco,
    Ref_No_Familia_Telefono,
    Ref_No_Familia_Casa_No,
    Ref_No_Familia_Empresa,
    Ref_No_Familia_Empresa_Telefono,
    Ref_No_Familia_Empresa_Extension,

    id_param,
  
  } = req.body

  const opciones = Prestamo_Opciones ? JSON.parse(Prestamo_Opciones): ([{
    bank: '',
    loan: 0.00,
    term: 0,
    paysYear: 0.00,
    monthlyFee: 0.00,
    cashOnHand: 0.00
  }])
  // console.log(opciones)
  
  const udtDatos =  {
    Numero_Id,
    Prospect: {
      Nombre,
      Segundo_Nombre,
      Apellido_Paterno,
      Apellido_Materno,
      Email,
      Celular,
      Genero,
      Nacionalidad,
      Fecha_Nac,
      Nacionalidad,
      Estado_Civil,
      Telefono_Casa,
      Provincia,
      Distrito,
      Corregimiento,
      Calle_No
    },
    
    Info: {
      Sector, 
      Profesion, 
      Institucion,
      Ocupacion,
      Planilla_CSS,
      Tipo_Residencia, 
      Mensualidad,
      Historial_Credito, 
      Frecuencia_Pago,
    },
    
    Ingresos: {
      Salario, 
      Servicios_Profesionales, 
      Viaticos
    },
    
    Entidad_Seleccionada,
    Prestamo_Opciones: opciones,

    Trabajo_Actual: {
      Tipo_Contrato,
      Meses_Trabajo_Actual,
      Compania_Trabajo,
      Cargo,
      Direccion_Trabajo,
      Telefono_Trabajo,
      Extension_Trabajo,
      Trabajo_Anterior,
      Meses_Trabajo_Anterior,
    },

    Documentos: {
      Img_ID,
      Img_Ficha_CSS,
      Img_Servicio_Publico,
      Img_Carta_Trabajo,
      Img_Comprobante_Pago,
      Img_Autoriza_APC,
    },

    Ref_Personal_Familia: {
      Ref_Familia_Nombre,
      Ref_Familia_Apellido,
      Ref_Familia_Parentesco,
      Ref_Familia_Telefono,
      Ref_Familia_Casa_No,
      Ref_Familia_Empresa,
      Ref_Familia_Empresa_Telefono,
      Ref_Familia_Empresa_Extension,
    },

    Ref_Personal_No_Familia: {
      Ref_No_Familia_Nombre,
      Ref_No_Familia_Apellido,
      Ref_No_Familia_Parentesco,
      Ref_No_Familia_Telefono,
      Ref_No_Familia_Casa_No,
      Ref_No_Familia_Empresa,
      Ref_No_Familia_Empresa_Telefono,
      Ref_No_Familia_Empresa_Extension,
    },
  }

  // console.log(udtDatos)
  try {
    await Prospect.findByIdAndUpdate(id_param, udtDatos, {new: true})
    await Prospect.save() 
    res.send(result)
  } catch(err)  {
    res.status(500).send(err)
  }
})


appRoutes.get('/tracking', (req, res) => {
  mongoose.connect(config.MONGODB_URI, {
    useNewUrlParser: true, useUnifiedTopology: true
  })
 
  Prospect.find(function(err, data) {
      if(err){
          console.log(err);
      }
      else{
          res.send(data);
      }
  });  
});

appRoutes.delete('/tracking', (req, res) => {
  const { id } = req.body
  Prospect.findByIdAndDelete(id, function (err) {
    if(err) console.log(err);
    console.log("Successful deletion");
    res.send("Ok!");
  });
});

// appRoutes.delete('/tracking', (req, res) => {
//   const { cond } = req.body
//   Prospect.deleteMany(cond, function (err) {
//     if(err) console.log(err);
//     console.log("Successful deletion");
//     res.send("Ok!");
//   });
// });


appRoutes.post('/APC', (request, response) => {

  const { usuarioApc, claveApc, id, tipoCliente, productoApc } = request.body

  const URL = "https://apirestapc20210918231653.azurewebsites.net/api/APCScore"
  // const URL = "http://localhost:5000/api/APCScore"

  const datos = []
  axios.post(URL,{"usuarioconsulta": usuarioApc, "claveConsulta": claveApc, "IdentCliente": id, "TipoCliente": tipoCliente, "Producto": productoApc})
  .then((res) => {
      const result = res.data
      if(result["estatus"] === "0") {
        datos.push({"status": false, "message": "Sin Referencias de Crédito!"})
        response.json(datos)
        return
      }

      // console.log(result)
      let SCORE = "0"
      let PI = "0"
      let EXCLUSION = "0"
      if(result["sc"] !== null) {
        SCORE = result["sc"]["score"]
        PI = result["sc"]["pi"]
        EXCLUSION = result["sc"]["exclusion"]
      }

      Object.entries(result["det"]).forEach(([key, value]) => {
        if(value !== null) {
          value.status = true
          value.message = "Ok"
          value.score = SCORE
          value.pi = PI
          value.exclision = EXCLUSION
          delete value['montO_CODIFICADO']
          delete value['coD_GRUPO_ECON']
          delete value['tipO_ASOC']
          delete value['montO_CODIFICADO']
          delete value['feC_INICIO_REL']
          delete value['feC_FIN_REL']
          delete value['feC_ACTUALIZACION']
          datos.push(value)
        }
      });

      response.json(datos)
  }).catch((error) => {
      console.log(error)
      datos.push({"status": false, "message": "WS-APC No disponible."})
      response.json(datos)
  });
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
  sql += " salario_min,"
  sql += " tasa_servicio,"
  sql += " seg_vida,"
  sql += " feci,"
  sql += " itbms,"
  sql += " notaria,"
  sql += " factor,"
  sql += " letraRetenida,"
  sql += " gastoLegal,"
  sql += " timbres,"
  sql += " servicioDescto,"
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