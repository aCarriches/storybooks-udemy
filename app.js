const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const exphbs = require('express-handlebars');
const cookieParser = require('cookie-parser');
const session = require('express-session');

// Load keys
const keys = require('./config/keys');

// Load routes
const index = require('./routes/index');
const auth = require('./routes/auth');

// Load User model
require('./models/user');

// Passport config
require('./config/passport')(passport);

const app = express();

// Mongoose connect
mongoose.connect(keys.mongoURI, {
  useNewUrlParser: true
})
  .then(() => console.log('MongoDB connected...'))
  .catch(err => console.log(err));


app.use(cookieParser());
app.use(session({
  secret: 'secret',
  resave: false,
  saveUninitialized: false
}))

// Handlebars middleware
app.engine('handlebars', exphbs({
  defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Global vars
app.use((req, res, next) => {
  res.locals.user = req.user || null;
  next();
})

// Routes
app.use('/', index);
app.use('/auth', auth);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`)
})