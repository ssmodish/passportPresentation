const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth20')
const cookieSession = require('cookie-session')
const mongoose = require('mongoose')
require('./models/User')

const keys = require('./config/keys')

mongoose.connect(keys.mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })

const User = mongoose.model('users')

const server = require('express')()
server.use(
  cookieSession({
    maxAge: 30 * 24 * 60 * 60 * 1000,
    keys: [keys.cookieKey],
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
      User.findOne({ googleID: profile.id }).then((existingUser) => {
        if (existingUser) {
          done(null, existingUser)
        } else {
          new User({ googleID: profile.id }).save()
        }
      })
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
  res.send('<h1>We made it!</h1><a href="/auth/logout">Logout</a>')
})

server.get('/', (req, res) => {
  res.send('<h1>Hello Florida JS</h1><a href="/auth/google">Login with Google</a>')
})

server.listen(8000, console.log('listening on 8000'))
