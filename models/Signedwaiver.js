const mongoose = require('mongoose');

const SignedWaiverSchema = new mongoose.Schema({
  waiverid: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Waiver',
  },
  userid: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  createdat: {
    type: Date,
    default: Date.now,
  },
  signdate: {
    type: String,
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
