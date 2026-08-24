const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
require('dotenv').config();

const csrRoutes = require('./routes/csrroutes');

const app = express();

const dbURI = process.env.MONGO_URI;
// Middleware
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({
    extended: true,
    limit: "50mb"
}));
app.use(morgan('dev'));

// Connect to MongoDB
mongoose.connect(dbURI)
  .then((result) => {
    console.log('Connected to MongoDB');
    app.listen(process.env.PORT);
  })
  .catch((err) => {
    console.log(err)
  });


// Routes
app.use('/api/csr', csrRoutes);

