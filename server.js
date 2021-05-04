// server.js
const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth20')
const mongoose = require('mongoose')
const cookieSession = require('cookie-session')
const path = require('path')
const keys = require('./config/keys')
require('./models/User')

mongoose.connect(keys.mongoUri, { useNewUrlParser: true, useUnifiedTopology: true })

const User = mongoose.model('users')

const server = require('express')()

server.use(
  cookieSession({
    maxAge: 30 * 24 * 60 * 60 * 1000,
    keys: [keys.cookiekey],
  })
)

server.use(passport.initialize())
server.use(passport.session())

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
      try {
        User.findOne({ googleID: profile.id }).then((existingUser) => {
          if (existingUser) {
            done(null, existingUser)
          } else {
            new User({ googleID: profile.id }).save()
          }
        })
      } catch (error) {
        console.log(error)
      }
    }
  )
)

server.get(
  '/auth/google',
  passport.authenticate('google', {
    scope: ['profile', 'email'],
  })
)

server.get('/auth/google/callback', passport.authenticate('google'), (req, res) => {
  console.log('Redirecting')
  res.redirect('/api/current_user')
})

server.get('/api/current_user', (req, res) => {
  if (req.user) {
    res.sendFile(path.join(__dirname, '/views/welcome.html'))
  } else {
    res.redirect('/')
  }
})

server.get('/api/logout', (req, res) => {
  req.logout()
  res.redirect('/')
})

server.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/views/index.html'))
})

const PORT = process.env.port || 8000
server.listen(PORT, console.log(`Server is listening on port ${PORT}`))
