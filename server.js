// server.js
const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth20')

const server = require('express')()
const path = require('path')

passport.use(new GoogleStrategy())

server.get('/auth/google', (req, res) => {
  console.log('contacting google')
})

server.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/views/index.html'))
})

const PORT = process.env.port || 8000
server.listen(PORT, console.log(`Server is listening on port ${PORT}`))
