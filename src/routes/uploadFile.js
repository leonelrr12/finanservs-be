const fileRoutes = require('express').Router()
const mongoose = require('mongoose')
const Prospect = require('../models/Prospect')

const multer = require('multer')
const config = require('../utils/config')
const { uploadFile, uploadFile2 } = require("../utils/multer")
// const PDF = require('html-pdf')
const pdfMake = require('pdfmake/build/pdfmake');
const pdfPrinter = require('pdfmake/src/printer');
const pdfFonts = require('pdfmake/build/vfs_fonts');
const fs = require('fs')
const path = require('path');

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
  console.log(result)
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
  console.log(result)
  try {
    fs.unlinkSync(fileName)
  } catch(err) {
    console.error('Something wrong happened removing the file', err)
  }
  res.send(result)
})

fileRoutes.get('/list', async (request, response) => {
  const { bucket, entity_f } = request.body
  console.log(bucket, entity_f);

  AWS.config.update({region: 'us-east-1'})

  const s3 = new AWS.S3({apiVersion: '2021-09-22'})

  const params = {
    Bucket: bucket
  }


  s3.listObjects(params, (err, data) => {
    if(err) throw err

    const newD = []
    data.Contents.map(item=>{
      console.log(item.Key)
      const x = item.Key.split('/')
      console.log(x.lengt, x[0], entity_f)
      if(x.length > 1) {
        if(x[0] === entity_f && x[1].length > 0) {
          newD.push({ETag: item.ETag, file: x[1]})
        }
      }
    })
    console.log(newD)
    response.status(200).json(newD)
  })
})


fileRoutes.get('/createPDF', async (req, res) => {

  await mongoose.connect(config.MONGODB_URI, {
    useNewUrlParser: true, 
    useUnifiedTopology: true
  })
  .then(() => console.log('MongoDB Connected...'))
  .catch((err) => console.log(err))

  try {
    result = await Prospect.findById("6181cf8499cb258e2077d7d1")
    console.log(result.APC)
  } catch(err)  {
    console.log(err)
  }

  res.send(result.APC)

  // Como crear una linea
  // {canvas: [{type: 'line', x1: 0, y1: 0, x2: 515, y2: 0, lineWidth: 1}]},
  var dd = {
    pageSize: 'LETTER',
    pageOrientation: 'landscape',
    pageMargins: 60,
    content: [
      {
        text: 'REPORTE DE CRÉDITO',
        style: 'header'
      },
      { text: 'www.finanservs.com', link: 'https:www//finanservs.com', style: { fontSize: 8, alignment: 'center', color: 'blue' } },
      '\n\n',
      {
        style: 'tableExample',
        table: {
          widths: [100, 150, 100, 80, 160],
          body: [
            [{ style: 'blueWhite', text: 'Nombre:' }, { text: 'JOSE DARIO ANTONIO', style: 'small' }, { border: [false, false, false, false], text: '' }, { style: ['blueWhite', 'right'], text: 'Fecha: ' }, { style: 'small', text: 'fecha' }],
            [{ style: 'blueWhite', text: 'Identificación:' }, { text: '4-725-1443', style: 'small' }, { border: [false, false, false, false], text: '' }, { border: [false, false, false, false], text: '' }, { border: [false, false, false, false], text: '' }],
            [{ style: 'blueWhite', text: 'Usuario Consulta:' }, { text: 'WSACSORAT001', style: 'small' }, { border: [false, false, false, false], text: '' }, { border: [false, false, false, false], text: '' }, { border: [false, false, false, false], text: '' }],
            [{ style: 'blueWhite', text: 'Asociado:' }, { text: 'ACSORAT, S.A.', style: 'small' }, { border: [false, false, false, false], text: '' }, { border: [false, false, false, false], text: '' }, { border: [false, false, false, false], text: '' }],
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
          widths: [ 130, 100, 80, 80, 80, '*' ],
          body: [
            [{ style: 'blueWhite', text: 'Agente Económico' }, { style: 'blueWhite', text: 'Monto Original' }, { style: 'blueWhite', text: 'Fec. Inicio Relación' }, { style: 'blueWhite', text: 'Importe' }, { style: 'blueWhite', rowSpan: 2, text: 'Dias Atraso'}, { style: 'blueWhite', text: 'Forma Pago' }],
            [{ style: 'blueWhite', text: 'Relación' }, { style: 'blueWhite', text: 'Saldo Actual' }, { style: 'blueWhite', text: 'Fecha Actualización' }, { style: 'blueWhite', text: 'Monto Último Pago' },'', { style: 'blueWhite', text: 'Historial' }],
            [{ style: 'small', text: 'CAJA DE AHORROS' }, { style: ['small', 'right'], text: '25,352.86' }, { style: ['small', 'center'], text: '11/Nov/2018' }, { style: ['small', 'right'], text: '250.45' }, {rowSpan: 2, style: ['small', 'center'], text: '93' }, { style: 'small', text: 'DESCUENTO DIRECTO' }],
            [{ style: 'small', text: 'HIPOTECA' }, { style: ['small', 'right'], text: '10,352.86' }, { style: ['small', 'center'], text: '11/Nov/2021' }, { style: ['small', 'right'], text: '250.45' },'', { style: 'small', text: '111111122221113311133344' }]
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
          widths: [ 130, 100, 80, 80, 80, '*' ],
          body: [
            [{ style: 'blueWhite', text: 'Relación' }, { style: 'blueWhite', text: 'No. Referencia' }, { style: ['blueWhite', 'center'], text: 'Fec. Úlyimo Pago' }, { style: ['blueWhite', 'right'], text: 'Monto Original' }, { style: ['blueWhite', 'center'], text: 'Fec. Cancelación' }, { style: 'blueWhite', text: 'Historial' }],
            [{ style: 'small', text: 'Agente Económico:' }, { colSpan: 5, style: 'small', text: 'BANCO GENERAL xyz' }],
            [{ style: 'small', text: 'PRESTAMO PERSONAL' }, { style: ['small'], text: '20105555' }, { style: ['small', 'center'], text: '11/Nov/2018' }, { style: ['small', 'right'], text: '6,500.45' }, { style: ['small', 'center'], text: '23/jun/2020' }, { style: 'small', text: '111111555551111166667777' }],
            [{ style: 'small', text: 'Comentarios:' }, { colSpan: 5, style: 'small', text: '' }],
          ]
        }
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
      small: {
        fontSize: 8
      },
      blueWhite: {
        fillColor: '#00007b',
        color: 'white',
        fontSize: 8
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
        normal: './src/fonts/Roboto-Regular.ttf',
        bold: './src/fonts/Roboto-Medium.ttf',
        italics: './src/fonts/Roboto-Italic.ttf',
        bolditalics: './srcset/fonts/Roboto-MediumItalic.ttf'
    }
  };

  const printer = new pdfPrinter(fonts)
  var pdfDoc = printer.createPdfKitDocument(dd);
  pdfDoc.pipe(fs.createWriteStream('pdfs/basics.pdf')).on('finish',function(){
      //success
  });
  pdfDoc.end();

  // console.log(content)

  // const options = { 
  //   format: 'Letter', 
  //   border: {
  //       "top": "0.3in",            // default is 0, units: mm, cm, in, px
  //       "right": "1in",
  //       "bottom": "0.31in",
  //       "left": "1in"
  //   },
  // }

  // let fileName = path.join(`./pdfs/tmp-pdf-${Date.now()}.pdf`)

  // await PDF.create(content, options).toFile(fileName, (err, res2) => {
  //   if(err) {
  //     console.log(err)
  //   } else {
  //     // console.log(res.filename)
  //     res.send(res2)
  //   }
  // })
})

module.exports = fileRoutes