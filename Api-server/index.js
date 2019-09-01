'use strict';

require('dotenv').config();
const mongoose = require('mongoose');
console.log('process.env.MONGODB_URI', process.env.MONGODB_URI)

const options = {
  useNewUrlParser: true,
  useCreateIndex: true,
};

mongoose.connect(process.env.MONGODB_URI, options);

require('./src/app.js').start(process.env.PORT);
