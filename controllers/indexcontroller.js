const Waiver = require('../models/Waiver');
const path = require('path');
const fs = require('fs');
const PDFDocument = require('pdfkit');

// Show index page
module.exports.index_get = (req, res, next) => {
  res.render('index', {page: 'homepage'});
}

// Show Choose Waiver Page
module.exports.choosewaiver_get = async (req, res, next) => {
  const waivers = await Waiver.find();
  res.render('choosewaiver', {waivers});
}

// Show Waiver Page
module.exports.waiver_get = async (req, res, next) => {
  console.log(req.params.waiverid);
  const waiver = await Waiver.findById(req.params.waiverid);
  const path1 = path.resolve(__dirname, `../public/content/waivers/${waiver.filename1}`);
  const path2 = path.resolve(__dirname, `../public/content/waivers/${waiver.filename2}`);
  const waivercontent1 = fs.readFileSync(path1, 'utf8');
  const waivercontent2 = fs.readFileSync(path2, 'utf8');
  res.render('waiver', {waivercontent1, waivercontent2, waiver});
}

module.exports.submitwaiver_post = (req, res, next) => {
  console.log(req.body);
  if (!req.body.signparticipant) {
    req.flash('error_msg', 'Please Sign before Submitting');
    res.redirect(`/waiver/${req.body.waiverid}`);
  } else if (req.body.age == '') {
    req.flash('error_msg', 'Please fill in Age');
    res.redirect(`/waiver/${req.body.waiverid}`);
  } else if (parseInt(req.body.age) < 18) {
    if (req.body.guardianname == '' || req.body.phonenumber == '' || !req.body.signguardian) {
      req.flash('error_msg', 'Please fill in Parent/Guardian Information with signature');
      res.redirect(`/waiver/${req.body.waiverid}`);
    }
  }

  const sig1Data = req.body.signature1.replace(/^data:image\/png;base64,/, "");
  const sig2Data = req.body.signature2.replace(/^data:image\/png;base64,/, "");
  const pathToSig = path.resolve(__dirname, '../temp/')
  fs.writeFileSync(pathToSig + '/sig1.png', sig1Data, 'base64');
  fs.writeFileSync(pathToSig + '/sig2.png', sig2Data, 'base64');

  const doc = new PDFDocument;
  doc.pipe(fs.createWriteStream(pathToSig + '/waiver.pdf')); // write to PDF
  doc.text('Hello world!')
  doc.end();
  res.send('waiver submitted')
}