const passport = require('passport');
const path = require('path');
const fs = require('fs');
const User = require('../models/User');
const Signedwaivers = require('../models/Signedwaiver');


// Show Admin Panel
module.exports.index_get = (req, res, next) => {
  res.render('admin/index')
}

// Show Admin login Page
module.exports.login_get = (req, res, next) => {
  res.render('admin/login')
}

// Authenticate Admin
module.exports.login_post = (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/admin',
    failureRedirect: '/admin/login',
    failureFlash: 'The email address or password is incorrect',
  })(req, res, next);
}

// Logout Admin
module.exports.logout_get = (req, res, next) => {
  req.logout();
  req.flash('success_msg', 'You are logged out');
  res.redirect('/admin/login');
};

// Show Guests Page
module.exports.guests_get = async (req, res, next) => {
  const guests = await User.find({isadmin: false})
  res.render('admin/guests.ejs', {guests})
}

// Show Signed Waivers of Guest
module.exports.signedwaivers_get = async (req, res, next) => {
  const guest = await User.findById(req.params.guestid);
  const waivers = await Signedwaivers.find({userid: req.params.guestid}).populate('waiverid').sort({createdat: -1});
  res.render('admin/signedwaivers.ejs', {guest, waivers});
}

// Download Waiver
module.exports.downloadwaiver_get = async (req, res, next) => {
  const waiverid = req.params.waiverid;
  const sourcePath = path.resolve(__dirname, `../content/signedwaivers/${waiverid}.pdf`);
  const destPath = path.resolve(__dirname, `../public/waivers/viewwaiver.pdf`);
  fs.copyFileSync(sourcePath, destPath);
  res.download(destPath);
}