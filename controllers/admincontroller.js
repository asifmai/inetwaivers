const passport = require('passport');
const path = require('path');
const fs = require('fs');
const _ = require('underscore');
const User = require('../models/User');
const Signedwaivers = require('../models/Signedwaiver');
const Waiver = require('../models/Waiver');

// Show Admin Panel
module.exports.index_get = async (req, res, next) => {
  const numbers = {};
  numbers.waivers = await Waiver.find().countDocuments().exec();
  numbers.signedwaivers = await Signedwaivers.find().countDocuments().exec();
  numbers.guests = await User.find({isadmin: false}).countDocuments().exec();
  res.render('admin/index', {numbers});
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
  let searchtext = '';
  if (req.query.searchtext && req.query.searchtext !== '') searchtext = req.query.searchtext;
  const query = {searchtext};
  let guests;
  if (searchtext == '') {
    guests = await User.find({isadmin: false}).sort({firstname: 'asc'}).exec();
  } else {
    const re = new RegExp(searchtext, 'i');
    const zc = Number(searchtext) ? Number(searchtext) : 0;
    guests = await User.find().or([{firstname: {$regex: re}}, {lastname: {$regex: re}}, {address: {$regex: re}}, {city: {$regex: re}}, {state: {$regex: re}}, {zipcode: zc}, {email: {$regex: re}}, {phone: {$regex: re}}]).sort({firstname: 'asc'}).exec();
  }
  res.render('admin/guests.ejs', {guests, query})
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

// Delete Guest
module.exports.deleteguest_get = async (req, res, next) => {
  const guestid = req.params.guestid;
  await User.findByIdAndDelete(guestid);
  const signedwaivers = await Signedwaivers.find({userid: guestid});
  for (let i = 0; i < signedwaivers.length; i++) {
    const src = path.resolve(__dirname, `../content/signedwaivers/${signedwaivers[i]._id}.pdf`);
    if (fs.existsSync(src)) fs.unlinkSync(src);
  }
  await Signedwaivers.deleteMany({userid: guestid});
  res.redirect('/admin/guests');
}

// Show Signed Waivers
module.exports.signedwaiverslist_get = async (req, res, next) => {
  let searchtext = '';
  if (req.query.searchtext && req.query.searchtext !== '') searchtext = req.query.searchtext;
  const query = {searchtext};
  let waivers = [];
  if (searchtext == '') {
    waivers = await Signedwaivers.find().sort({createdat: 'desc'}).populate('waiverid userid').exec();
  } else {
    const rawWaivers = await Signedwaivers.find().populate('waiverid userid').exec();
    const re = new RegExp(searchtext, 'i');
    for (let i = 0; i < rawWaivers.length; i++) {
      if (rawWaivers[i].userid.firstname.match(re)) {
        waivers.push(rawWaivers[i]);
      } else if (rawWaivers[i].userid.lastname.match(re)) {
        waivers.push(rawWaivers[i]);
      } else if (rawWaivers[i].waiverid.name.match(re)) {
        waivers.push(rawWaivers[i]);
      } else if (Number(searchtext)) {
        if (rawWaivers[i].age == Number(searchtext)) {
          waivers.push(rawWaivers[i]);
        }
      } else if (searchtext == 'true' && rawWaivers[i].signed === true) {
        waivers.push(rawWaivers[i]);
      } else if (searchtext == 'false' && rawWaivers[i].signed === false) {
        waivers.push(rawWaivers[i]);
      } else if (rawWaivers[i].signdate.match(re)) {
        waivers.push(rawWaivers[i]);
      } else if (rawWaivers[i].emergencyphone.match(re)) {
        waivers.push(rawWaivers[i]);
      } else if (rawWaivers[i].guardianname.match(re)) {
        waivers.push(rawWaivers[i]);
      }
    }
    if (waivers.length > 0) {
      waivers = _.sortBy(waivers.reverse(), 'createdat')
    }
  }
  res.render('admin/signedwaiverslist.ejs', {waivers, query})
}

// Delete Waiver
module.exports.deletewaiver_get = async (req, res, next) => {
  const waiverid = req.params.waiverid;
  const waiver = await Signedwaivers.findById(waiverid);
  const src = path.resolve(__dirname, `../content/signedwaivers/${waiver._id}.pdf`);
  if (fs.existsSync(src)) fs.unlinkSync(src);
  await Signedwaivers.findByIdAndDelete(waiverid);
  res.redirect('/admin/signedwaiverslist');
}

// Show Account Settings Page
module.exports.accountsettings_get = (req, res, next) => {
  res.render('admin/accountsettings');
}

// Change account settings
module.exports.accountsettings_post = async (req, res, next) => {
  console.log(req.body);
  const userid = req.body.userid.trim();
  const firstname = req.body.firstname.trim();
  const lastname = req.body.lastname.trim();
  if (firstname == '' || lastname == '') {
    res.render('admin/accountsettings');
  } else {
    await User.findByIdAndUpdate(userid, {
      firstname,
      lastname,
    });
    res.redirect('/admin/accountsettings');
  }
}

// Show Change Password Page
module.exports.changepassword_get = (req, res, next) => {
  res.render('admin/changepassword');
}

// Change Account Password
module.exports.changepassword_post = (req, res, next) => {
  console.log(req.body)
  const userid = req.body.userid.trim();
  const oldpassword = req.body.oldpassword.trim();
  const newpassword = req.body.newpassword.trim();
  const newpassword2 = req.body.newpassword2.trim();
  const errors = [];

  if (oldpassword == '' || newpassword == '' || newpassword2 == '') {
    errors.push({ msg: 'Please enter all fields' });
  }

  if (newpassword != newpassword2) {
    errors.push({ msg: 'Passwords do not match' });
  }

  if (newpassword.length < 6 || newpassword2.length < 6) {
    errors.push({ msg: 'Password must be at least 6 characters' });
  }

  if (oldpassword == newpassword) {
    errors.push({ msg: 'Please type a new password' });
  }

  if (errors.length > 0) {
    res.render('admin/changepassword', { errors });
  } else {
    User.findById(userid).then((user) => {
      user.changePassword(oldpassword, newpassword)
        .then((data) => {
          console.log(data);
          req.flash('success_msg', 'Password changed successfully');
          res.redirect('/admin/changepassword');
        })
        .catch((err) => {
          errors.push({ msg: 'Old password is incorrect' });
          res.render('admin/changepassword', { errors });
          res.send(err);
        });
    });
  }
}