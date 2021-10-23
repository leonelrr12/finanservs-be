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

appRoutes.post('/clientify-token', async (req, res) => {

  axios({
    method: "post",
    url: "https://api.clientify.net/v1/api-auth/obtain_token/", 
    data: {
      "username": "rsanchez2565@gmail.com",
      "password": "Acsorat25"
    },
    headers: {
      "Content-Type": "application/json"
    }
  })
  .then(result => res.json(result.data))
  .catch(error => console.log('error', error))
})


appRoutes.post('/clientify', async (req, res) => {
  const { body } = req
  const { token, Tracking,
          first_name, last_name, email, phone, fecha_nacimiento, contrato_laboral, 
          meses_trabajo_actual, meses_trabajo_anterior, Salario, Sector, acepta_terminos_condiciones, 
          Institucion, Ocupacion, Profesion, Planilla, Genero, tipo_residencia, mensualidad_casa } = body

  const wDate = date => (date.getFullYear()+ "-" + (date.getMonth() + 1)  + "-" +  date.getDate())
  const wCapit = text => (text.toLowerCase().split(' ').map(w => w[0].toUpperCase() + w.substr(1)).join(' '))

  let wprof = 'N/A'
  await axios.get(`http://localhost:3001/api/profesions/${Profesion}`)
  .then(res => {
    const result = res.data
    wprof = result[0].profesion
  })

  let wocup = 'N/A'
  let URL = ""
  if(Profesion === '2') URL =  `http://localhost:3001/api/profesions_lw/${Ocupacion}`
  else if(Profesion === '4') URL = `http://localhost:3001/api/institutions/${Institucion}`
  else if(Profesion === '5') URL = `http://localhost:3001/api/profesions_acp/${Ocupacion}`
  else if(Profesion === '6') URL = `http://localhost:3001/api/ranges_pol/${Ocupacion}`
  else if(Profesion === '7') URL = `http://localhost:3001/api/planillas_j/${Planilla}`
  
  if(URL.length) {
    await axios.get(URL)
    .then(res => {
      const result = res.data
      wocup = result[0].ocupacion
    })
  }

  raw = JSON.stringify({
    Tracking,
    first_name, 
    last_name, 
    email, 
    phone, 
    "birthday": wDate(new Date(fecha_nacimiento)),
    "google_id": "google_id",
    "facebook_id": "facebook_id",
    "custom_fields": [
      {"field": "Tracking", "value": Tracking}, 
      {"field": "contrato_laboral", "value": contrato_laboral}, 
      {"field": "meses_trabajo_actual", "value": Number(meses_trabajo_actual)},
      {"field": "meses_trabajo_anterior", "value": Number(meses_trabajo_anterior)},
      {"field": "Salario", "value": Number(Salario)},
      {"field": "Sector", "value": Sector}, 
      {"field": "Profesion", "value": wprof}, 
      {"field": "Ocupacion", "value": wocup.length > 3 ? wCapit(wocup) : wocup,}, 
      {"field": "Genero", "value": Genero},
      {"field": "acepta_terminos_condiciones", "value": acepta_terminos_condiciones},
      {"field": "tipo_residencia", "value": tipo_residencia === '1' ? "Casa Propia": 
                                            tipo_residencia === '2' ? "Padres o Familiares": 
                                            tipo_residencia === '3' ? "Casa Hipotecada": "Casa Alquilada"},
      {"field": "mensualidad_casa", "value": Number(mensualidad_casa)},
    ]
  })

  const url = "https://api.clientify.net/v1/contacts/"
  const headers = {
    "Authorization": `Token ${token}`,
    "Content-Type": "application/json"
  }

  axios({
    method: "POST",
    url, 
    data: raw,
    headers: headers,
    redirect: 'follow'
  })
  .then(result => res.json(result.data))
  // .then(result => console.log(result.data))
  .catch(error => console.log('error', error))

})


appRoutes.put('/clientify', async (req, res) => {
  const { body } = req
  const { token, ID = 0, Tracking,
          donde_trabaja = 'N/A', Puesto = 'N/A', tipo_residencia = '0', mensualidad_casa = 0, Cedula = 'N/A', 
          img_cedula = 'N/A',  img_ficha_css = 'N/A', img_servicio_publico = 'N/A', img_carta_trabajo = 'N/A', 
          img_comprobante_pago = 'N/A', img_autoriza_apc = 'N/A', province, district, county, street = 'N/A'} = body

  const wCapit = text => (text.toLowerCase().split(' ').map(w => w[0].toUpperCase() + w.substr(1)).join(' '))

  let wprov = 'N/A'
  await axios.get(`http://localhost:3001/api/provinces/${province}`)
  .then(res => {
    const result = res.data
    wprov = result[0].province
  })

  let wdist = 'N/A'
  await axios.get(`http://localhost:3001/api/districts/${district}`)
  .then(res => {
    const result = res.data
    wdist = result[0].district
  })

  raw = JSON.stringify({
    "google_id": "google_id",
    "facebook_id": "facebook_id",
    "addresses": [
      {
        "street": street,
        "city": (wdist || '').length > 1 ? wCapit(wdist) : "N/A",
        "state": (wprov || '').length > 1 ? wCapit(wprov) : "N/A",
        "country": "Panamá",
        "type": 5
      }
    ],
    "custom_fields": [
      {"field": "Tracking", "value": Tracking}, 
      {"field": "donde_trabaja", "value": donde_trabaja},
      {"field": "Puesto", "value": Puesto},
      {"field": "tipo_residencia", "value": tipo_residencia === '1' ? "Casa Propia": 
                                            tipo_residencia === '2' ? "Padres o Familiares": 
                                            tipo_residencia === '3' ? "Casa Hipotecada": "Casa Alquilada"},
      {"field": "mensualidad_casa", "value": Number(mensualidad_casa)},
      {"field": "Cedula", "value": Cedula},
      {"field": "img_cedula", "value": img_cedula},
      {"field": "img_servicio_publico", "value": img_servicio_publico},
      {"field": "img_ficha_css", "value": img_ficha_css},
      {"field": "img_carta_trabajo", "value": img_carta_trabajo},
      {"field": "img_comprobante_pago", "value": img_comprobante_pago},
      {"field": "img_autoriza_apc", "value": img_autoriza_apc},
    ]
  })

  const url = `https://api.clientify.net/v1/contacts/${ID}`
  const headers = {
    "Authorization": `Token ${token}`,
    "Content-Type": "application/json"
  }

  axios({
    method: "PUT",
    url, 
    data: raw,
    headers: headers,
    redirect: 'follow'
  })
  .then(result => res.json(result.data))
  // .then(result => console.log(result.data))
  .catch(error => console.log('error', error))

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
      Terminos_Condiciones,
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
      Terminos_Condiciones,
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
    Terminos_Condiciones,
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
      Terminos_Condiciones,
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
appRoutes.get('/profesions/:id', (request, response) => {
  let sql = "SELECT name as profesion"
  sql += " FROM profesions"
  sql += " WHERE id = ?"

  const params = [request.params.id];
  config.cnn.query(sql, params, (error, results) => {
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
appRoutes.get('/profesions_acp/:id', (request, response) => {
  let sql = "SELECT titulo as ocupacion"
  sql += " FROM profesions_acp"
  sql += " WHERE id = ?"

  const params = [request.params.id];
  config.cnn.query(sql, params, (error, results) => {
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
appRoutes.get('/profesions_lw/:id', (request, response) => {
  let sql = "SELECT titulo as ocupacion"
  sql += " FROM profesions_lw"
  sql += " WHERE id = ?"

  const params = [request.params.id];
  config.cnn.query(sql, params, (error, results) => {
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
appRoutes.get('/planillas_j/:id', (request, response) => {
  let sql = "SELECT name as ocupacion"
  sql += " FROM planillas_j"
  sql += " WHERE id = ?"

  const params = [request.params.id];
  config.cnn.query(sql, params, (error, results) => {
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
appRoutes.get('/ranges_pol/:id', (request, response) => {
  let sql = "SELECT name as ocupacion"
  sql += " FROM ranges_pol"
  sql += " WHERE id = ?"

  const params = [request.params.id];
  config.cnn.query(sql, params, (error, results) => {
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
appRoutes.get('/institution/:id', (request, response) => {
  let sql = "SELECT name as ocupacion"
  sql += " FROM institutions"
  sql += " WHERE id = ?"

  const params = [request.params.id];
  config.cnn.query(sql, params, (error, results) => {
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


appRoutes.get('/provinces/:id', (request, response) => {
  let sql = "SELECT name as province"
  sql += " FROM provinces"
  sql += " WHERE id = ?"

  const params = [request.params.id];
  config.cnn.query(sql, params, (error, results) => {
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

appRoutes.get('/districts/:id', (request, response) => {
  let sql = "SELECT name as district"
  sql += " FROM districts"
  sql += " WHERE id = ?"

  const params = [request.params.id];
  config.cnn.query(sql, params, (error, results) => {
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

appRoutes.get('/counties/:id', (request, response) => {
  let sql = "SELECT name as countie"
  sql += " FROM counties"
  sql += " WHERE id = ?"

  const params = [request.params.id];
  config.cnn.query(sql, params, (error, results) => {
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