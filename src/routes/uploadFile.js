const fileRoutes = require('express').Router()
const mongoose = require('mongoose')
const Prospect = require('../models/Prospect')

const multer = require('multer')
const config = require('../utils/config')
const { uploadFile, uploadFile2 } = require("../utils/multer")
const pdfMake = require('pdfmake/build/pdfmake');
const pdfPrinter = require('pdfmake/src/printer');
const pdfFonts = require('pdfmake/build/vfs_fonts');
const fs = require('fs')
const path = require('path');

const AWS = require('aws-sdk')

fileRoutes.get('/prueba', async (req, res) => {
  res.sendFile(path.join(__dirname+'/upload.html'))
})

const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: function(req, file, cb) {
    cb(null, file.originalname)
  }
})
const storage2 = multer.diskStorage({
  destination: 'pdfs/',
  filename: function(req, file, cb) {
    cb(null, file.originalname)
  }
})

const upload = multer({ storage: storage })
const upload2 = multer({ storage2: storage })

fileRoutes.post('/file', upload.single('idUrl'), async (req, res) => {
  const { entity_f, nameImage, prospect } = req.body
  console.log(entity_f, nameImage)
  const file = req.file
  const result = await uploadFile(file, entity_f, nameImage, prospect)
  try {
    fs.unlinkSync(file.path)
  } catch(err) {
    console.error('Something wrong happened removing the file', err)
  }
  res.send(result)
})

fileRoutes.post('/file2', upload2.single('idUrl'), async (req, res) => {
  const { fileName, entity_f, nameImage, prospect } = req.body
  console.log(fileName, entity_f, nameImage)
  const result = await uploadFile2(fileName, entity_f, nameImage, prospect)
  console.log('uploadFile2', result)
  try {
    fs.unlinkSync(fileName)
  } catch(err) {
    console.error('Something wrong happened removing the file', err)
  }
  res.send(result)
})



fileRoutes.get('/list', async (request, response) => {
  const {entity_f } = request.body

  const { AWS_Access_key_ID, AWS_Secret_access_key, AWS_BUCKET_NAME, AWS_BUCKET_REGION } = config

  const s3 = new AWS.S3({
    region: AWS_BUCKET_REGION,
    accessKeyId: AWS_Access_key_ID,
    secretAccessKey: AWS_Secret_access_key
  })
  
  const params = {
    Bucket: AWS_BUCKET_NAME,
    Delimiter: '',
    Prefix: '200' //entity_f
  }

  s3.listObjects(params, (err, data) => {
    if(err) throw err

    // const newD = []
    // data.Contents.map(item=>{
    //   console.log(item.Key)
    //   const x = item.Key.split('/')
    //   console.log(x.lengt, x[0], entity_f)
    //   if(x.length > 1) {
    //     if(x[0] === entity_f && x[1].length > 0) {
    //       newD.push({ETag: item.ETag, file: x[1]})
    //     }
    //   }
    // })
    // console.log(newD)

    // console.log(data)
    response.status(200).json(data)
  })
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

fileRoutes.post('/createPDF', async (req, res) => {

  const { cedula } = req.body

  await mongoose.connect(config.MONGODB_URI, {
    useNewUrlParser: true, 
    useUnifiedTopology: true
  })
  .then(() => console.log('MongoDB Connected...PDF'))
  .catch((err) => console.log(err))

  try {
    result = await Prospect.find({ "Cedula": cedula }, {})

    console.log(result)
    if(!result.length) {
      return
    }
    const APC = await result[0].APC
    const hoyes = new Date().toLocaleString()
    const gen = APC.Generales
    const ref = APC.Referencias
    const refC = APC.Ref_Canceladas

    // Como crear una linea
    // {canvas: [{type: 'line', x1: 0, y1: 0, x2: 515, y2: 0, lineWidth: 1}]},

    const datosRef = [
      [{ style: 'blueWhite', colSpan: 2, text: 'Agente Económico' }, {}, { style: 'blueWhite', text: 'Monto Original' }, { style: 'blueWhite', text: 'Fec. Inicio Relación' }, { style: 'blueWhite', text: 'Importe' }, { style: 'blueWhite', text: 'Num. Pagos'}, { style: 'blueWhite', text: 'Forma Pago' }],
      [{ style: 'blueWhite', text: 'Relación' }, { style: 'blueWhite', text: 'No. Referencia' }, { style: 'blueWhite', text: 'Saldo Actual' }, { style: 'blueWhite', text: 'Fecha Actualización' }, { style: 'blueWhite', text: 'Monto Último Pago' }, { style: 'blueWhite', text: 'Días Atraso'}, { style: 'blueWhite', text: 'Historial' }],
    ]
    
    ref.forEach(r => {
      datosRef.push([{ border: [true, false, false, false], style: 'small0', colSpan: 2, text: r.Agente_Economico }, {}, { border: [true, false, false, false], style: ['small0', 'right'], text: separator(r.Monto_Original) }, { border: [true, false, false, false], style: ['small0', 'center'], text: r.Fec_Ini_Relacion }, { border: [true, false, false, false], style: ['small0', 'right'], text: separator(r.Letra) }, { border: [true, false, false, false], style: ['small0', 'center'], text: r.Num_Pagos }, { border: [true, false, true, false], style: 'small0', text: r.Forma_Pago }])
      datosRef.push([{ border: [true, false, false, false], style: 'small', text: r.Relacion }, { border: [true, false, false, false], style: 'small', text: r.Referencia }, { border: [true, false, false, false], style: ['small', 'right'], text: separator(r.Saldo_Actual) }, { border: [true, false, false, false], style: ['small', 'center'], text: r.Fec_Actualizacion }, { border: [true, false, false, false], style: ['small', 'right'], text: separator(r.Monto_Utimo_Pago) }, { border: [true, false, false, false], style: ['small', 'center'], text: r.Dias_Atraso }, { border: [true, false, true, false], style: 'small', text: r.Historial }])
    })
    datosRef.push([{ colSpan: 7, border: [false, true, false, false], text: '' }])

    const datosRefC = [
      [{ style: 'blueWhite', text: 'Relación' }, { style: 'blueWhite', text: 'No. Referencia' }, { style: ['blueWhite', 'center'], text: 'Fec. Último Pago' }, { style: ['blueWhite', 'right'], text: 'Monto Original' }, { style: ['blueWhite', 'center'], text: 'Fec. Cancelación' }, { style: 'blueWhite', text: 'Historial' }],
    ]

    refC.forEach(r => {
      datosRefC.push([{ border: [true, false, false, false], style: ['small', { bold: true }], text: 'Agente Económico:' }, { colSpan: 5, border: [true, false, true, false], style: 'small', text: r.Agente_Economico }])
      datosRefC.push([{ border: [true, false, false, false], style: 'small0', text: r.Relacion }, { border: [true, false, false, false], style: ['small0'], text: r.Referencia }, { border: [true, false, false, false], style: ['small0', 'center'], text: '' }, { border: [true, false, false, false], style: ['small0', 'right'], text: separator(0) }, { border: [true, false, false, false], style: ['small0', 'center'], text: r.Fec_Cancelacion }, { border: [true, false, true, false], style: 'small0', text: r.Historial }])
      datosRefC.push([{ border: [true, false, false, false], style: ['small', { bold: true }], text: 'Observación:' }, { colSpan: 5, border: [true, false, true, false], style: 'small', text: r.Observacion }])
    })
    datosRefC.push([{ colSpan: 6, border: [false, true, false, false], text: '' }])

    // pageOrientation: 'landscape',
    // footer: function(currentPage, pageCount) { return currentPage.toString() + ' of ' + pageCount; },
    // header: function(currentPage, pageCount, pageSize) {
    //   // you can apply any logic and return any valid pdfmake element

    //   return [
    //     { text: 'simple text', alignment: (currentPage % 2) ? 'left' : 'right' },
    //     { canvas: [ { type: 'rect', x: 170, y: 32, w: pageSize.width - 170, h: 40 } ] }
    //   ]
    // },

    const dd = {
      pageSize: 'LETTER',
      pageMargins: 20,

      content: [
        {
          text: 'REPORTE DE CRÉDITO',
          style: 'header'
        },
        { text: 'www.fiinanservs.com', link: 'https:www//finanservs.com', style: { fontSize: 8, alignment: 'center', color: 'blue' } },
        '\n\n',
        {
          style: 'tableExample',
          table: {
            widths: [100, 150, 90, 70, 110],
            body: [  
              [{ style: 'blueWhite', text: 'Nombre:' }, { text: gen.Nombre + ' ' + gen.Apellido, style: 'small1' }, { border: [false, false, false, false], text: '' }, { style: ['blueWhite', 'right'], text: 'Fecha: ' }, { style: 'small1', text: hoyes }],
              [{ style: 'blueWhite', text: 'Identificación:' }, { text: gen.Id, style: 'small1' }, { border: [false, false, false, false], text: '' }, { border: [false, false, false, false], text: '' }, { border: [false, false, false, false], text: '' }],
              [{ style: 'blueWhite', text: 'Usuario Consulta:' }, { text: gen.Usuario, style: 'small1' }, { border: [false, false, false, false], text: '' }, { border: [false, false, false, false], text: '' }, { border: [false, false, false, false], text: '' }],
              [{ style: 'blueWhite', text: 'Asociado:' }, { text: gen.Asociado, style: 'small1' }, { border: [false, false, false, false], text: '' }, { border: [false, false, false, false], text: '' }, { border: [false, false, false, false], text: '' }],
            ]
          }
        },
        '\n',
        {
          table: {
            // headers are automatically repeated if the table spans over multiple pages
            // you can declare how many rows should be treated as headers
            widths: [150],
            body: [
              [{ text: 'Referencias Activas', style: 'blueWhite', border: [true, true, true, false] }],
            ]
          }
        },
        {
          layout: 'lightVerticalLines', // optional
          // style: 'blueWhite',
          table: {
            // headers are automatically repeated if the table spans over multiple pages
            // you can declare how many rows should be treated as headers
            // headerRows: 2,
            // widths: [ '*', 'auto', 100, '*' ],
            widths: [ 100, 70, 50, 50, 50, 50, '*' ],
            body: datosRef
          }
        },
        '\n',
        {
          table: {
            // headers are automatically repeated if the table spans over multiple pages
            // you can declare how many rows should be treated as headers
            widths: [150],
            body: [
              [{ text: 'Referencias Canceladas', style: 'blueWhite', border: [true, true, true, false] }],
            ]
          }
        },
        {
          // layout: 'lightVerticalLines', // optional
          // style: 'blueWhite',
          table: {
            // headers are automatically repeated if the table spans over multiple pages
            // you can declare how many rows should be treated as headers
            // headerRows: 2,
            // widths: [ '*', 'auto', 100, '*' ],
            widths: [ 120, 50, 50, 50, 50, '*' ],
            body: datosRefC
          }
        },
        '\n\n',
        {
          // under NodeJS (or in case you use virtual file system provided by pdfmake)
          // you can also pass file names here
          image: './public/images/leer-historial-apc.png',
          width: 300,
          height: 200,
          alignment: 'center'
        }
      ],
      styles: {
        header: {
          fontSize: 12,
          bold: true,
          alignment: 'center'
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
        small1: {
          fontSize: 7,
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

    res.json({'fileName': fileName})
  } catch(err)  {
    console.log(err)
  }
})


fileRoutes.post('/authApcPDF', async (req, res) => {

  const { body } = req
  const { nombre, cedula, sign }  = body
  const fecha = 'Panamá, ' + new Date().toLocaleDateString()

    const dd = {
      pageSize: 'LETTER',
      pageMargins: [40,40,40,40],

      content: [
        { text: 'AUTORIZACIÓN DE LA APC\n\n', style: 'header' },

        { text: fecha }, '\n\n',
        'Señores\n',
        'ACsoraT, S. A.\n',
        'Panamá\n\n',

        {
          layout: 'noBorders',
          table: {
            // headers are automatically repeated if the table spans over multiple pages
            // you can declare how many rows should be treated as headers
            widths: ['auto','*'],
            body: [
              ['Estimado señor: ', { text: nombre, bold: true }],
            ]
          }
        },
        { text: 'Por este medio autorizo(amos) expresamente a ACsoraT, S. A., sus subsidiarias y/o afiliadas, cesionarios o sucesoras, así como cualquier compañía que por operación de cesión, administración o compra de cartera adquiera los derechos de mi crédito, a que de conformidad con lo expresado en el artículo 24 y demás disposiciones aplicables de la Ley 24 de 22 de mayo de 2002, solicite, consulte, recopile, intercambie y transmita a cualquier agencia de información de datos, bancos o agentes económicos informaciones relacionadas con obligaciones o transacciones crediticias que mantengo o pudiera mantener con dichos agentes económicos de la localidad, sobre mi(nuestros) historial de crédito y relaciones con acreedores. También queda facultado el ACsoraT, S. A., sus subsidiarias y/o afiliadas, cesionarios o sucesoras, así como cualquier compañía que por una operación de cesión, administración o compra de cartera adquiera los derechos de mi crédito, a que solicite y obtenga información de instituciones gubernamentales relacionadas con las obligaciones o transacciones crediticias arriba referidas. Así mismo, exonero(amos) de cualquier consecuencia o responsabilidad resultante del ejercicio de solicitar o suministrar información, o por razón de cualesquiera autorizaciones contenidas en la presente carta, al ACsoraT, S. A, a sus compañías afiliadas, subsidiarias, cesionarios y/o sucesoras, a sus empleados, ejecutivos, directores dignatarios o apoderados, así como cualquier compañía que por una operación de cesión, administración o compra de cartera adquiera los derechos de mi crédito.\n\n\n', style: 'detail' },
        'Atentamente\n',

        {
          layout: 'noBorders',
          table: {
            // headers are automatically repeated if the table spans over multiple pages
            // you can declare how many rows should be treated as headers
            widths: ['auto','*'],
            body: [
              ['Nombre: ', { text: nombre, decoration: 'underline' }],
            ]
          }
        },
        {
          layout: 'noBorders',
          table: {
            // headers are automatically repeated if the table spans over multiple pages
            // you can declare how many rows should be treated as headers
            widths: ['auto','*'],
            body: [
              ['Cédula: ', { text: cedula, decoration: 'underline' }],
            ]
          }
        },
        '\n\n',
        'Fundamento legal: Ley 24 de 22 de mayo de 2002.',
        '\n',
        {
          // under NodeJS (or in case you use virtual file system provided by pdfmake)
          // you can also pass file names here
          image: sign,
          width: 150,
          height: 75,
          alignment: 'center'
        }
      ],
      styles: {
        header: {
          fontSize: 14,
          bold: true,
          alignment: 'center'
        },
        detail: {
          fontSize: 12,
          bold: false,
          alignment: 'justify'
        },
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

    let fileName = path.join(`./pdfs/tmp-pdf2-${Date.now()}.pdf`)

    const printer = new pdfPrinter(fonts)
    var pdfDoc = printer.createPdfKitDocument(dd);
    pdfDoc.pipe(fs.createWriteStream(fileName)).on('finish',function(){
        //success
    });
    pdfDoc.end();

    res.json({'fileName': fileName})
})

fileRoutes.post('/solicPrestBanisi', async (req, res) => {

  const { id } = req.body

    const dd = {
      pageSize: 'LETTER',
      pageMargins: [20, 40, 20, 40],

      content: [
        {
          layout: 'noBorders',
          table: {
            widths: [100, 350, 30, '*'],
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
                style: 'small1'
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
          layout: 'noBorders',
          table: {
            widths: [60, 180, 50, 97, 150],
            body: [
              [
                {
                  text: 'MONTO DESEADO: ',
                  style: 'small1'
                },
                {
                  text: 'BBBBBBBBBBB',
                  style: 'small1a'
                },
                {},
                {
                  text: 'PROPÓSITO DEL PRÉSTAMO: ',
                  style: 'small1'
                },
                {
                  text: 'AAAAAAAAAAAAAA',
                  style: 'small1a'
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
              [{ border: [true, false, false, true], style: 'small1c', text: 'NOMBRES' }, { border: [true, false, false, true], style: 'small1c', text: '1ER APELLIDO' }, { border: [true, false, true, true], style: 'small1c', text: '2DO APELLIDO' }],
              [{ border: [true, false, false, true], style: 'small1c', text: '.' }, { border: [true, false, false, true], style: 'small1c', text: '' }, { border: [true, false, true, true], style: 'small1c', text: '' }],
             ]
          }
        },
        {
          table: {
            widths: [80, 91, 78, 95, 80, 23, 25, 25],
            body: [  
              [
                { border: [true, false, false, true], style: 'small1', text: 'CÉDULA O PASAPORTE' }, { border: [true, false, false, true], style: 'small1c', text: '' },
                { border: [true, false, false, true], style: 'small1', text: 'PAIS DE NACIMIENTO' }, { border: [true, false, false, true], style: 'small1c', text: '' },
                { border: [true, false, false, true], style: 'small1', text: 'FECHA DE NACIMIENTO' }, { border: [true, false, false, true], style: 'small1c', text: 'dd' },  { border: [true, false, false, true], style: 'small1c', text: 'mm' },  { border: [true, false, true, true], style: 'small1c', text: 'aaaa' }, 
              ],
             ]
          }
        },
        {
          table: {
            widths: [94, 15, 18, 15, 54, 68, 72, 15, 46, 82],
            body: [  
              [
                { border: [true, false, false, true], style: 'small1', text: 'AÑOS RESIDE EN PANAMÁ' }, { border: [true, false, false, true], style: 'small1c', text: '' },
                { border: [true, false, false, true], style: 'small1', text: 'SEXO' }, { border: [true, false, false, true], style: 'small1c', text: '' },
                { border: [true, false, false, true], style: 'small1', text: 'ESTADO CIVIL' }, { border: [true, false, false, true], style: 'small1c', text: '' },  
                { border: [true, false, false, true], style: 'small1', text: 'NO. DEPENDIENTES' }, { border: [true, false, false, true], style: 'small1c', text: '' },  
                { border: [true, false, false, true], style: 'small1', text: 'PROFESIÓN' }, { border: [true, false, true, true], style: 'small1c', text: '' },  
              ],
             ]
          }
        },
        {
          table: {
            widths: [93, 100, 140, 200],
            body: [  
              [{ border: [true, false, false, true], style: 'small1c', text: 'PROVINCIA' }, { border: [true, false, false, true], style: 'small1c', text: 'DISTRITO' }, { border: [true, false, false, true], style: 'small1c', text: 'BARRIO CORREGIMIENTO' }, { border: [true, false, true, true], style: 'small1c', text: 'DIRECCIÓN RESIDENCIAL' }],
              [{ border: [true, false, false, true], style: 'small1c', text: '.' }, { border: [true, false, false, true], style: 'small1c', text: '' }, { border: [true, false, false, true], style: 'small1c', text: '' }, { border: [true, false, true, true], style: 'small1c', text: '' }],
             ]
          }
        },
        {
          table: {
            widths: [80, 60, 68, 60, 77, 170],
            body: [  
              [
                { border: [true, false, false, true], style: 'small1', text: 'TELÉFONO RESIDENCIAL' }, { border: [true, false, false, true], style: 'small1c', text: '' },
                { border: [true, false, false, true], style: 'small1', text: 'TELÉFONO CELULAR' }, { border: [true, false, false, true], style: 'small1c', text: '' },
                { border: [true, false, false, true], style: 'small1', text: 'CORREO ELECTRÓNICO' }, { border: [true, false, true, true], style: 'small1c', text: '' },  
              ],
             ]
          }
        },
        {
          table: {
            widths: [93, 190, 200, 50],
            body: [  
              [
                { border: [true, false, false, true], style: 'small1c', text: 'TIPO DE VIVIENDA' }, { border: [true, false, false, true], style: 'small1c', text: '' }, 
                { border: [true, false, false, true], style: 'small1c', text: 'TIEMPO EN RESIDENCIA ACTUAL' }, { border: [true, false, true, true], style: 'small1c', text: '' },
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
              [{ border: [true, false, false, true], style: 'small1c', text: 'NOMBRES' }, { border: [true, false, false, true], style: 'small1c', text: '1ER APELLIDO' }, { border: [true, false, true, true], style: 'small1c', text: '2DO APELLIDO' }],
              [{ border: [true, false, false, true], style: 'small1c', text: '.' }, { border: [true, false, false, true], style: 'small1c', text: '' }, { border: [true, false, true, true], style: 'small1c', text: '' }],
             ]
          }
        },
        {
          table: {
            widths: [80, 91, 78, 95, 80, 23, 25, 25],
            body: [  
              [
                { border: [true, false, false, true], style: 'small1', text: 'CÉDULA O PASAPORTE' }, { border: [true, false, false, true], style: 'small1c', text: '' },
                { border: [true, false, false, true], style: 'small1', text: 'PAIS DE NACIMIENTO' }, { border: [true, false, false, true], style: 'small1c', text: '' },
                { border: [true, false, false, true], style: 'small1', text: 'FECHA DE NACIMIENTO' }, { border: [true, false, false, true], style: 'small1c', text: 'dd' },  { border: [true, false, false, true], style: 'small1c', text: 'mm' },  { border: [true, false, true, true], style: 'small1c', text: 'aaaa' }, 
              ],
             ]
          }
        },
        {
          table: {
            widths: [118, 125, 140, 150],
            body: [  
              [{ border: [true, false, false, true], style: 'small1c', text: 'LUGAR DE TRABAJO' }, { border: [true, false, false, true], style: 'small1c', text: 'DIRECCI[ON DE LA EMPRESA' }, { border: [true, false, false, true], style: 'small1c', text: 'TEL[EFONO OFICINA' }, { border: [true, false, true, true], style: 'small1c', text: 'TEL[EFONO o CELULAR' }],
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
              [{ border: [true, false, true, true], style: 'small1', text: 'NO PARIENTES' }],
            ]
          }
        },
        {
          table: {
            widths: [120, 140, 95, 85, 84],
            body: [  
              [{ border: [true, false, false, true], style: 'small1c', text: 'NOMBRE COMPLETO' }, { border: [true, false, false, true], style: 'small1c', text: 'LUGAR DE TRABAJO' }, { border: [true, false, false, true], style: 'small1c', text: 'TELÉEFONO RESIDENCIAL' }, { border: [true, false, false, true], style: 'small1c', text: 'TELÉFONO OFICINA' }, { border: [true, false, true, true], style: 'small1c', text: 'TELÉFONO CELULAR' }],
              [{ border: [true, false, false, true], style: 'small1c', text: '.' }, { border: [true, false, false, true], style: 'small1c', text: '' }, { border: [true, false, false, true], style: 'small1c', text: '' }, { border: [true, false, false, true], style: 'small1c', text: '' }, { border: [true, false, true, true], style: 'small1c', text: '' }],
              [{ border: [true, false, false, true], style: 'small1c', text: '.' }, { border: [true, false, false, true], style: 'small1c', text: '' }, { border: [true, false, false, true], style: 'small1c', text: '' }, { border: [true, false, false, true], style: 'small1c', text: '' }, { border: [true, false, true, true], style: 'small1c', text: '' }],
              [{ border: [true, false, false, true], style: 'small1c', text: '.' }, { border: [true, false, false, true], style: 'small1c', text: '' }, { border: [true, false, false, true], style: 'small1c', text: '' }, { border: [true, false, false, true], style: 'small1c', text: '' }, { border: [true, false, true, true], style: 'small1c', text: '' }],
             ]
          }
        },
        {
          table: {
            widths: [560],
            body: [  
              [{ border: [true, false, true, true], style: 'small1', text: 'PARIENTE CERCANO QUE NO VIVA CON USTED' }],
            ]
          }
        },
        {
          table: {
            widths: [120, 140, 95, 85, 84],
            body: [  
              [{ border: [true, false, false, true], style: 'small1c', text: 'NOMBRE COMPLETO' }, { border: [true, false, false, true], style: 'small1c', text: 'LUGAR DE TRABAJO' }, { border: [true, false, false, true], style: 'small1c', text: 'TELÉEFONO RESIDENCIAL' }, { border: [true, false, false, true], style: 'small1c', text: 'TELÉFONO OFICINA' }, { border: [true, false, true, true], style: 'small1c', text: 'TELÉFONO CELULAR' }],
              [{ border: [true, false, false, true], style: 'small1c', text: '.' }, { border: [true, false, false, true], style: 'small1c', text: '' }, { border: [true, false, false, true], style: 'small1c', text: '' }, { border: [true, false, false, true], style: 'small1c', text: '' }, { border: [true, false, true, true], style: 'small1c', text: '' }],
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
                { border: [true, false, false, true], style: 'small1', text: 'EMPRESA DONDE LABORA' }, { border: [true, false, false, true], style: 'small1c', text: '' },
                { border: [true, false, false, true], style: 'small1', text: 'CIUDAD Y DIRECCIÓN DE LA EMPRESA' }, { border: [true, false, true, true], style: 'small1c', text: '' },
              ],
             ]
          }
        },
        {
          table: {
            widths: [80, 90, 62, 80, 60, 45, 40, 40],
            body: [  
              [
                { border: [true, false, false, true], style: 'small1', text: 'ACTIVIDAD DE LA EMPRESA' }, { border: [true, false, false, true], style: 'small1c', text: '' },
                { border: [true, false, false, true], style: 'small1', text: 'CARGO O POSICIÓN' }, { border: [true, false, false, true], style: 'small1c', text: '' },
                { border: [true, false, false, true], style: 'small1', text: 'FECHA DE INGRESO' }, { border: [true, false, false, true], style: 'small1c', text: '' }, 
                { border: [true, false, false, true], style: 'small1', text: 'TELÉFONOS' }, { border: [true, false, true, true], style: 'small1c', text: '' },
              ],
             ]
          }
        },
        {
          table: {
            widths: [100, 110, 75, 95, 55, 80],
            body: [  
              [
                { border: [true, false, false, true], style: 'small1', text: 'DEPARTAMENTO DONDE LABORA' }, { border: [true, false, false, true], style: 'small1c', text: '' },
                { border: [true, false, false, true], style: 'small1', text: 'INGRESO MENSUAL' }, { border: [true, false, false, true], style: 'small1c', text: '' },
                { border: [true, false, false, true], style: 'small1', text: 'SALARIO BASE' }, { border: [true, false, true, true], style: 'small1c', text: '' }, 
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
                        { border: [false, false, false, false], style: 'small1', text: 'TIENES OTROS INGRESOS:' },
                        { border: [false, false, false, false], style: 'small1', text: 'SI' },
                        { style: 'small1', text: '' },
                        { border: [false, false, false, false], style: 'small1', text: 'NO' },
                        { style: 'small1', text: '' },{ border: [false, false, false, false],  text: '' },
                        { border: [false, false, false, false], style: 'small1', text: 'DETALLE:' }, { border: [false, false, false, false], style: 'small1', text: '' },
                      ],
                    ]
                  }
                },
                { border: [true, false, false, true], style: 'small1', text: 'MONTO DE OTROS INGRESOS' }, { border: [true, false, true, true], style: 'small1c', text: '' },
              ],
             ]
          }
        },
        {
          table: {
            widths: [228, 115, 110, 80],
            body: [  
              [{ border: [true, false, false, true], style: 'small1', text: 'EMPLEO ANTERIOR (SI TIENE MENOS DE DOS AÑOS EN EL EMPLEO ACTUAL)' }, { border: [true, false, false, true], style: 'small1c', text: 'DIRECCIÓN DE EMPLEO ANTERIOR' }, { border: [true, false, false, true], style: 'small1c', text: 'TELÉFONO DE EMPLEO ANTERIOR' }, { border: [true, false, true, true], style: 'small1c', text: 'AÑOS TRABAJADOS' }],
              [{ border: [true, false, false, true], style: 'small1c', text: '.' }, { border: [true, false, false, true], style: 'small1c', text: '' }, { border: [true, false, false, true], style: 'small1c', text: '' }, { border: [true, false, true, true], style: 'small1c', text: '' }],
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
                      { border: [false, false, false, false], style: 'small1', text: '¿ES USTED O ALGÚN FAMILIAR CERCANO POLÍTICO Y/O DE ALGÚN ÓRGANO DE ESTADO DE SU PAÍS?' },
                      { border: [false, false, false, false], style: 'small1', text: 'SI' },
                      { style: 'small1', text: '' },
                      { border: [false, false, false, false], style: 'small1', text: 'NO' },
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
                { border: [true, false, false, true], style: 'small1', text: 'SI MARCÓ SI, ESPECIFIQUE CARGO DESEMPEÑADO' }, { border: [true, false, false, true], style: 'small1c', text: '' },
                { border: [true, false, false, true], style: 'small1', text: 'INSTITUCIÓN' }, { border: [true, false, false, true], style: 'small1c', text: '' },
                { border: [true, false, false, true], style: 'small1', text: 'PERÍODO' }, { border: [true, false, true, true], style: 'small1c', text: '' }, 
             ],
             ]
          }
        },
        {
          table: {
            widths: [560],
            heights: [20],
            body: [  
              [{ border: [true, false, true, true], style: 'small1', text: '\n¿ES USTED SOCIO, CÓNYUGE O FAMILIAR CONSANGUÍNEO O POR AFINIDAD HASTA EL CUARTO GRADO DE UN PEP NACIONAL O EXTRANJERO?' }],
            ]
          }
        },
        {
          table: {
            widths: [77, 95, 86, 86, 86, 85],
            body: [  
              [
                { border: [true, false, false, true], style: 'small1',  text: '\nSi marcó SI,\nindicar parentesco:' },
                { border: [true, false, false, true], style: 'small1c', 
                  table: {
                    widths: [3, 81],
                    body: [  
                      [
                        { border: [false, false, false, false], text: '' },
                        { border: [false, false, false, false], rowSpan: 3, text: 'Familiar consanguíneo (padres, hijos, hermanos, tíos, primos, abuelos, nietos)' } 
                      ],
                      [{ text: 'x' }, { border: [false, false, false, false], text: '' }],
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
              [{ border: [true, false, false, true], style: 'small1c', text: 'NOMBRE DEL PEP CON EL QUE TIENE RELACIÓN' }, { border: [true, false, false, true], style: 'small1c', text: 'PUESTO A CARGO DEL PEP' }, { border: [true, false, true, true], style: 'small1c', text: 'INSTITUCIÓN O DEPENDENCIA DONDE LABORA' }],
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
                        { border: [false, false, false, false], style: 'small1c', text: '¿TIENE USTED UNA SEGUNDA NACIONALIDAD?' },
                        { border: [false, false, false, false], style: 'small1', text: 'En caso afirmativo indique el país:' },
                      ],
                    ]
                  }
                },
                { border: [true, false, true, false], style: 'small1', 
                  table: {
                    widths: [180, 15, 4, 15, 4],
                    body: [  
                      [
                        { border: [false, false, false, false], style: 'small1', text: '¿ES USTED UNA PERSONA DE LOS EE.UU. O US PERSON?' },
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
                        { border: [false, false, false, false], style: 'small1', text: '¿TIENE OBLIGACIÓN TRIBUTARIA EN OTRO PAÍS?' },
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
                        { border: [false, false, false, false], style: 'small1', text: '¿CUÁL?' }, 
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
                      { border: [false, true, false, false], style: 'small1', text: 'Firma del Solicitante (igual que en la cédula)' },
                      { border: [false, false, false, false], text: '' },
                      { border: [false, true, false, false], style: 'small1', text: 'No. de cédula del Solicitante' },
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
          alignment: 'center'
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
        small1: {
          fontSize: 6,
        },
        small1c: {
          fontSize: 6,
          alignment: 'center'
        },
        small1a: {
          fontSize: 7,
          decoration: 'underline',
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

    res.json({'fileName': fileName})

})



module.exports = fileRoutes