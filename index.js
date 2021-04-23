// index.js
const express = require('express')
const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth20')
const mongoose = require('mongoose')
const keys = require('./config/keys')

mongoose.connect(keys.mongoURI)

const app = express()

passport.use(
  new GoogleStrategy(
    {
      clientID: keys.googleClientID,
      clientSecret: keys.googleClientSecret,
      callbackURL: '/auth/google/callback',
    },
    (accessToken, refreshToken, profile, done) => {
      console.log('Access token: ' + accessToken)
      console.log('Refresh token: ' + refreshToken)
      console.log('Profile: ')
      for (const [key, value] of Object.entries(profile)) {
        console.log(`${key}: ${value}`)
      }
    }
  )
)

app.get(
  '/auth/google',
  passport.authenticate('google', {
    scope: ['profile', 'email'],
  })
)

app.get('/auth/google/callback', passport.authenticate('google'))

const PORT = process.env.PORT || 5000
app.listen(PORT)
