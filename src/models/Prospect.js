const mongoose = require('mongoose')
const Schema = mongoose.Schema

const prospectSchema = new Schema({
  Numero_Id: {type: String, default: null},
  Tracking: {type: String, default: "Step No.1: Login"},
  "Creado el": {type: Date, default: new Date()},
  "Modificado el": {type: Date, default: new Date()},

  Prospect: {
    Nombre: {type: String},
    Segundo_Nombre: {type: String},
    Apellido_Paterno: {type: String},
    Apellido_Materno: {type: String},
    Email: {type: String},
    Celular: {type: String},
    Genero: {type: String},
    Fecha_Nac: {type: Date},
    Terminos_Condiciones: {type: String},
    Nacionalidad: {type: String},
    Estado_Civil: {type: String},
    Telefono_Casa: {type: String},
    Provincia: {type: String},
    Distrito: {type: String},
    Corregimiento: {type: String},
    Calle_No: {type: String},
  },
  Info: {
    Sector: {type: String},
    Profesion: {type: String},
    Institucion: {type: String},
    Historial_Credito: {type: Boolean, default: false},
    Frecuencia_Pago: {type: String},
    Tipo_Residencia: {type: Number},
    Mensualidad: {type: Number},
  },
  Trabajo_Actual: {
    Tipo_Contrato: {type: String},
    Meses_Trabajo_Actual: {type: Number},
    Compania_Trabajo: {type: String},
    Cargo: {type: String},
    Direccion_Trabajo: {type: String},
    Telefono_Trabajo: {type: String},
    Extension_Trabajo: {type: String},
    Trabajo_Anterior: {type: String},
    Meses_Trabajo_Anterior: {type: Number},
  },
  Ingresos: {
    Salario: {type: Number},
    Servicios_Profesionales: {type: Number},
    Viaticos: {type: Number}
  },

  Entidad_Seleccionada: {type: String},

  Prestamo_Opciones: [{
    bank: {type: String},
    cashOnHand: {type: Number},
    loan: {type: Number},
    monthlyFee: {type: Number},
    term: {type: Number},
  }],
  Documentos: {
    Img_ID: {type: String},
    Img_Ficha_CSS: {type: String},
    Img_Servicio_Publico: {type: String},
    Img_Carta_Trabajo: {type: String},
    Img_Comprobante_Pago: {type: String},
    Img_Autoriza_APC: {type: String},
  },
  Ref_Personal_Familia: {
    Ref_Familia_Nombre: {type: String},
    Ref_Familia_Apellido: {type: String},
    Ref_Familia_Parentesco: {type: String},
    Ref_Familia_Telefono: {type: String},
    Ref_Familia_Casa_No: {type: String},
    Ref_Familia_Empresa: {type: String},
    Ref_Familia_Empresa_Telefono: {type: String},
    Ref_Familia_Empresa_Extension: {type: String},
  },
  Ref_Personal_No_Familia: {
    Ref_No_Familia_Nombre: {type: String},
    Ref_No_Familia_Apellido: {type: String},
    Ref_No_Familia_Parentesco: {type: String},
    Ref_No_Familia_Telefono: {type: String},
    Ref_No_Familia_Casa_No: {type: String},
    Ref_No_Familia_Empresa: {type: String},
    Ref_No_Familia_Empresa_Telefono: {type: String},
    Ref_No_Familia_Empresa_Extension: {type: String},
  },
})

const Prospect = mongoose.model('Prospect', prospectSchema)

module.exports = Prospect
