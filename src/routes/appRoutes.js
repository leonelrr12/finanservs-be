const appRoutes = require('express').Router()
const axios = require('axios')
const cors = require('cors')
const mongoose = require('mongoose')
const Prospect = require('../models/Prospect')
const nodemailer = require('nodemailer')
const { google } = require('googleapis')
const config = require('../utils/config')
const OAuth2 = google.auth.OAuth2

const pdfMake = require('pdfmake/build/pdfmake');
const pdfPrinter = require('pdfmake/src/printer');
const pdfFonts = require('pdfmake/build/vfs_fonts');
const fs = require('fs')
const path = require('path');

// const { sendEmail: key } = config
const { sendGEmail: key } = config
const OAuth2Client = new OAuth2(key.clientId, key.clientSecret, key.redirectUri)
OAuth2Client.setCredentials({ refresh_token: key.refreshToken })

// const { usuarioApc, claveApc } = config.APC
const { user: usuarioApc, pass: claveApc } = config.APC

appRoutes.get('/', (request, response) => {
  response.send('Hola Mundo!!!')
})

const separator = (numb) => {
  var str = numb.toString().split(".");
  if(str.length > 1) {
    str[1] = str[1].padEnd(2, '0')
  } else {
    str[1]='00'
  }
  str[0] = str[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return str.join(".");
}


appRoutes.get('/today-is', (req, res) => {
  const dt1 = new Date()
  const dt2 = new Intl.DateTimeFormat('es-ES',{dateStyle: 'full'}).format(dt1)
  res.json({ hoyes: dt2 })
})


appRoutes.get('/planilla_css/:cedula', (req, res) => {
  let sql = "SELECT salario_mensual as salario, gasto_mensual as gasto,"
  sql += " inicio_labores as inicio, 26 as meses_antig, cargo, entidad, contrato"
  sql += " FROM planilla_css  WHERE cedula = ?"

  const params = [req.params.cedula];
  config.cnn.query(sql, params, (error, results) => {
    if (error) throw error
    if (results.length > 0) {
      res.json(results)
    } else {
      res.json([{ salario: 0, gasto: 0, inicio: '', meses_antig: 0, cargo: '', entidad: '', contrato: '' }])
    }
  })
})



appRoutes.get('/prospects', (req, res) => {
  let sql = "select	sign"
  sql += " FROM prospects a"
  sql += " WHERE id_personal = '3-722-1667'"

  const params = [req.params.id_personal];
  config.cnn.query(sql, params, (error, results) => {
    if (error) {
      logger.error('Error SQL:', error.sqlMessage)
      res.status(500)
    } 
    if (results.length > 0) {
      const firma = results[0].sign.toString()
      res.json({sign: firma})
    } else {
      res.send('Not results!')
    }
  })
})


appRoutes.post('/email', async (req, res) => {

  const { email: euser, asunto, mensaje, telefono, monto, nombre, banco, cedula } = req.body

  let emails = null
  await axios.get(`http://localhost:3001/api/entities_f/${banco}`)
  .then(res => {
    const result = res.data
    emails = result[0].emails
  }).catch(() => {
    emails = null
  })

  if(emails === undefined) emails = null
  if(!emails) {
    console.log("Debe configurar lista de Emails en la Entidad Financiera.")
    return
  }
  emails += ", rsanchez2565@gmail.com, guasimo01@gmail.com"

  let fileAtach = ""
  try {
    if(banco === '800')   // Banisi
      fileAtach = await solicPrestBanisi(cedula)

    const htmlEmail = `
      <h3>Nuevo Prospecto desde Finanservs.com</h3>
      <ul>
        <li>Email: ${euser}</li>
        <li>Nombre: ${nombre}</li>
        <li>Teléfono: ${telefono}</li>
        <li>Monto Solicitado: ${monto}</li>
      </ul>
      <h3>Mensaje</h3>
      <h3>${banco === '800' && fileAtach != "" ? 'Adjuntamos solicitud de préstamos para ser completada y firmada.': ''}</h3>
      <p>${mensaje}</p>
    `

    const send_mail = async () => {
      const accessToken = await OAuth2Client.getAccessToken()
      try {
        const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            type: 'OAuth2',
            user: key.EMAIL_USER, 
            clientId: key.clientId, 
            clientSecret: key.clientSecret,
            refreshToken: key.refreshToken,
            accessToken: accessToken
          },
          tls: {
            rejectUnauthorized: false
          }
        })
    
        const mailOptions = {
          from: key.EMAIL_FROM,
          to: emails,
          subject: asunto,
          text: mensaje,
          html: htmlEmail,
        }
        if(banco === '800' && fileAtach != "") { // Banisi
          mailOptions.attachments = [
            {   // utf-8 string as an attachment
                filename: 'Solicitud.pdf',
                path: fileAtach,
                content: 'Solicitud de Préstamo'
            },
          ]
        }
    
        const result = await transporter.sendMail(mailOptions)
        transporter.close()
        return result
      } catch (err) {
        console.log('Estamos aqui: ', err)
      }
    }
    send_mail()
      .then( r => {
        res.status(200).send('Enviado!')
        try {
          fs.unlinkSync(fileAtach)
        } catch(err) {
          console.error('Something wrong happened removing the file', err)
        }
      })
      .catch( e => console.log(e.message) )
  } catch (err) {
    console.log('Estamos aqui 2: ', err)
  }
})


appRoutes.post('/clientify-token', async (req, res) => {
  axios({
    method: "post",
    url: "https://api.clientify.net/v1/api-auth/obtain_token/", 
    data: {
      "username": config.CLIENTIFY.username,
      "password": config.CLIENTIFY.password
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

  let { token, ID, Tracking, entidad_seleccionada, prestamo_opciones,
          first_name, last_name, email, phone, fecha_nacimiento, contrato_laboral, 
          meses_trabajo_actual, meses_trabajo_anterior, Salario, Sector, acepta_terminos_condiciones, 
          Institucion, Ocupacion, Profesion, Planilla, Genero, tipo_residencia, mensualidad_casa,

          donde_trabaja = 'N/A', Puesto = 'N/A', Cedula = 'N/A', 
          img_cedula = 'N/A',  img_ficha_css = 'N/A', img_servicio_publico = 'N/A', img_carta_trabajo = 'N/A', 
          img_comprobante_pago = 'N/A', img_autoriza_apc = 'N/A', img_referencias_apc = 'N/A', 
          province, district, county, street = 'N/A'
        } = body

  const wDate = date => (date.getFullYear()+ "-" + (date.getMonth() + 1)  + "-" +  date.getDate())
  const wCapit = text => (text.toLowerCase().split(' ').map(w => w[0].toUpperCase() + w.substr(1)).join(' '))

  let Monto = 0, Letra = 0, Plazo = 0, Efectivo = 0

  const opciones = JSON.parse(prestamo_opciones)
  if(opciones.length) {
    const opcion = opciones.filter((item) => item.bank === entidad_seleccionada)
    if(opcion.length) {
      Monto = opcion[0].loan
      Letra = opcion[0].monthlyFee
      Plazo = opcion[0].term
      Efectivo = opcion[0].cashOnHand
    }
  }

  let wbanco = 'N/A'
  await axios.get(`http://localhost:3001/api/entities_f/${entidad_seleccionada}`)
  .then(res => {
    const result = res.data
    wbanco = result[0].name
  }).catch(() => {
    wbanco = 'N/A'
  })
  if(wbanco === undefined) wbanco = 'N/A'

  let wprof = 'N/A'
  await axios.get(`http://localhost:3001/api/profesions/${Profesion}`)
  .then(res => {
    const result = res.data
    wprof = result[0].profesion
  }).catch(() => {
    wprof = 'N/A'
  })
  if(wprof == undefined) wprof = 'N/A'

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
    }).catch(() => {
      wocup = 'N/A'
    })
  }
  if(wocup == undefined) wocup = 'N/A'

  let wprov = 'N/A'
  await axios.get(`http://localhost:3001/api/provinces/${province}`)
  .then(res => {
    const result = res.data
    wprov = result[0].province
  }).catch(() => {
    wprov = 'N/A'
  })
  if(wprov == undefined) wprov = 'N/A'

  let wdist = 'N/A'
  await axios.get(`http://localhost:3001/api/districts/${district}`)
  .then(res => {
    const result = res.data
    wdist = result[0].district
  }).catch(() => {
    wdist = 'N/A'
  })
  if(wdist == undefined) wdist = 'N/A'

  if(!img_autoriza_apc) img_autoriza_apc = "N/A"
  if(!img_referencias_apc) img_referencias_apc = "N/A"

  raw = JSON.stringify({
    first_name, 
    last_name, 
    email, 
    phone, 
    "title": Puesto,
    "company": donde_trabaja,
    "birthday": wDate(new Date(fecha_nacimiento)),
    "google_id": "google_id",
    "facebook_id": "facebook_id",
    "addresses": [
      {
        "street": street,
        "city": (wdist || '').length > 3 ? wCapit(wdist) : "N/A",
        "state": (wprov || '').length > 3 ? wCapit(wprov) : "N/A",
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
      {"field": "img_referencias_apc2", "value": img_referencias_apc},

      {"field": "contrato_laboral", "value": contrato_laboral}, 
      {"field": "meses_trabajo_actual", "value": Number(meses_trabajo_actual)},
      {"field": "meses_trabajo_anterior", "value": Number(meses_trabajo_anterior)},
      {"field": "Salario", "value": Number(Salario)},
      {"field": "Sector", "value": Sector}, 
      {"field": "Profesion", "value": wprof}, 
      {"field": "Ocupacion", "value": wocup}, 
      {"field": "Genero", "value": Genero},
      {"field": "acepta_terminos_condiciones", "value": acepta_terminos_condiciones},

      {"field": "entidad_seleccionada", "value": wbanco},
      {"field": "Monto", "value": Monto},
      {"field": "Letra", "value": Letra},
      {"field": "Plazo", "value": Plazo},
      {"field": "Agente", "value": config.ORIGEN.nombre}
    ]
  })

  const headers = {
    "Authorization": `Token ${token}`,
    "Content-Type": "application/json"
  }

  let post = "POST"
  if(ID) post = "PUT"

  const url = `https://api.clientify.net/v1/contacts/${ID}`
  axios({
    method: post,
    url, 
    data: raw,
    headers: headers,
    redirect: 'follow'
  })
  .then(result => res.json(result.data))
  .catch(error => console.log('error', error))
})

appRoutes.post('/clientify-rechazo', async (req, res) => {
  const { body } = req
  const { token, ID = 0, Tracking } = body

  raw = JSON.stringify({
    "custom_fields": [
      {"field": "Tracking", "value": Tracking}
    ]
  })

  const url = `https://api.clientify.net/v1/contacts/${ID}/`
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


appRoutes.get('/tracking/cedula/:cedula', (req, res) => {

  const { cedula } = req.params

  mongoose.connect(config.MONGODB_URI, {
    useNewUrlParser: true, 
    useUnifiedTopology: true
  })
  .then(() => console.log('MongoDB Connected... Tracking'))
  .catch((err) => console.log(err))
 
  Prospect.find({ "Cedula": cedula }, function(err, data) {
    if(err){
        console.log(err)
    }
    else{
        res.send(data)
    }
  }) 
})
appRoutes.get('/tracking/id/:id', (req, res) => {

  const { id } = req.params

  mongoose.connect(config.MONGODB_URI, {
    useNewUrlParser: true, useUnifiedTopology: true
  })
  .then(() => console.log('MongoDB Connected... Tracking'))
  .catch((err) => console.log(err))
 
  Prospect.findById({ "_id": id }, function(err, data) {
    if(err){
        console.log(err)
    }
    else{
        res.send(data)
    }
  }) 
})
appRoutes.get('/tracking/delete/:id', (req, res) => {

  const { id } = req.params

  mongoose.connect(config.MONGODB_URI, {
    useNewUrlParser: true, useUnifiedTopology: true
  })
  .then(() => console.log('MongoDB Connected... Tracking'))
  .catch((err) => console.log(err))
 
  Prospect.findByIdAndRemove({ "_id": id }, function(err, result) {
    if(err){
      console.log(err)
    }
    else{
      res.send("Ok")
    }
  }) 
})
appRoutes.get('/tracking', (req, res) => {
  mongoose.connect(config.MONGODB_URI, {
    useNewUrlParser: true, useUnifiedTopology: true
  })
  .then(() => console.log('MongoDB Connected... Tracking'))
  .catch((err) => console.log(err))  


  Prospect.find(function(err, data) {
      if(err){
        console.log(err)
      }
      else{
        res.send(data)
      }
  }) 
})


appRoutes.post('/leerAPC', (request, response) => {
  const { id: cedula } = request.body

  mongoose.connect(config.MONGODB_URI, {
    useNewUrlParser: true, 
    useUnifiedTopology: true
  })
  .then(() => console.log('MongoDB Connected...3'))
  .catch((err) => console.log(err))

  Prospect.find({ "Cedula": cedula }, {}, function (err, data) {
    let result = {}
    if(data.length) {
      result = data[0].APC
    }
    formatData(result, response)
  })
})

appRoutes.post('/APC', async (request, response) => {
  let {id: cedula } = request.body
  // cedula = process.env.APC_Cedula || cedula

  mongoose.connect(config.MONGODB_URI, {
    useNewUrlParser: true, 
    useUnifiedTopology: true
  })
  .then(() => console.log('MongoDB Connected...1-a'))
  .catch((err) => console.log(err))

  let datos = {}
  let antigRef = 0

  try {
    const data = await Prospect.find({ "Cedula": cedula }, {})
    if (data.length) {
      console.log('Hola por aqui-2222')
      const created = data[0].Created
      const today = new Date()
      antigRef = Math.round((today.getTime() - created.getTime())/(24*60*60*1000))

      if(antigRef < 91 || process.env.APC_NoVence) {
        datos = data[0].APC
      }
    }
    if(!Object.keys(datos).length) {
      console.log('Hola por aqui-1111')
      await leerRefAPC(request, response)
    } else {
      formatData(datos, response)
      console.log('Hola por aqui-3333')
    }
  } catch(err)  {
    formatData(datos, response)
    console.log('Hola por aqui-4444')
  }
})
const leerRefAPC = async (request, response) => {
  const { id, tipoCliente, productoApc } = request.body
  const URL = "https://apirestapc20210918231653.azurewebsites.net/api/APCScore"

  let idMongo = ""
  axios.post(URL, {
    "usuarioconsulta": usuarioApc, "claveConsulta": claveApc, 
    "IdentCliente": id, "TipoCliente": tipoCliente, "Producto": productoApc})
  .then(async (res) => {
    const result = res.data
    console.log('Hola estoy por aqui-AAAAA')
    if(result.mensaje === 'Ok') {
      idMongo = await guardarRef(result, id)
      datos = await leerRefMongo(idMongo)
      formatData(datos, response)
    } else {
      formatData([], response)
    }
  }).catch((error) => {
    console.log('Hola estoy por aqui-BBBB')
    formatData([], response)
  });
  return idMongo
}
const guardarRef = async (refApc, id) => {

  console.log('refApc', refApc)
  const { nombre, apellido, idenT_CLIE, noM_ASOC, } = refApc.gen

  const Generales = {
    "Nombre": nombre,
    "Apellido": apellido,
    "Id": idenT_CLIE,
    "Usuario": usuarioApc,
    "Asociado": noM_ASOC
  }

  const Resumen = []
  Object.entries(refApc["res"]).forEach(([key, value]) => {
    if(value !== null) {
      const dato = {}
      for (var i in value) {
        switch(i) {
          case "relacion":
            dato.Relacion = value[i]
            break
          case "cantidad":
            dato.Cantidad = value[i]
            break
          case "monto":
            dato.Monto = value[i]
            break
          case "saldO_ACTUAL":
            dato.Saldo_Actual = value[i]
            break
          default:
            // code block
        }
      }
      Resumen.push(dato)
    }
  })

  const Referencias = []
  Object.entries(refApc["det"]).forEach(([key, value]) => {
    if(value !== null) {
      const dato = {}
      for (var i in value) {
        switch(i) {
          case "noM_ASOC":
            dato.Agente_Economico = value[i]
            break
          case "descR_CORTA_RELA":
            dato.Relacion = value[i]
            break
          case "montO_ORIGINAL":
            dato.Monto_Original = value[i]
            break
          case "saldO_ACTUAL":
            dato.Saldo_Actual = value[i]
            break
          case "nuM_REFER":
            dato.Referencia = value[i]
            break
          case "nuM_PAGOS":
            dato.Num_Pagos = value[i]
            break
          case "descR_FORMA_PAGO":
            dato.Forma_Pago = value[i]
            break
          case "importE_PAGO":
            dato.Letra = value[i]
            break
          case "montO_ULTIMO_PAGO":
            dato.Monto_Utimo_Pago = value[i]
            break
          case "feC_ULTIMO_PAGO":
            dato.Fec_Ultimo_pago = value[i]
            break
          case "descR_OBS_CORTA":
            dato.Observacion = value[i]
            break
          case "nuM_DIAS_ATRASO":
            dato.Dias_Atraso = value[i]
            break
          case "historia":
            dato.Historial = value[i]
            break
          case "feC_INICIO_REL":
            dato.Fec_Ini_Relacion = value[i]
            break
          case "feC_FIN_REL":
            dato.Fec_Vencimiento = value[i]
            break
          case "feC_ACTUALIZACION":
            dato.Fec_Actualiazacion = value[i]
            break
          default:
            // code block
        }
      }
      dato.Estado = "ACTULIZADA"
      dato.Fec_Prescripcion = ""
      Referencias.push(dato)
    }
  })

  const Ref_Canceladas = []
  Object.entries(refApc["ref"]).forEach(([key, value]) => {
    if(value !== null) {
      const dato = {}
      for (var i in value) {
        switch(i) {
          case "noM_ASOC":
            dato.Agente_Economico = value[i]
            break
          case "descR_CORTA_RELA":
            dato.Relacion = value[i]
            break
          case "montO_ORIGINAL":
            dato.Monto_Original = value[i]
            break
          case "nuM_REFER":
            dato.Referencia = value[i]
            break

          case "feC_INICIO_REL":
            dato.Fec_Ini_Relacion = value[i]
            break
          case "feC_FIN_REL":
            dato.Fec_Vencimiento = value[i]
            break
          case "feC_LIQUIDACION":
            dato.Fec_Cancelacion = value[i]
            break

          case "feC_ULTIMO_PAGO":
            dato.Fec_Ultimo_pago = value[i]
            break
          case "descR_OBS_CORTA":
            dato.Observacion = value[i]
            break
          case "historia":
            dato.Historial = value[i]
            break

          default:
            // code block
        }
      }
      dato.Fec_Prescripcion = ""
      Ref_Canceladas.push(dato)
    }
  })

  const Score = {
    Score: 0,
    PI: 0,
    Exclusion: ""
  }

  if(refApc["sc"] !== null) {
    Score.Score = refApc["sc"]["score"]
    Score.PI = refApc["sc"]["pi"]
    Score.Exclusion = refApc["sc"]["exclusion"]
  }

  const udtDatos = {
    Cedula: id,
    APC: {
      Generales,
      Resumen,
      Referencias,
      Ref_Canceladas,
      Score
    }
  }

  await mongoose.connect(config.MONGODB_URI, {
    useNewUrlParser: true, 
    useUnifiedTopology: true
  })
  .then(() => console.log('MongoDB Connected...2'))
  .catch((err) => console.log(err))

  let idMongo = ""
  try {
    const xxx = await Prospect.updateOne(
      {Cedula: id},
      udtDatos, 
      {upsert: true}
    )
    idMongo = JSON.stringify(xxx.upsertedId).replace('"','').replace('"','')
    console.log('idMongo',idMongo)
  } catch(err)  {
    console.log(err)
  }
  return idMongo
}
const leerRefMongo = async (id) => {
  mongoose.connect(config.MONGODB_URI, {
    useNewUrlParser: true, 
    useUnifiedTopology: true
  })
  .then(() => console.log('MongoDB Connected...1-b'))
  .catch((err) => console.log(err))

  try {
    const data = await Prospect.findById( { "_id": id }, {})
    if (Object.keys(data).length) {
      return data.APC
    }
  } catch (err) {
    console.log (err)
    return {}
  }
}
const formatData = (result, response) => {
  let datos = []
  if (Object.keys(result).length) {
    let SCORE = "0"
    let PI = "0"
    let EXCLUSION = "0"
    if(result["Score"] !== null) {
      SCORE = result["Score"]["Score"]
      PI = result["Score"]["PI"]
      EXCLUSION = result["Score"]["Exclusion"]
    }

    Object.entries(result["Referencias"]).forEach(([key, value]) => {
      if(value !== null) {
        value.status = true
        value.message = "Ok"
        value.score = SCORE
        value.pi = PI
        value.exclusion = EXCLUSION
        datos.push(value)
      }
    });
  } else {
    datos.push({"status": false, "message": "WS-APC No disponible."})
  }  
  response.json(datos)
}

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

// 1 = Titular
// 2 = Asistente
appRoutes.get('/profesions_lw', (request, response) => {
  let sql = "SELECT id, titulo as name, type"
  sql += " FROM profesions_lw"

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
    if (error) {
      cnn.connect(error => {
        if (error) {
          logger.error('Error SQL:', error.message)
          return response.status(500)
        }
        console.log('Database server runnuning!');
      })
    } 
    if (results.length > 0) {
      response.json(results)
    } else {
      response.send('Not results!')
    }
  })
})

appRoutes.get('/laboral_sector_entity_f', (request, response) => {
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
  sql += " factor_SV,"
  sql += " feci,"
  sql += " itbms,"
  sql += " notaria,"
  sql += " factor,"
  sql += " letraRetenida,"
  sql += " gastoLegal,"
  sql += " timbres,"
  sql += " servicioDescto,"
  sql += " d.type,"
  sql += " mount_min,"
  sql += " mount_max, min_antiguedad"
  sql += " from entity_params a"
  sql += " inner join entities_f d on d.id = a.id_entity_f"
  sql += " inner join sector_profesion b on b.id=a.id_sector_profesion"
  sql += " where d.is_active = 1"

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
  const sql = "SELECT * FROM counties ORDER BY name"

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
      return response.status(500)
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
      return response.status(500)
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
      return response.status(500)
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
      return response.status(500)
    } 
    if (results.length > 0) {
      response.json(results)
    } else {
      response.send('Not results!')
    }
  })
})
appRoutes.get('/entities_f/:id', (request, response) => {
  let sql = "SELECT name, emails"
  sql += " FROM entities_f"
  sql += " WHERE id_ruta = ?"

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


appRoutes.get('/sector_profesion', (request, response) => {
  let sql = "SELECT a.id, concat(b.name, ' - ', c.name) as name"
  sql += " FROM sector_profesion a"
  sql += " INNER JOIN sectors b ON b.id = a.id_sector"
  sql += " INNER JOIN profesions c ON c.id = a.id_profesion"
  sql += " WHERE is_active = true"

  config.cnn.query(sql, (error, results) => {
    if (error) {
      logger.error('Error SQL:', error.sqlMessage)
      return response.status(500)
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
      return response.status(500)
    } 
    if (results.length > 0) {
      response.json(results)
    } else {
      response.send('Not results!')
    }
  })
})


const solicPrestBanisi = (id) => {

  let sql = ""
  sql += " SELECT a.id, fname, fname_2, lname, lname_2, id_personal, birthDate, loanPP, birthDate,"
  sql += " work_name, work_cargo, work_address, work_phone, work_prev_name, work_prev_month,"
  sql += " case when gender = 'female' then 'F' else 'M' end as gender,"
  sql += " salary, day(birthDate) as dia, month(birthDate) as mes, year(birthDate) as anio,"
  sql += " f.name as profesion, g.name as residenceType, residenceMonthly, k.name as civil_status,"
  sql += " h.name as province, i.name as district, j.name as county,"
  sql += " concat(barriada_edificio, ' Piso Casa: ', no_casa_piso_apto, ' Calle: ', calle) as barrio"
  sql += " FROM prospects a"
  sql += " LEFT JOIN profesions f ON f.id=a.profession"
  sql += " LEFT JOIN housings g ON g.id=a.residenceType"
  sql += " LEFT JOIN provinces h ON h.id=a.province"
  sql += " LEFT JOIN districts i ON i.id=a.district"
  sql += " LEFT JOIN counties j ON j.id=a.county"
  sql += " LEFT JOIN civil_status k ON k.id=a.civil_status"
  sql += " WHERE id_personal = ?"

  let sql2 = ""
  sql2 += "SELECT 1 as type, concat(name, ' ', apellido) as name, work_name, work_phonenumber, phonenumber, cellphone"
  sql2 += " FROM ref_person_family"
  sql2 += " WHERE id_prospect = ?"
  sql2 += " UNION ALL "
  sql2 += " SELECT 2 as type, concat(name, ' ', apellido) as name, work_name, work_phonenumber, phonenumber, cellphone"
  sql2 += " FROM ref_person_no_family"
  sql2 += " WHERE id_prospect = ?"

  let params = [id];

  return new Promise((resolve, reject) => {
    config.cnn.query(sql, params, (error, row) => {
      if (error) throw error
      if (Object.keys(row).length > 0) {
        params = [row[0].id, row[0].id];
        config.cnn.query(sql2, params, (error, row2) => {
          if (error) throw error
          const fileName = creaPDFBanisi(row[0], row2)
          resolve(fileName)
        })
      } else {
        console.log('No se generó Solicitud de Banisi.')
        reject("")
      }
    })
  })
}

const creaPDFBanisi = (row, row2) => {

  let gNames='.', g1Apellido='.', g2Apellido='.', gCedula='.', gNacFdd='.', gNacFmm='.', gNacFaaaa='.', gGenero='.', gEstadoCivil='.', gProfesion='.', gProv='.', gDist='.', gCorr='.', gBarrio='.',
  gTelRes='.', gCelular='.', gEmail='.', gTipoVivienda='.', gPagoVivienda='.', 
  gEmpLabora='.', gDirEmpLabora='.', gCargo='.', gTelEmpLab='.', gSalario='.',
  gEmpAnt='.', gEmpAntDir='', gEmpAntTel='', gEmpAntAnios='', gPais='.', gLoanSol='.', gProposito='.',
  
  gNamesC='', g1ApellidoC='', g2ApellidoC='', gCedulaC='', gNacFddC='', gNacFmmC='', gNacFaaaaC=''

  gNames = row.fname + ' ' + row.fname_2
  g1Apellido = row.lname, g2Apellido = row.lname_2
  gCedula = row.id_personal

  gGenero = row.gender
  gNacFdd = row.dia
  gNacFmm = row.mes
  gNacFaaaa = row.anio
  gTipoVivienda = row.residenceType
  gPagoVivienda = row.residenceMonthly

  gEmpLabora = row.work_name
  gCargo = row.work_cargo
  gDirEmpLabora = row.work_address
  gTelEmpLab = row.work_phone
  
  gEmpAnt = row.work_prev_name
  gEmpAntAnios = row.work_prev_month > 12 ? (row.work_prev_month/12).toFixed(0) : ''

  gEstadoCivil = row.civil_status
  gPais = row.nationality
  gProv = row.province
  gDist = row.district
  gCorr = row.county,

  gBarrio = row.barrio
  gSalario = separator(row.salary)

  gLoanSol = separator(row.loanPP)
  gProposito = row.reason

  let gNameRef1='.', gLTrabajoRef1='.', gTelResRef1='.', gTelOfiRef1='.', gCelRef1='.',
  gNameRef2='.', gLTrabajoRef2='.', gTelResRef2='.', gTelOfiRef2='.', gCelRef2='.',
  gNameRef3='.', gLTrabajoRef3='.', gTelResRef3='.', gTelOfiRef3='.', gCelRef3='.',
  gNameNRef='.', gLTrabajoNRef='.', gTelResNRef='.', gTelOfiNRef='.', gCelNRef='.'

  const refF = row2.filter(row => row.type === 1)
  const refNF = row2.filter(row => row.type === 2)

  if(refNF.length === 1) {
      gNameNRef = refNF[0].name, gLTrabajoNRef = refNF[0].work_name, gTelResNRef = refNF[0].phonenumber, gTelOfiNRef = refNF[0].work_phonenumber, gCelNRef = refNF[0].cellphone
  }
  if(refF.length === 1) {
      gNameRef1 = refF[0].name, gLTrabajoRef1 = refF[0].work_name, gTelResRef1 = refF[0].phonenumber, gTelOfiRef1 = refF[0].work_phonenumber, gCelRef1 = refF[0].cellphone
  }
  if(refF.length === 2) {
      gNameRef1 = refF[0].name, gLTrabajoRef1 = refF[0].work_name, gTelResRef1 = refF[0].phonenumber, gTelOfiRef1 = refF[0].work_phonenumber, gCelRef1 = refF[0].cellphone
      gNameRef1 = refF[1].name, gLTrabajoRef1 = refF[1].work_name, gTelResRef1 = refF[1].phonenumber, gTelOfiRef1 = refF[1].work_phonenumber, gCelRef1 = refF[1].cellphone
  }
  if(refF.length === 3) {
      gNameRef1 = refF[0].name, gLTrabajoRef1 = refF[0].work_name, gTelResRef1 = refF[0].phonenumber, gTelOfiRef1 = refF[0].work_phonenumber, gCelRef1 = refF[0].cellphone
      gNameRef1 = refF[1].name, gLTrabajoRef1 = refF[1].work_name, gTelResRef1 = refF[1].phonenumber, gTelOfiRef1 = refF[1].work_phonenumber, gCelRef1 = refF[1].cellphone
      gNameRef1 = refF[2].name, gLTrabajoRef1 = refF[2].work_name, gTelResRef1 = refF[2].phonenumber, gTelOfiRef1 = refF[2].work_phonenumber, gCelRef1 = refF[2].cellphone
  }

  const dd = {
    pageSize: 'LETTER',
    pageMargins: [20, 40, 20, 40],

    content: [
      {
        layout: 'noBorders',
        table: {
          widths: [130, 300, 50, '*'],
          body: [
            [{
              image: './public/images/banisi.png',
              width: 100,
              height: 20,
            },
            {
              text: 'SOLICITUD DE PRÉSTAMO PERSONAL',
              style: 'header'
            },
            {
              text: 'FECHA: ',
              style: { fontSize: 6, alignment: 'right' }
            },
            {
              text: (new Date()).toLocaleDateString(),
              style: 'small1'
            }]
          ]
        }
      },
      '\n',
      {
        table: {
          widths: [60, 180, 50, 97, 120],
          body: [
            [
              {
                text: 'MONTO DESEADO: ',
                border: [false, false, false, false],
                style: 'small1'
              },
              {
                text: gLoanSol,
                border: [false, false, false, true],
                style: 'small1'
              },
              { border: [false, false, false, false], text: '' },
              {
                text: 'PROPÓSITO DEL PRÉSTAMO: ',
                border: [false, false, false, false],
                style: 'small1'
              },
              {
                text: gProposito,
                border: [false, false, false, true],
                style: 'small1'
              }
            ]
          ]
        }
      },
      '\n',
      {
        table: {
          widths: [560],
          body: [  
            [{ style: 'blackGray', text: 'DATOS PERSONALES' }],
          ]
        }
      },
      {
        table: {
          widths: [180, 182, 180],
          body: [  
            [{ border: [true, false, false, true], style: 'small1hc', text: 'NOMBRES' }, { border: [true, false, false, true], style: 'small1hc', text: '1ER APELLIDO' }, { border: [true, false, true, true], style: 'small1hc', text: '2DO APELLIDO' }],
            [{ border: [true, false, false, true], style: 'small1c', text: gNames }, { border: [true, false, false, true], style: 'small1c', text: g1Apellido }, { border: [true, false, true, true], style: 'small1c', text: g2Apellido }],
            ]
        }
      },
      {
        table: {
          widths: [80, 91, 78, 95, 80, 23, 25, 25],
          body: [  
            [
              { border: [true, false, false, true], style: 'small1h', text: 'CÉDULA O PASAPORTE' }, { border: [true, false, false, true], style: 'small1c', text: gCedula },
              { border: [true, false, false, true], style: 'small1h', text: 'PAIS DE NACIMIENTO' }, { border: [true, false, false, true], style: 'small1c', text: gPais },
              { border: [true, false, false, true], style: 'small1h', text: 'FECHA DE NACIMIENTO' }, { border: [true, false, false, true], style: 'small1c', text: gNacFdd },  { border: [true, false, false, true], style: 'small1c', text: gNacFmm },  { border: [true, false, true, true], style: 'small1c', text: gNacFaaaa }, 
            ],
            ]
        }
      },
      {
        table: {
          widths: [94, 15, 18, 15, 54, 68, 72, 15, 46, 82],
          body: [  
            [
              { border: [true, false, false, true], style: 'small1h', text: 'AÑOS RESIDE EN PANAMÁ' }, { border: [true, false, false, true], style: 'small1c', text: '' },
              { border: [true, false, false, true], style: 'small1h', text: 'SEXO' }, { border: [true, false, false, true], style: 'small1c', text: gGenero },
              { border: [true, false, false, true], style: 'small1h', text: 'ESTADO CIVIL' }, { border: [true, false, false, true], style: 'small1c', text: gEstadoCivil },  
              { border: [true, false, false, true], style: 'small1h', text: 'NO. DEPENDIENTES' }, { border: [true, false, false, true], style: 'small1c', text: '' },  
              { border: [true, false, false, true], style: 'small1h', text: 'PROFESIÓN' }, { border: [true, false, true, true], style: 'small1c', text: gProfesion },  
            ],
            ]
        }
      },
      {
        table: {
          widths: [93, 100, 140, 200],
          body: [  
            [{ border: [true, false, false, true], style: 'small1hc', text: 'PROVINCIA' }, { border: [true, false, false, true], style: 'small1hc', text: 'DISTRITO' }, { border: [true, false, false, true], style: 'small1hc', text: 'BARRIO CORREGIMIENTO' }, { border: [true, false, true, true], style: 'small1hc', text: 'DIRECCIÓN RESIDENCIAL' }],
            [{ border: [true, false, false, true], style: 'small1c', text: gProv }, { border: [true, false, false, true], style: 'small1c', text: gDist }, { border: [true, false, false, true], style: 'small1c', text: gCorr }, { border: [true, false, true, true], style: 'small1c', text: gBarrio }],
            ]
        }
      },
      {
        table: {
          widths: [80, 60, 68, 60, 77, 170],
          body: [  
            [
              { border: [true, false, false, true], style: 'small1h', text: 'TELÉFONO RESIDENCIAL' }, { border: [true, false, false, true], style: 'small1c', text: gTelRes },
              { border: [true, false, false, true], style: 'small1h', text: 'TELÉFONO CELULAR' }, { border: [true, false, false, true], style: 'small1c', text: gCelular },
              { border: [true, false, false, true], style: 'small1h', text: 'CORREO ELECTRÓNICO' }, { border: [true, false, true, true], style: 'small1c', text: gEmail },  
            ],
            ]
        }
      },
      {
        table: {
          widths: [93, 80, 100, 200, 51],
          body: [  
            [
              { border: [true, false, false, true], style: 'small1hc', text: 'TIPO DE VIVIENDA' }, { border: [true, false, false, true], style: 'small1c', text: gTipoVivienda }, { border: [false, false, false, true], style: 'small1', text: 'Mensualidad $ ' + gPagoVivienda }, 
              { border: [true, false, false, true], style: 'small1hc', text: 'TIEMPO EN RESIDENCIA ACTUAL' }, { border: [true, false, true, true], style: 'small1c', text: '' },
            ],
          ]
        }
      },

      {
        table: {
          widths: [560],
          body: [  
            [{ border: [true, false, true, true], style: 'blackGray', text: 'INFORMACIÓN DE SU CONYUGE' }],
          ]
        }
      },
      {
        table: {
          widths: [180, 182, 180],
          body: [  
            [{ border: [true, false, false, true], style: 'small1hc', text: 'NOMBRES' }, { border: [true, false, false, true], style: 'small1hc', text: '1ER APELLIDO' }, { border: [true, false, true, true], style: 'small1hc', text: '2DO APELLIDO' }],
            [{ border: [true, false, false, true], style: 'small1c', text: gNamesC }, { border: [true, false, false, true], style: 'small1c', text: g1ApellidoC }, { border: [true, false, true, true], style: 'small1c', text: g2ApellidoC }],
            ]
        }
      },
      {
        table: {
          widths: [80, 91, 78, 95, 80, 23, 25, 25],
          body: [  
            [
              { border: [true, false, false, true], style: 'small1h', text: 'CÉDULA O PASAPORTE' }, { border: [true, false, false, true], style: 'small1c', text: gCedulaC },
              { border: [true, false, false, true], style: 'small1h', text: 'PAIS DE NACIMIENTO' }, { border: [true, false, false, true], style: 'small1c', text: '.\n.\n' },
              { border: [true, false, false, true], style: 'small1h', text: 'FECHA DE NACIMIENTO' }, { border: [true, false, false, true], style: 'small1c', text: 'DIA\n'+gNacFddC },  { border: [true, false, false, true], style: 'small1c', text: 'MES\n'+gNacFmmC },  { border: [true, false, true, true], style: 'small1c', text: 'AÑO\n'+gNacFaaaaC }, 
            ],
            ]
        }
      },
      {
        table: {
          widths: [118, 125, 140, 150],
          body: [  
            [{ border: [true, false, false, true], style: 'small1hc', text: 'LUGAR DE TRABAJO' }, { border: [true, false, false, true], style: 'small1hc', text: 'DIRECCIÓN DE LA EMPRESA' }, { border: [true, false, false, true], style: 'small1hc', text: 'TELÉFONO OFICINA' }, { border: [true, false, true, true], style: 'small1hc', text: 'TELÉFONO o CELULAR' }],
            [{ border: [true, false, false, true], style: 'small1c', text: '.' }, { border: [true, false, false, true], style: 'small1c', text: '' }, { border: [true, false, false, true], style: 'small1c', text: '' }, { border: [true, false, true, true], style: 'small1c', text: '' }],
            ]
        }
      },

      {
        table: {
          widths: [560],
          body: [  
            [{ border: [true, false, true, true], style: 'blackGray', text: 'REFERENCIAS PERSONALES' }],
          ]
        }
      },
      {
        table: {
          widths: [560],
          body: [  
            [{ border: [true, false, true, true], style: 'small1h', text: 'NO PARIENTES' }],
          ]
        }
      },
      {
        table: {
          widths: [120, 140, 95, 85, 84],
          body: [  
            [{ border: [true, false, false, true], style: 'small1hc', text: 'NOMBRE COMPLETO' }, { border: [true, false, false, true], style: 'small1hc', text: 'LUGAR DE TRABAJO' }, { border: [true, false, false, true], style: 'small1hc', text: 'TELÉEFONO RESIDENCIAL' }, { border: [true, false, false, true], style: 'small1hc', text: 'TELÉFONO OFICINA' }, { border: [true, false, true, true], style: 'small1hc', text: 'TELÉFONO CELULAR' }],
            [{ border: [true, false, false, true], style: 'small1c', text: gNameRef1 }, { border: [true, false, false, true], style: 'small1c', text: gLTrabajoRef1 }, { border: [true, false, false, true], style: 'small1c', text: gTelResRef1 }, { border: [true, false, false, true], style: 'small1c', text: gTelOfiRef1 }, { border: [true, false, true, true], style: 'small1c', text: gCelRef1 }],
            [{ border: [true, false, false, true], style: 'small1c', text: gNameRef2 }, { border: [true, false, false, true], style: 'small1c', text: gLTrabajoRef2 }, { border: [true, false, false, true], style: 'small1c', text: gTelResRef2 }, { border: [true, false, false, true], style: 'small1c', text: gTelOfiRef2 }, { border: [true, false, true, true], style: 'small1c', text: gCelRef2 }],
            [{ border: [true, false, false, true], style: 'small1c', text: gNameRef3 }, { border: [true, false, false, true], style: 'small1c', text: gLTrabajoRef3 }, { border: [true, false, false, true], style: 'small1c', text: gTelResRef3 }, { border: [true, false, false, true], style: 'small1c', text: gTelOfiRef3 }, { border: [true, false, true, true], style: 'small1c', text: gCelRef3 }],
            ]
        }
      },
      {
        table: {
          widths: [560],
          body: [  
            [{ border: [true, false, true, true], style: 'small1h', text: 'PARIENTE CERCANO QUE NO VIVA CON USTED' }],
          ]
        }
      },
      {
        table: {
          widths: [120, 140, 95, 85, 84],
          body: [  
            [{ border: [true, false, false, true], style: 'small1hc', text: 'NOMBRE COMPLETO' }, { border: [true, false, false, true], style: 'small1hc', text: 'LUGAR DE TRABAJO' }, { border: [true, false, false, true], style: 'small1hc', text: 'TELÉEFONO RESIDENCIAL' }, { border: [true, false, false, true], style: 'small1hc', text: 'TELÉFONO OFICINA' }, { border: [true, false, true, true], style: 'small1hc', text: 'TELÉFONO CELULAR' }],
            [{ border: [true, false, false, true], style: 'small1c', text: gNameNRef }, { border: [true, false, false, true], style: 'small1c', text: gLTrabajoNRef }, { border: [true, false, false, true], style: 'small1c', text: gTelResNRef }, { border: [true, false, false, true], style: 'small1c', text: gTelOfiNRef }, { border: [true, false, true, true], style: 'small1c', text: gCelNRef }],
            ]
        }
      },

      {
        table: {
          widths: [560],
          body: [  
            [{ border: [true, false, true, true], style: 'blackGray', text: 'INFORMACIÓN LABORAL' }],
          ]
        }
      },
      {
        table: {
          widths: [85, 159, 114, 175],
          body: [  
            [
              { border: [true, false, false, true], style: 'small1h', text: 'EMPRESA DONDE LABORA' }, { border: [true, false, false, true], style: 'small1c', text: gEmpLabora },
              { border: [true, false, false, true], style: 'small1h', text: 'CIUDAD Y DIRECCIÓN DE LA EMPRESA' }, { border: [true, false, true, true], style: 'small1c', text: gDirEmpLabora },
            ],
            ]
        }
      },
      {
        table: {
          widths: [80, 90, 62, 80, 60, 45, 40, 40],
          body: [  
            [
              { border: [true, false, false, true], style: 'small1h', text: 'ACTIVIDAD DE LA EMPRESA' }, { border: [true, false, false, true], style: 'small1c', text: '' },
              { border: [true, false, false, true], style: 'small1h', text: 'CARGO O POSICIÓN' }, { border: [true, false, false, true], style: 'small1c', text: gCargo },
              { border: [true, false, false, true], style: 'small1h', text: 'FECHA DE INGRESO' }, { border: [true, false, false, true], style: 'small1c', text: '' }, 
              { border: [true, false, false, true], style: 'small1h', text: 'TELÉFONOS' }, { border: [true, false, true, true], style: 'small1c', text: gTelEmpLab },
            ],
            ]
        }
      },
      {
        table: {
          widths: [100, 110, 75, 95, 55, 80],
          body: [  
            [
              { border: [true, false, false, true], style: 'small1h', text: 'DEPARTAMENTO DONDE LABORA' }, { border: [true, false, false, true], style: 'small1c', text: '' },
              { border: [true, false, false, true], style: 'small1h', text: 'INGRESO MENSUAL' }, { border: [true, false, false, true], style: 'small1c', text: gSalario },
              { border: [true, false, false, true], style: 'small1h', text: 'SALARIO BASE' }, { border: [true, false, true, true], style: 'small1c', text: '' }, 
            ],
            ]
        }
      },
      {
        table: {
          widths: [347, 95, 100],
          body: [  
            [
              { border: [true, false, false, true], 
                table: {
                  widths: [75, 10, 4, 10, 4, 15, 30, '*'],
                  body: [  
                    [
                      { border: [false, false, false, false], style: 'small1h', text: 'TIENES OTROS INGRESOS:' },
                      { border: [false, false, false, false], style: 'small1h', text: 'SI' },
                      { style: 'small1', text: '' },
                      { border: [false, false, false, false], style: 'small1h', text: 'NO' },
                      { style: 'small1', text: '' },{ border: [false, false, false, false],  text: '' },
                      { border: [false, false, false, false], style: 'small1h', text: 'DETALLE:' }, { border: [false, false, false, false], style: 'small1', text: '' },
                    ],
                  ]
                }
              },
              { border: [true, false, false, true], style: 'small1h', text: 'MONTO DE OTROS INGRESOS' }, { border: [true, false, true, true], style: 'small1c', text: '' },
            ],
            ]
        }
      },
      {
        table: {
          widths: [228, 115, 110, 80],
          body: [  
            [{ border: [true, false, false, true], style: 'small1h', text: 'EMPLEO ANTERIOR (SI TIENE MENOS DE DOS AÑOS EN EL EMPLEO ACTUAL)' }, { border: [true, false, false, true], style: 'small1hc', text: 'DIRECCIÓN DE EMPLEO ANTERIOR' }, { border: [true, false, false, true], style: 'small1hc', text: 'TELÉFONO DE EMPLEO ANTERIOR' }, { border: [true, false, true, true], style: 'small1hc', text: 'AÑOS TRABAJADOS' }],
            [{ border: [true, false, false, true], style: 'small1c', text: gEmpAnt }, { border: [true, false, false, true], style: 'small1c', text: gEmpAntDir }, { border: [true, false, false, true], style: 'small1c', text: gEmpAntTel }, { border: [true, false, true, true], style: 'small1c', text: gEmpAntAnios }],
            ]
        }
      },

      {
        table: {
          widths: [560],
          body: [  
            [{ border: [true, false, true, true], style: 'blackGray', text: 'PERSONAS POLITICAMENTE EXPUESTAS (PEP)' }],
          ]
        }
      },
      {
        table: {
          widths: [560],
          body: [  
            [{ border: [true, false, true, true], style: 'small1', 
              table: {
                widths: ['auto', 10, 4, 10, 4],
                body: [  
                  [
                    { border: [false, false, false, false], style: 'small1h', text: '¿ES USTED O ALGÚN FAMILIAR CERCANO POLÍTICO Y/O DE ALGÚN ÓRGANO DE ESTADO DE SU PAÍS?' },
                    { border: [false, false, false, false], style: 'small1h', text: 'SI' },
                    { style: 'small1', text: '' },
                    { border: [false, false, false, false], style: 'small1h', text: 'NO' },
                    { style: 'small1', text: '' },
                  ],
                ]
              }
            }],
          ]
        }
      },
      {
        table: {
          widths: [140, 120, 40, 115, 30, 70],
          body: [  
            [
              { border: [true, false, false, true], style: 'small1h', text: 'SI MARCÓ SI, ESPECIFIQUE CARGO DESEMPEÑADO' }, { border: [true, false, false, true], style: 'small1c', text: '' },
              { border: [true, false, false, true], style: 'small1h', text: 'INSTITUCIÓN' }, { border: [true, false, false, true], style: 'small1c', text: '' },
              { border: [true, false, false, true], style: 'small1h', text: 'PERÍODO' }, { border: [true, false, true, true], style: 'small1c', text: '' }, 
            ],
            ]
        }
      },
      {
        table: {
          widths: [560],
          heights: [20],
          body: [  
            [{ border: [true, false, true, true], style: 'small1h', text: '\n¿ES USTED SOCIO, CÓNYUGE O FAMILIAR CONSANGUÍNEO O POR AFINIDAD HASTA EL CUARTO GRADO DE UN PEP NACIONAL O EXTRANJERO?' }],
          ]
        }
      },
      {
        table: {
          widths: [77, 95, 86, 86, 86, 85],
          body: [  
            [
              { border: [true, false, false, true], style: 'small1h',  text: '\nSi marcó SI,\nindicar parentesco:' },
              { border: [true, false, false, true], style: 'small1c', 
                table: {
                  widths: [3, 81],
                  body: [  
                    [
                      { border: [false, false, false, false], text: '' },
                      { border: [false, false, false, false], rowSpan: 3, text: 'Familiar consanguíneo (padres, hijos, hermanos, tíos, primos, abuelos, nietos)' } 
                    ],
                    [{ style: 'small1', text: '.' }, { border: [false, false, false, false], text: '' }],
                    [{ border: [false, false, false, false], text: '' }, { border: [false, false, false, false], text: '' }],
                  ]
                }
              },
              { border: [true, false, false, true], style: 'small1c', 
                table: {
                  widths: [3, 75],
                  body: [  
                    [
                      { border: [false, false, false, false], text: '' },
                      { border: [false, false, false, false], rowSpan: 3, text: 'Familiar por afinidad (cónyuge, suegros, cuñados)' } 
                    ],
                    [{ text: '.' }, { border: [false, false, false, false], text: '' }],
                    [{ border: [false, false, false, false], text: '' }, { border: [false, false, false, false], text: '' }],
                  ]
                }
              },
              { border: [true, false, false, true], style: 'small1c', 
                table: {
                  widths: [3, 80],
                  body: [  
                    [
                      { border: [false, false, false, false], text: '' },
                      { border: [false, false, false, false], rowSpan: 3, text: 'Socios comerciales' } 
                    ],
                    [{ text: '.' }, { border: [false, false, false, false], text: '' }],
                    [{ border: [false, false, false, false], text: '' }, { border: [false, false, false, false], text: '' }],
                  ]
                }
              },
              { border: [true, false, false, true], style: 'small1c', 
                table: {
                  widths: [3, 70],
                  body: [  
                    [
                      { border: [false, false, false, false], text: '' },
                      { border: [false, false, false, false], rowSpan: 3, text: 'Negocios/compañías en las cuales posee acciones' } 
                    ],
                    [{ text: '.' }, { border: [false, false, false, false], text: '' }],
                    [{ border: [false, false, false, false], text: '' }, { border: [false, false, false, false], text: '' }],
                  ]
                }
              },
              { border: [true, false, true, true], style: 'small1c', 
                table: {
                  widths: [3, 80],
                  body: [  
                    [
                      { border: [false, false, false, false], text: '' },
                      { border: [false, false, false, false], rowSpan: 3, text: 'Colaboradores\ncercanos' } 
                    ],
                    [{ text: '.' }, { border: [false, false, false, false], text: '' }],
                    [{ border: [false, false, false, false], text: '' }, { border: [false, false, false, false], text: '' }],
                  ]
                }
              },
            ],
            ]
        }
      },
      {
        table: {
          widths: [167, 175, 200],
          body: [  
            [{ border: [true, false, false, true], style: 'small1hc', text: 'NOMBRE DEL PEP CON EL QUE TIENE RELACIÓN' }, { border: [true, false, false, true], style: 'small1hc', text: 'PUESTO A CARGO DEL PEP' }, { border: [true, false, true, true], style: 'small1hc', text: 'INSTITUCIÓN O DEPENDENCIA DONDE LABORA' }],
            [{ border: [true, false, false, false], style: 'small1c', text: '.' }, { border: [true, false, false, false], style: 'small1c', text: '' }, { border: [true, false, true, false], style: 'small1c', text: '' }],
            ]
        }
      },

      {
        table: {
          widths: [560],
          body: [  
            [{ pageBreak: 'before', style: 'blackGray', text: 'CERTIFICACIÓN US PERSON' }],
          ]
        }
      },
      {
        table: {
          widths: [280, 271],
          body: [  
            [
              { border: [true, false, true, false], style: 'small1c', 
                table: {
                  widths: [140, 140],
                  body: [  
                    [
                      { border: [false, false, false, false], style: 'small1hc', text: '¿TIENE USTED UNA SEGUNDA NACIONALIDAD?' },
                      { border: [false, false, false, false], style: 'small1h', text: 'En caso afirmativo indique el país:' },
                    ],
                  ]
                }
              },
              { border: [true, false, true, false], style: 'small1', 
                table: {
                  widths: [180, 15, 4, 15, 4],
                  body: [  
                    [
                      { border: [false, false, false, false], style: 'small1h', text: '¿ES USTED UNA PERSONA DE LOS EE.UU. O US PERSON?' },
                      { border: [false, false, false, false], style: { fontSize: 6, alignment: 'right' }, text: 'SI' },
                      { style: 'small1', text: '' },
                      { border: [false, false, false, false], style: { fontSize: 6, alignment: 'right' }, text: 'NO' },
                      { style: 'small1', text: '' },
                    ],
                  ]
                }
              }
            ],
            [ 
              { border: [true, false, true, false], style: 'small1', 
                table: {
                  widths: [40, 4, 20, 4, 40, 110],
                  body: [   
                    [
                      { border: [false, false, false, false], style: { fontSize: 6, alignment: 'right' }, text: 'SI' },
                      { style: 'small1', text: '' },
                      { border: [false, false, false, false], style: { fontSize: 6, alignment: 'right' }, text: 'NO' },
                      { style: 'small1', text: '' },
                      { border: [false, false, false, false], style: 'small1', text: '' },
                      { border: [false, false, false, true], style: 'small1', text: '' },
                    ]
                  ]
                }
              },
              { border: [true, false, true, false], style: 'small1', 
                table: {
                  widths: [180, 15, 4, 15, 4],
                  body: [  
                    [
                      { border: [false, false, false, false], style: 'small1h', text: '¿TIENE OBLIGACIÓN TRIBUTARIA EN OTRO PAÍS?' },
                      { border: [false, false, false, false], style: { fontSize: 6, alignment: 'right' }, text: 'SI' },
                      { style: 'small1', text: '' },
                      { border: [false, false, false, false], style: { fontSize: 6, alignment: 'right' }, text: 'NO' },
                      { style: 'small1', text: '' },
                    ],
                  ]
                }
              }
            ],
            [ 
              { border: [true, false, true, false], text: '' },
              { border: [true, false, true, false], style: 'small1', 
                table: {
                  widths: [30, 150],
                  body: [   
                    [
                      { border: [false, false, false, false], style: 'small1h', text: '¿CUÁL?' }, 
                      { border: [false, false, false, true], style: 'small1', text: '' },
                    ]
                  ]
                }
              }
            ],
          ]
        }
      },
      {
        table: {
          widths: [280, 271],
          body: [  
            [
              { border: [true, false, true, true], style: 'small1', text: '' },
              { border: [true, false, true, true], style: 'small1', text: '' }
            ],
          ]
        }
      },

      {
        table: {
          widths: [560],
          body: [  
            [{ border: [true, false, true, true], style: 'blackGray', text: 'SOLICITUD Y SUMINISTRO DE INFORMACIÓN' }],
            [{ border: [true, false, true, true], style: { fontSize: 6, alignment: 'justify' }, text: 'Autorizo(amos) expresamente a BANISI, S.A., sus subsidiarias y/o afiliadas, cesionarios o sucesores, así como a cualquier compañía que por operación de cesión, administración o compra de cartera adquiera los derechos de mi (nuestro) crédito, a que de conformidad con lo expresado en el Artículo 24 y demás disposiciones aplicables de la Ley 24 del 22 de mayo de 2002, en cualquier momento solicite, consulte, recopile, intercambie, actualice y transmita a cualquier agencia de información de datos, bancos, instituciones financieras o agentes económicos, sean locales o del extranjero, públicos (as) o privados (as) informaciones relacionadas con obligaciones o transacciones crediticias que he (mos) mantenido, mantengo(mantenemos) o pudiera (mos) mantener con dicha entidad, BANISI, S.A., sus subsidiarias y/o afiliadas, cesionarios o sucesores sobre mi(nuestro) historial de crédito y relaciones con acreedores. También queda facultado BANISI, S.A. sus subsidiarias y/o afiliadas, cesionarios o sucesores, así como cualquier compañía que por una operación de cesión, administración o compra de cartera, adquiera los derechos de mi (nuestro) crédito, a que solicite y obtenga información de instituciones gubernamentales relacionadas con las obligaciones o transacciones crediticias arriba mencionadas. Así mismo, exonero(amos) de cualquier consecuencia o responsabilidad resultante del ejercicio de solicitar o suministrar información, o por razones de cualquiera autorizaciones contenidas en el presente documento a BANISI, S.A. a sus compañías filiadas, subsidiarias, cesionarias y/o sucesores a sus empleados, ejecutivos, directores, dignatarios o apoderados así como a cualquier compañía que por una operación de cesión administración o compra de cartera adquiera los derechos de mi (nuestro) crédito. QUEDA ENTENDIDO QUE BANISI, S.A. SUMINISTRARÁ A REQUERIMIENTO DEL INTERESADO TODA INFORMACIÓN CREDITICIA RECOPILADA EN BASE A LA PRESENTE AUTORIZACIÓN.' }],
          ]
        }
      },

      {
        table: {
          widths: [560],
          body: [  
            [{ border: [true, false, true, true],  style: 'blackGray', text: 'AUTORIZACIÓN PARA CONSULTA Y REPORTE DE REFERENCIAS DE CRÉDITO' }],
            [{ border: [true, false, true, false], style: { fontSize: 6, alignment: 'justify' }, text: 'Por este medio autorizo expresamente a APC BURÓ, S.A., para que, de conformidad con lo expresado en el artículo 24 y demás disposición aplicables de la Ley 24 y 22 de mayo de 2002, solicite, recopile, intercambie y transmita a cualquier agencia de información de datos, bancos o   agentes   económicos   informaciones   relacionadas con obligaciones o transacciones crediticias que mantengo o pudiera mantener con dichos agentes económicos de la localidad, sobre mi historial de crédito así como el de la empresa que represento.' }],
            [{ border: [true, false, true, false], style: { fontSize: 6, alignment: 'justify' }, text: 'APC BURÓ queda autorizada a incluir en mi reporte de historial de crédito cualquier dato personal para prevenir el fraude de identidad, incluyendo sin limitar, aquellos de los que trata el numeral 6 del Artículo 30 de la Ley 24 de 2002, así como también para aplicar los procedimientos científicos necesarios a las referencias de crédito descritas anteriormente, a fin de proporcionar el score del buró con relación a mis referencias.' }],
            [{ border: [true, false, true, true],  style: { fontSize: 6, alignment: 'justify' }, text: 'Así mismo, se autoriza a APC BURÓ, S.A. a consultar el Sistema de Verificación de Identidad (SVI) del Tribunal Electoral con el objetivo de validación de mis datos de identificación.' }],
          ]
        }
      },

      {
        table: {
          widths: [560],
          body: [  
            [{ border: [true, false, true, true], style: 'blackGray', text: 'REGLAMENTO DE SERVICIOS BANCARIOS' }],
            [{ border: [true, false, true, true], style: { fontSize: 6, alignment: 'justify' }, text: 'Por este medio manifiesto haber leído en su totalidad el REGLAMENTO DE SERVICIOS BANCARIOS que se encuentra expuesto en la Página Web de Banisi, S.A. www.banisipanama.com por el cual estoy obligado a cumplir todos los términos y condiciones acordados en el mismo.' }],
            [{ border: [true, true, true, true],  style: { fontSize: 6, alignment: 'justify' }, text: 'Acepto que el Banco utilice la información proporcionada en este formulario para afiliarme a los servicios de Banca en Línea, Banca Móvil y los cargos que estos generen.' }],
          ]
        }
      },

      {
        table: {
          widths: [560],
          body: [  
            [{ border: [true, false, true, true],  style: 'blackGray', text: 'FIRMA DEL SOLICITANTE' }],
            [{ border: [true, false, true, false], style: { fontSize: 6, alignment: 'justify' }, text: 'Reconozco que los datos obtenidos por cualquier central de información así como los proporcionados por mí en esta Solicitud de Crédito que he presentado, serán certificados y sometidos a la evualuación respectiva, por lo que será potestad exclusiva de BANISI, S.A. la aprobación o negación de la operación solicitada sin que esto dé lugar a reclamo alguno de mi parte. Confirmo haber leído, llenado y aceptado voluntariamente la información contenida en esta Solicitud de Crédito.' }],
            [{ border: [true, false, true, false], style: { fontSize: 6, alignment: 'justify' }, text: 'Declaro y certifico que los datos que anteceden son verídicos.' }],
            [{ border: [true, false, true, false],  style: { alignment: 'center' }, 
              table: {
                widths: [280, 280],
                heights: [80],
                body: [  
                  [
                    { border: [false, false, false, false], style: 'small1', text: '.' },
                    { border: [false, false, false, false], style: 'small1', text: '.' }
                  ],
                ]
              }
            }],
            [{ border: [true, false, true, false],  style: { alignment: 'center' }, 
              table: {
                widths: [50, 200, 50, 200, 50],
                heights: [20],
                body: [  
                  [
                    { border: [false, false, false, false], text: '' },
                    { border: [false, true, false, false], style: 'small1h', text: 'Firma del Solicitante (igual que en la cédula)' },
                    { border: [false, false, false, false], text: '' },
                    { border: [false, true, false, false], style: 'small1h', text: 'No. de cédula del Solicitante' },
                    { border: [false, false, false, false], text: '' },
                  ],
                ]
              }
            }],
          ]
        }
      },

      {
        table: {
          widths: [560],
          body: [  
            [{ border: [true, true, true, true], style: 'blackGray', text: 'APERTURA DE CUENTA DE AHORROS (Perfil transaccional hasta B/.10,000.00)' }],
            [{ border: [true, false, true, false], style: { fontSize: 6, alignment: 'justify' }, text: 'Por este medio autorizo la apertura de una Cuenta de Ahorros Individual, por medio de transferencia local o efectivo. Declaro que los fondos con que se nutrirá la cuenta, serán originados por salario, negocio propio, ahorro, independiente o herencia. También autorizo el Débito Automatico para el pago de préstamos y tarjeta de crédito. Acepto que esta Cuenta de Ahorros venga con una Tarjeta Débito CLAVE y los cargos que esta genere.' }],
          ]
        }
      },

      {
        table: {
          widths: [560],
          body: [  
            [{ border: [true, true, true, true], style: 'blackGray', text: 'REGISTRO DE FIRMAS (CUENTA DE AHORROS)' }],
          ]
        }
      },
      {
        table: {
          widths: [275, 276],
          heights: [120],
          body: [  
            [
              { border: [true, false, false, true], text: '.' },
              { border: [true, false, true, true], text: '.' }
            ],
          ]
        }
      },

      {
        table: {
          widths: [560],
          body: [  
            [{ border: [true, false, true, true], style: 'blackGray', text: 'PARA USO EXCLUSIVO DEL BANCO' }],
          ]
        }
      },
      {
        table: {
          widths: [60, 491],
          heights: [20],
          body: [  
            [{ border: [true, false, true, true], style: 'small1c', text: '\nATENDIDO POR' }, {border: [true, false, true, true], text: ''}],
          ]
        }
      },
    ],
    styles: {
      header: {
        fontSize: 12,
        bold: true,
        alignment: 'center',
        color: 'white',
        fillColor: '#001c00',
      },
      subheader: {
        fontSize: 10,
        bold: true
      },
      quote: {
        italics: true
      },
      small0: {
        fontSize: 7,
        fillColor: '#dddddd',
      },
      small1h: {
        fontSize: 6,
      },
      small1hc: {
        fontSize: 6,
        alignment: 'center',
      },
      small1: {
        fontSize: 6,
        bold: true
      },
      small1c: {
        fontSize: 6,
        alignment: 'center',
        bold: true
      },
      small: {
        fontSize: 7,
        fillColor: '#eeeeee',
      },
      blueWhite: {
        fillColor: '#00007b',
        color: 'white',
        fontSize: 8,
        bold: true
      },
      blackGray: {
        fillColor: '#D1D1D1',
        fontSize: 7,

      },
      center: {
        alignment: 'center'
      },
      right: {
        alignment: 'right'
      }
    }
  }

  var fonts = {
    Roboto: {
        normal: './public/fonts/Roboto-Regular.ttf',
        bold: './public/fonts/Roboto-Medium.ttf',
        italics: './public/fonts/Roboto-Italic.ttf',
        bolditalics: './public/fonts/Roboto-MediumItalic.ttf'
    }
  };

  let fileName = path.join(`./pdfs/tmp-pdf-${Date.now()}.pdf`)

  const printer = new pdfPrinter(fonts)
  var pdfDoc = printer.createPdfKitDocument(dd);
  pdfDoc.pipe(fs.createWriteStream(fileName)).on('finish',function(){
      //success
  });
  pdfDoc.end();

  return fileName
}

module.exports = appRoutes