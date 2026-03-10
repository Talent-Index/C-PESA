import express from 'express';
import axios from 'axios';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import router from './controllers/lipaNaMpesa.js';
import callback from './controllers/lipaCallback.js';
import mongoose from 'mongoose';

// Load environment variables
dotenv.config();

// ES module __dirname fix
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const port = process.env.PORT || 8080;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.json());

// Routes
app.use(router);
app.use(callback);

// Static files & views
app.use('/static', express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Pages
// app.get('/', (req, res) => {
//   res.render('index', { failedMessage: null, successMessage: null });
// });

app.get("/", async (req, res) => {
  const user = {
    cChainAddress: '',
    phoneNumber: ''
  };

  res.render('index', {
    failedMessage: null,
    successMessage: null,
    user // pass user to the template
  });
});


app.get("/payment", (req, res) => {
    res.render("payment", { user: req.user || {} }); 
});

app.get("/sell", (req, res) => {
    res.render("sell", { user: req.user || {} }); 
});

app.get("/till", (req, res) => {
    res.render("till", { user: req.user || {} }); 
});

app.get("/send", (req, res) => {
    res.render("send", { user: req.user || {} }); 
});

app.get('/dashboard', (req, res) => {
  res.render('dashboard');
});

// getting the avax prices
app.get("/api/price", async (req, res) => {
    try {
      
        const priceInKsh = 1022.56; 
        res.json({ ksh: priceInKsh });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to fetch price" });
    }
});

// app.get("/api/price", async (req, res) => {
//   try {
    
//     const cgRes = await fetch(
//       "https://api.coingecko.com/api/v3/simple/price?ids=avalanche-2&vs_currencies=ksh"
//     );
//     const data = await cgRes.json();

  
//     res.json({ ksh: data["avalanche-2"].ksh });
//   } catch (err) {
//     console.error("CoinGecko fetch error:", err);
//     res.status(500).json({ error: "Failed to fetch price" });
//   }
// });



// Connect to MongoDB and start server
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB Connected');
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  })
  .catch(err => console.error('MongoDB Error:', err));
