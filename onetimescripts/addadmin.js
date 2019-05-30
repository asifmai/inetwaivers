const mongoose = require('mongoose');
const db = require('../config/keys').mongoURI;
const User = require('../models/user');

// DB Config
mongoose.connect(db, {
  useNewUrlParser: true,
})
  .then(() => {
    const password = 'default123';
    console.log('MongoDB Connected...');
    const newAdmin = new User({
      firstname: 'Steve',
      lastname: 'Dotson',
      email: 'steve@gmail.com',
      isadmin: true,
    });

    User.register(newAdmin, password, (err, user) => {
      if (err) {
        console.log(err);
      } else {
        console.log('Admin Created with password = default123 \n', user);
      }
    });
  })
  .catch(err => console.log(err));
