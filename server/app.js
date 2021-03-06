const path = require('path')
require('dotenv').config({ path: path.join(__dirname, '.env') })

const bodyParser = require('body-parser')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const express = require('express')
const logger = require('morgan')
const nocache = require('nocache')
const session = require("express-session");
const bcrypt = require('bcrypt');
const bcryptSalt = 10;
const passport = require('passport');
const User = require("./models/User")
const MongoStore = require('connect-mongo')(session);
const mongoose = require('mongoose');
const helmet = require('helmet');
const compression = require('compression');

require('./configs/database')

const app_name = require('./package.json').name
const debug = require('debug')(`${app_name}:${path.basename(__filename).split('.')[0]}`)

const app = express()

app.use(nocache())

// Set "Access-Control-Allow-Origin" header
app.use(cors({
  origin: (origin, cb) => {
    cb(null, origin && origin.startsWith('http://localhost:'))
  },
  optionsSuccessStatus: 200,
  credentials: true
}))

app.use(compression());
app.use(helmet());
app.use(logger('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser())

// Set the public folder to "~/client/build/"
// Example: http://localhost:5000/favicon.ico => Display "~/client/build/favicon.ico"
app.use(express.static(path.join(__dirname, '../client/build')))

const LocalStrategy = require('passport-local').Strategy;
const flash = require('connect-flash');

app.use(session({
  secret: process.env.SESSION_SECRET || 'irongenerator',
  resave: true,
  saveUninitialized: true,
  store: new MongoStore({ mongooseConnection: mongoose.connection })
}))


passport.serializeUser((user, cb) => {
  cb(null, user._id);
});

passport.deserializeUser((id, cb) => {
  User.findById(id, (err, user) => {
    if (err) { return cb(err); }
    cb(null, user);
  });
});

app.use(flash());

passport.use(new LocalStrategy(
  function(username, password, done) {
    User.findOne({ username: username }, function (err, user) {
      if (err) { return done(err); }
      if (!user) {
        return done(null, false, { message: 'Incorrect username' });
      }
      if (!bcrypt.compareSync(password, user.password)) {
        return done(null,false,{message: 'Incorrect password'});
      }
      return done(null, user);
    });
  }
));

app.use(passport.initialize());
app.use(passport.session());

app.use('/api', require('./routes/auth'))
app.use('/api/message', require('./routes/message'))
app.use('/api/file', require('./routes/file'))
app.use('/api/user', require('./routes/user'))
app.use('/api/product', require('./routes/product'))
app.use('/api/company', require('./routes/company'))

// For any routes that starts with "/api", catch 404 and forward to error handler
app.use('/api/*', (req, res, next) => {
  let err = new Error('Not Found')
  err.status = 404
  next(err)
})

// For any other routes, redirect to the index.html file of React
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build/index.html'))
})

// Error handler
app.use((err, req, res, next) => {
  console.error("----- An error happened -----")
  console.error(err)

  // only render if the error ocurred before sending the response
  if (!res.headersSent) {
    res.status(err.status || 500)

    // A limited amount of information sent in production
    if (process.env.NODE_ENV === 'production')
      res.json(err)
    else
      res.json(JSON.parse(JSON.stringify(err, Object.getOwnPropertyNames(err))))
  }
})

module.exports = app
