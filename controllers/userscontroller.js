const passport = require('passport');

const User = require('../models/User');

// Register User
module.exports.register_post = async (req, res, next) => {
  const registerUser = {
    firstname: req.sanitize(req.body.firstname.trim()),
    lastname: req.sanitize(req.body.lastname.trim()),
    address: req.sanitize(req.body.address.trim()),
    city: req.sanitize(req.body.city.trim()),
    state: req.sanitize(req.body.state.trim()),
    zipcode: req.sanitize(req.body.zipcode.trim()),
    email: req.sanitize(req.body.email.trim()),
    phone: req.sanitize(req.body.phone.trim()),
    password: req.sanitize(req.body.password.trim()),
    password2: req.sanitize(req.body.password2.trim()),
  }

  const errors = [];

  if (registerUser.password !== registerUser.password2) {
    errors.push({msg: 'Passwords do not match...'})
  }
  
  const user = await User.findOne({ email: registerUser.email });
  if (user) {
    errors.push({msg: 'Email already exists'})
  }

  if (errors.length > 0) {
    res.render('index', {
      errors,
      registerUser,
      page: 'registerpage'
    });
  } else {
    const newUser = new User(registerUser);
    User.register(newUser, req.body.password, (err, user) => {
      if (err) {
        console.log(err);
      } else {
        req.flash('success_msg', 'Registered Successfully...');
        res.render('index', { page: 'loginpage', email: registerUser.email});
      }
    });
  }
}

// Login User
module.exports.login_post = (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/choosewaiver',
    failureRedirect: '/',
    failureFlash: 'We do not recognize your email address as being associated with an account. Please sign up to access the iNetWaivers',
  })(req, res, next);
}

// Log Out User
module.exports.logout_get = (req, res, next) => {
  req.logout();
  res.render('index', { page: 'loginpage', success_msg: 'You are logged out...'});
}
