import express from 'express';
import axios from 'axios';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import router from './controllers/lipaNaMpesa.js'
import callback from './controllers/lipaCallback.js';
import mongoose from "mongoose";


mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.error("MongoDB Error:", err));



dotenv.config();
const app = express();
const port = process.env.PORT || 8080;





const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.json());


app.use(router);
app.use(callback);




// app.use(mpesastk);
app.use(callback);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Mongoooo is on");
    app.listen(process.env.PORT || 3000, () => {
      console.log("Server is up and running");
    });
  })
  .catch((err) => console.error("Mongo error:", err));






app.use('/static', express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));



app.get("/", async(req, res) => {
  res.render('payment', {failedMessage: null, successMessage: null});
  });

  app.get("/dashboard", async(req, res) => {
    res.render('dashboard');
    });

app.listen(port,  () => {

  console.log(`Server running on port ${port}`);

  });
  
