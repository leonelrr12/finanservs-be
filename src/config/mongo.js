const { mngoose } = require("mongoose");
const config = require("../utils/config");


const mongoConnect = async () => {
  mongoose.connect(
    config.MONGODB_URI, 
    {
      useNewUrlParser: true, 
      useUnifiedTopology: true
    },
    (err, res) => {
      if(err) {
        console.log("*** ERROR DE CONEXION A MONGODB")
      } else {
        console.log("CONEXION MONGODB OK")
      }
    }
  )
};


module.exports = mongoConnect;