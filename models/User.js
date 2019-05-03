const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

const UserSchema = new mongoose.Schema({
  firstname: {
    type: String,
    required: true,
  },
  lastname: {
    type: String,
    required: true,
  },
  address: {
    type: String,
  },
  city: {
    type: String,
  },
  state: {
    type: String,
  },
  zipcode: {
    type: Number,
  },
  email: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
  },
  joined: {
    type: Date,
    default: Date.now,
  },
  isadmin: {
    type: Boolean,
    required: true,
    default: false,
  },
  isverified: {
    type: Boolean,
    required: true,
    default: true,
  },
  verifytoken: {
    type: String,
    required: true,
    default: 'verified',
  },
  resettoken: {
    type: String,
  },
  resettimestamp: {
    type: Date,
  },
});

UserSchema.plugin(passportLocalMongoose, { usernameField: 'email' });

module.exports = mongoose.model('User', UserSchema);
