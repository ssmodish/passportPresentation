// server.js
const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth20')

const server = require('express')()
const path = require('path')
const keys = require('./config/keys')

passport.use(
  new GoogleStrategy(
    {
      clientID: keys.googleClientID,
      clientSecret: keys.googleClientSecret,
      callbackURL: '/auth/google/callback',
    },
    (accessToken, refreshToken, profile, done) => {
      console.log('Access token: ' + accessToken + '\n')
      console.log('Refresh token: ' + refreshToken + '\n')
      console.log('Profile: ')
      for (const [key, value] of Object.entries(profile._json)) {
        console.log(`${key}: ${value}`)
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
