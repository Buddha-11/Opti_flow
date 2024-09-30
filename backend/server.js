require('dotenv').config();
const express=require('express');
const mongoose=require('mongoose');

const app=express();

app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`);
    next();
  });

  mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log('Connected to Database and listening on port', process.env.PORT);
    });
  })
  .catch((error) => {
    console.error(error);
  });

  