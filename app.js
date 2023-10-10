const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./routes/authRoutes');
const cookieParser = require('cookie-parser');
const { requireAuth, checkUser } = require('./middleware/authMiddleware');


const app = express();

//middleware
app.use(express.static('public'));
app.use(express.json());
app.use(cookieParser());
//view engine
app.set('view engine', 'ejs')

//database connection
const dbURI = 'mongodb+srv://zakkur:dramaticals@cluster0.2f4974g.mongodb.net/node-auth'
mongoose.connect(dbURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then((result) => app.listen(3000),console.log("Listening at http://localhost:3000"))
    .catch((err) => console.log(err));
//routes
app.use(express.urlencoded({ extended: true }));
app.get('*', checkUser);
app.get('/', (req, res) => res.render('home'));
app.use(authRoutes);
app.get('/about', (req, res) => { res.render('about'); });
app.get('/admin',requireAuth, (req, res) => { res.render('admin'); });