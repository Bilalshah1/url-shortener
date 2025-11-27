
const express = require('express');
const { connectDB } = require('./connect');
const URL = require('./models/urls');
const urlRoutes = require('./routes/url');
const path = require('path');
const app = express();
const port = 3001;
const uri=process.env.MONGO_URI;

connectDB(uri)
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.error('Failed to connect to MongoDB', err));
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});



app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.set('view engine', 'ejs');
app.set('views', path.resolve("./views"));
  
app.get('/test', async (req, res) => {
    const alldbURLS = await URL.find({});
    return res.render('home', { urls: alldbURLS });
});

app.use('/url', urlRoutes);

