const mongoose = require('mongoose');

const SignedWaiverSchema = new mongoose.Schema({
  waiverid: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Waiver',
    required: true,
  },
  userid: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  createdat: {
    type: Date,
    required: true,
    default: Date.now,
  },
  signed: {
    type: Boolean,
    required: true,
    default: false,
  },
  signdate: {
    type: String,
    required: true,
    default: '',
  },
  emergencyphone: {
    type: String,
  },
  guardianname: {
    type: String,
  },
  participantsignature: {
    type: String,
  },
  guardiansignature: {
    type: String,
  },
  age: {
    type: Number,
  },
});

module.exports = mongoose.model('Signedwaiver', SignedWaiverSchema);
