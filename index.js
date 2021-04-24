// index.js
const express = require('express')
const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth20')
const mongoose = require('mongoose')
const cookieSession = require('cookie-session')
const keys = require('./config/keys')
require('./models/User')

mongoose.connect(keys.mongoURI)

const User = mongoose.model('users')

const app = express()

app.use(
  cookieSession({
    maxAge: 30 * 24 * 60 * 60 * 1000,
    keys: [keys.cookieKey],
  })
)
app.use(passport.initialize())
app.use(passport.session())

passport.serializeUser((user, done) => {
  done(null, user.id)
})

passport.deserializeUser((id, done) => {
  User.findById(id).then((user) => {
    done(null, user)
  })
})

passport.use(
  new GoogleStrategy(
    {
      clientID: keys.googleClientID,
      clientSecret: keys.googleClientSecret,
      callbackURL: '/auth/google/callback',
    },
    (accessToken, refreshToken, profile, done) => {
      User.findOne({ googleID: profile.id }).then((existingUser) => {
        if (existingUser) {
          done(null, existingUser)
        } else {
          new User({ googleID: profile.id }).save().then((user) => done(null, user))
        }
      })
    }
  )
)

app.get(
  '/auth/google',
  passport.authenticate('google', {
    scope: ['profile', 'email'],
  })
)

app.get('/auth/google/callback', passport.authenticate('google'), (req, res) => {
  res.redirect('/api/current_user')
})

app.get('/api/logout', (req, res) => {
  req.logout()
  res.redirect('/api/current_user')
})

app.get('/api/current_user', (req, res) => {
  if (req.user) {
    res.send(`<h1>Welcome ${req.user.id}</h1><a href='/api/logout'><button>Logout</button></a>`)
  } else {
    res.send(`<a href='/auth/google'><button>Login</button></a>`)
  }
})

const PORT = process.env.PORT || 5000
app.listen(PORT)
