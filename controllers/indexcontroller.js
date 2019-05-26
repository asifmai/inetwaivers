const Waiver = require('../models/Waiver');
const path = require('path');
const fs = require('fs');
const generatePDF = require('../helpers/generatepdf');
const SignedWaiver = require('../models/Signedwaiver');
const moment = require('moment');

// Show index page
module.exports.index_get = (req, res, next) => {
  res.render('index', {page: 'homepage'});
}

// Show Choose Waiver Page
module.exports.choosewaiver_get = async (req, res, next) => {
  const waivers = await Waiver.find();
  const signedwaivers = await SignedWaiver.find({userid: req.user._id}).populate('waiverid').exec();
  res.render('choosewaiver', {waivers, signedwaivers});
}

// Show Waiver Page
module.exports.waiver_get = async (req, res, next) => {
  const waiver = await Waiver.findById(req.params.waiverid);
  const path1 = path.resolve(__dirname, `../content/waivers/${waiver.filename1}`);
  const path2 = path.resolve(__dirname, `../content/waivers/${waiver.filename2}`);
  const waivercontent1 = fs.readFileSync(path1, 'utf8');
  const waivercontent2 = fs.readFileSync(path2, 'utf8');
  res.render('waiver', {waivercontent1, waivercontent2, waiver});
}

module.exports.submitwaiver_post = async (req, res, next) => {
  if (!req.body.signparticipant) {
    req.flash('error_msg', 'Please Sign before Submitting');
    return res.redirect(`/waiver/${req.body.waiverid}`);
  } else if (req.body.age == '') {
    req.flash('error_msg', 'Please fill in Age');
    return res.redirect(`/waiver/${req.body.waiverid}`);
  } else if (Number(req.body.age) < 18) {
    if (req.body.guardianname == '' || req.body.phonenumber == '' || !req.body.signguardian) {
      req.flash('error_msg', 'Please fill in Parent/Guardian Information with signature');
      return res.redirect(`/waiver/${req.body.waiverid}`);
    }
  }

  const newSignedWaiver = new SignedWaiver({
    waiverid: req.body.waiverid,
    userid: req.body.userid,
    signdate: req.body.date,
    emergencyphone: req.body.phonenumber,
    guardianname: req.body.guardianname,
    participantsignature: req.body.signature1,
    guardiansignature: req.body.signature2,
    age: Number(req.body.age),
  })
  const createdSignedWaiver = await newSignedWaiver.save();
  await generatePDF(req.body, createdSignedWaiver._id);
  res.render('waiversubmitted');
}