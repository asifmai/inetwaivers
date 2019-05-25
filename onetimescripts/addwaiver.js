const mongoose = require('mongoose');
const keys = require('../config/keys');
const Waiver = require('../models/Waiver');

mongoose.connect(keys.mongoURI, {useNewUrlParser: true})
  .then(async () => {
    const newWaiver = new Waiver({
      name: 'Waiver 1',
      description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Voluptatibus ex, non quos laudantium veritatis sequi.Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam.',
      filename1: 'waiver1-1.html',
      filename2: 'waiver1-2.html',
    })
    const createdWaiver = await newWaiver.save();
    mongoose.disconnect();
  })