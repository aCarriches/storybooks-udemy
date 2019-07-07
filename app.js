const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const exphbs = require('express-handlebars');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const session = require('express-session');
const methodOverride = require('method-override');

// Load keys
const keys = require('./config/keys');

// Handlebars helpers
const { truncate, stripTags, formatDate, select, editIcon } = require('./helpers/hbs');

// Load models
require('./models/User');
require('./models/Story');

// Load routes
const index = require('./routes/index');
const auth = require('./routes/auth');
const stories = require('./routes/stories');

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

// Body-parser middleware
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// Method-override middleware
app.use(methodOverride('_method'))

// Handlebars middleware
app.engine('handlebars', exphbs({
  helpers: {
    truncate,
    stripTags,
    formatDate,
    select,
    editIcon
  },
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

// Static public folder
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/', index);
app.use('/auth', auth);
app.use('/stories', stories);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`)
})