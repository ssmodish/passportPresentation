# OAuth with PassportJS

## Step 1

First let's build a simple Express app.

Run `npm init -y` and then `npm i express`

Then:

```javascript
// server.js
const server = require('express')()

server.get('/', (req, res) => {
  res.send('<h1>Hello Florida JS!</h1>')
})

const PORT = process.env.port || 8000
server.listen(PORT, console.log(`Server is listening on port ${PORT}`))
```

---

## Step 2

Now add nodemon and `"start": "nodemon server.js"` to our package.json file.
Move our response to an html file and add a button -

```html
<!-- /views/index.html -->
<h1>Hello Florida JS!</h1>
<button href="#">Login with Google</button>
```

and then serve that file

```javascript
// server.js
const server = require('express')()
const path = require('path')

server.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/views/index.html'))
})

const PORT = process.env.port || 8000
server.listen(PORT, console.log(`Server is listening on port ${PORT}`))
```

---

## Step 3

Add Passport strategies

Run `npm i passport passport-google-oauth20@2`

Add passport to our server

```javascript
// server.js
const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth20')

const server = require('express')()

passport.use(new GoogleStrategy())

app.get('/auth/google', (req, res) => {
  console.log('contacting google')
})

server.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/views/index.html'))
})

const PORT = process.env.port || 8000
server.listen(PORT, console.log(`Server is listening on port ${PORT}`))
```

---

## Step 4

Register app with Google Cloud Platform

- Go to https://console.cloud.google.com
- Create a new project
- Enable Google+ API
- Generate Credentials
- Configure the Consent Screen

  - Choose External
  - Enter App name and Support Email
  - At the bottom, add Developer Contact info.

- Credentials

  - Choose **OAuth Client ID**
  - Then choose **Web Application**
  - Add:

    - Authorized JS Origins:

      `http://localhost:8000`

    - Authorized redirect URIs

      `http://localhost:8000/auth/google/callback`

Copy the credentials that popup to `/config/keys.js` and add that file to your `.gitignore`

```javascript
// /config/keys.js
module.exports = {
  googleClientID: 'YOUR_CLIENT_ID',
  googleClientSecret: 'YOUR_SECRET_ID',
}
```

---

## Step 5

Now we need to update our strategy to use the keys we just got.

```javascript
// server.js
const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth20')

const server = require('express')()

passport.use(
  new GoogleStrategy(
    {
      clientID: keys.googleClientID,
      clientSecret: keys.googleClientSecret,
      callbackURL: '/auth/google/callback',
    },
    (accessToken) => {
      console.log(accessToken)
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

server.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/views/index.html'))
})

const PORT = process.env.port || 8000
server.listen(PORT, console.log(`Server is listening on port ${PORT}`))
```

If we try our app now we can see our access token but we hang on the Google login screen...

---

## Step 6

The first part of the strategy is wht passport needs from us to get an access token from google, the second argument is what we want in return. Let's get back some more data

```javascript
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
```
