const mongoose = require('mongoose')
const { Schema } = mongoose

const prospectSchema = new Schema({
  tracking: String,
  jobSector: String,
  occupation: String,
  profession: String,  
  institution: String,
  retirement: String,
  contractType: String,
  currentJobMonths: Number,
  previousJobMonths: Number,
  creditHistory: Boolean,
  paymentFrecuency: String,
  wage: Number,
  alloance: Number,
  perDiem: Number,
  residenceType: String,
  monthlyResidenceFee: Number,
  gender: String,
  birthDate: Number,
  weight: Number,
  weightUnit: String,
  height: Number,
  heightUnit: String
})

const Prospect = mongoose.model('Prospect', prospectSchema)

module.exports = Prospect