const mongoose = require('mongoose');
const path = require('path');

const WaiverSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  filename1: {
    type: String,
    required: true,
  },
  filename2: {
    type: String,
    required: true,
  },
  createdat: {
    type: Date,
    default: Date.now,
  }
});

WaiverSchema.virtual('url1').get(function () {
  return path.resolve(__dirname, `../public/content/waivers/${this.filename1}`);
});

WaiverSchema.virtual('url2').get(function () {
  return path.resolve(__dirname, `../public/content/waivers/${this.filename2}`);
});

module.exports = mongoose.model('Waiver', WaiverSchema);
