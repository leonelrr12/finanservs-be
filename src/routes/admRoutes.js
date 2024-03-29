const admRoutes = require('express').Router()
const config = require('../utils/config')
const logger = require('../utils/logger')


admRoutes.get('/', async(request, response) => {
  const ruta = await config.redirectRuta("6300")
  response.send('Hola Mundo!!! (adm) Desde Admin Routes ' + ruta )
})


admRoutes.post('/prospects', async(request, response) => {
  let sql = "INSERT INTO prospects ("
  sql += " id_personal,id_referido,idUser,name,fname,fname_2,lname,lname_2,"
  sql += " entity_f,estado,email,cellphone,phoneNumber,idUrl,socialSecurityProofUrl,"
  sql += " publicGoodProofUrl,workLetterUrl,payStubUrl,origin_idUser,gender,birthDate,"
  sql += " contractType,jobSector,occupation,paymentFrecuency,profession,"
  sql += " civil_status,province,district,county,sign,"
  sql += " loanPP,loanAuto,loanTC,loanHip,cashOnHand,plazo,apcReferenceUrl,apcLetterUrl,"

  sql += " residenceType,residenceMonthly,work_name,work_cargo,work_address,work_phone,work_phone_ext,work_month,"
  sql += " work_prev_name,work_prev_month,work_prev_salary,"
  sql += " salary,honorarios,viaticos,termConds,"
  sql += " weight, weightUnit, height, heightUnit, aceptaApc, nationality,"
  sql += " calle, barriada_edificio,no_casa_piso_apto,id_agente,reason"

  sql += ") VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,"
  sql += "?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)"

  let { id_personal,idUser,apcReferencesUrl,apcLetterUrl,sponsor,name,fname,fname_2,lname,lname_2 } = request.body
  let { entity_f,email,cellphone,phoneNumber,idUrl,socialSecurityProofUrl,publicGoodProofUrl } = request.body
  let { workLetterUrl,payStubUrl,origin_idUser,gender,birthDate: BDH,contractType,jobSector,occupation,paymentFrecuency } = request.body
  let { profession,civil_status,province,district,county,sign } = request.body
  let { street: calle, barriada_edificio, no_casa_piso_apto } = request.body
  let { loanPP,loanAuto,loanTC,loanHip,cashOnHand,plazo,reason } = request.body
   
  let { residenceType,residenceMonthly,work_name,work_cargo,work_address='',work_phone='',work_phone_ext='',work_month = 0} = request.body
  let { work_prev_name='N/A',work_prev_month=0,work_prev_salary=0 } = request.body
  let { salary,honorarios=0,viaticos=0,termConds,nationality=0 } = request.body
  let { weight, weightUnit, height, heightUnit, aceptaAPC: aceptaApc } = request.body

  estado = 1 // Nuevo registro queda con estatus de nuevo
  entity_f = await config.redirectRuta(entity_f)

  const birthDate = BDH.slice(0,10)
  const params = [
    id_personal,sponsor,idUser,name,fname,fname_2,lname,lname_2,entity_f,estado,email,cellphone,
    phoneNumber,idUrl,socialSecurityProofUrl,publicGoodProofUrl,workLetterUrl,payStubUrl,origin_idUser,gender,
    birthDate,contractType,jobSector,occupation,paymentFrecuency,profession,civil_status,province,
    district,county,sign,loanPP,loanAuto,loanTC,loanHip,cashOnHand,plazo,apcReferencesUrl,apcLetterUrl,
    residenceType,residenceMonthly,work_name,work_cargo,work_address,work_phone,work_phone_ext,work_month,
    work_prev_name,work_prev_month,work_prev_salary,
    salary,honorarios,viaticos,termConds,
    weight, weightUnit, height, heightUnit, aceptaApc, nationality,
    calle, barriada_edificio, no_casa_piso_apto,config.ORIGEN.agente,reason
  ]

  config.cnn.query(sql, params, (error, results, next) => {
    if (error) {
      logger.error('Error SQL:', error.sqlMessage)
      return response.status(500)
    } 
    // console.log('results', results, results.insertId)
    // console.log({ newId: results.insertId })
    response.json({ newId: results.insertId })
  })
})


admRoutes.post('/ref_personales', (request, response) => {

  let { tipo,name,id_prospect,apellido,parentesco,cellphone,phonenumber,work_name,work_phonenumber,work_phone_ext } = request.body

  let sql = "INSERT INTO ref_person_family ("
  if(tipo==="0") {
    sql = "INSERT INTO ref_person_no_family ("
  }
  sql += " name,id_prospect,apellido,parentesco,cellphone,phonenumber,work_name,work_phonenumber,work_phone_ext"
  sql += ") VALUES (?,?,?,?,?,?,?,?,?)"

  const params = [
    name,id_prospect,apellido,parentesco,cellphone,
    phonenumber,work_name,work_phonenumber,work_phone_ext
  ]

  config.cnn.query(sql, params, (error, results, next) => {
    if (error) {
      logger.error('Error SQL:', error.sqlMessage)
      return response.status(500)
    } 
    console.log('results',results)
    response.send('Ok!')
  })
})


admRoutes.get('/prospects/aproach/:id_personal', (request, response) => {
  let sql = "select a.id,	id_personal, idUser, a.name, fname, fname_2, lname,"
  sql += " lname_2, b.name as entity, email ,a.cellphone,	phoneNumber,"
  sql += " idUrl as imag_id, socialSecurityProofUrl as 'Ficha Seguro Social',"
  sql += " publicGoodProofUrl as 'Recibo Entidad Publica', workLetterUrl as 'Carta de Trabajo',"
  sql += " payStubUrl as 'Comprobante de Pago',	origin_idUser, gender, birthDate, contractType,	"
  sql += " jobSector,	occupation,	paymentFrecuency,	profession,	residenceType,"
  sql += " civil_status, province, district, salary, fcreate, fupdate,"
  sql += " c.name as estado, fcreate, datediff(now(), fcreate) as dias,"
  sql += " quotation,	application, sign ,loanPP, loanAuto, loanTC, loanHip, cashOnHand,plazo"
  sql += " FROM prospects a"
  sql += " INNER JOIN entities_f b ON b.id_ruta=a.entity_f"
  sql += " INNER JOIN estados_tramite c ON c.id=a.estado"
  sql += " WHERE id_personal = ?"

  const params = [request.params.id_personal];
  config.cnn.query(sql, params, (error, results) => {
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


module.exports = admRoutes