const mongoose = require('mongoose')
const Schema = mongoose.Schema

const prospectSchema = new Schema({
  Numero_Id: {type: String, default: null},
  Status: {type: String, default: "Step No.: Login"},
  "Creado el": {type: Date, default: new Date()},
  "Modificado el": {type: Date, default: new Date()},
  Prospect: {
    Nombre: {type: String},
    Apellido: {type: String},
    Email: {type: String},
    Celular: {type: String},
    Genero: {type: String},
    FechaNac: {type: Date},
    Nacionalidad: {type: String},
    "Estado Civil": {type: String},
    "Telefono Casa": {type: String},
    "Provincia": {type: String},
    "Distrito": {type: String},
    "Corregimiento": {type: String},
    "Casa No.": {type: String},
    "Calle No.": {type: String},
  },
  Info: {
    Sector: {type: String},
    Profesion: {type: String},
    Institucion: {type: String},
    "Historial Credito": {type: Boolean, default: false},
    "Frecuencia Pago": {type: String},
    "Tipo Residencia": {type: Number},
    "Mensualida": {type: Number},
  },
  "Trabajo Actual": {
    "Tipo Contrato": {type: String},
    "Meses Trabajo Actual": {type: Number},
    "Compañia Trabajo": {type: String},
    "Cargo": {type: String},
    "Direccion Trabajo": {type: String},
    "Telefono Trabajo": {type: String},
    "Ext. Trabajo": {type: String},
    "Trabajo Anterior": {type: String},
    "Meses Trabajo Anterior": {type: Number},
  },
  Ingresos: {
    Salario: {type: Number},
    "Servicios Profesionales": {type: Number},
    Viaticos: {type: Number}
  },
  Prestamo: {
    Banco: {type: String},
    Monto: {type: Number},
  },
  Documentos: {
    "Img ID": {type: String},
    "Img Ficha CSS": {type: String},
    "Img Servcicio Público": {type: String},
    "Img Carta de Trabajo": {type: String},
    "Img Comprobante de Pago": {type: String},
    "Img Autoriza APC": {type: String},
  },
  "Referencia Personales Familia": {
    "Ref. Familia Nombre": {type: String},
    "Ref. Familia Apellido": {type: String},
    "Ref. Familia Parentezco": {type: String},
    "Ref. Familia Teléfono": {type: String},
    "Ref. Familia Casa No.": {type: String},
    "Ref. Familia Empresa": {type: String},
    "Ref. Familia Empresa Telefono": {type: String},
    "Ref. Familia Empresa Ext.": {type: String},
  },
  "Referencia Personales No Familia": {
    "Ref. No Familia Nombre": {type: String},
    "Ref. No Familia Apellido": {type: String},
    "Ref. No Familia Parentezco": {type: String},
    "Ref. No Familia Teléfono": {type: String},
    "Ref. No Familia Casa No.": {type: String},
    "Ref. No Familia Empresa": {type: String},
    "Ref. No Familia Empresa Telefono": {type: String},
    "Ref. No Familia Empresa Ext.": {type: String},
  }
})

const Prospect = mongoose.model('Prospect', prospectSchema)

module.exports = Prospect
