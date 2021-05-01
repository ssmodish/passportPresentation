// server.js
const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth20')
const mongoose = require('mongoose')
const path = require('path')
const keys = require('./config/keys')
require('./models/User')

mongoose.connect(keys.mongoUri)

const User = mongoose.model('users')

const server = require('express')()

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

server.get('/auth/google/callback', passport.authenticate('google'))

server.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/views/index.html'))
})

const PORT = process.env.port || 8000
server.listen(PORT, console.log(`Server is listening on port ${PORT}`))
