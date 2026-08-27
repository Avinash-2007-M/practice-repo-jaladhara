const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
require('dotenv').config();
const companyRoutes = require("./routes/companyRoutes");
const authRoutes = require("./routes/authRoutes");
const app = express();
const cors = require('cors');
const requireAuth = require('./middleware/authMiddleware');
const cookieParser = require("cookie-parser");


mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log("Connected to MongoDB");
        app.listen(process.env.PORT||3000);
    })
    .catch((err)=>{
        console.log(err);
    });

//Middleware
app.use(express.json()); 
app.use(morgan('dev')); 
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(cookieParser());

//Routes
app.use('/csr/auth',authRoutes);
app.use('/csr',requireAuth,companyRoutes);


