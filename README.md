# passportPresentation

This will explain the steps necessary for using passport.js for OAuth

---

## Step 1

Create an express app

- git init (if you haven't already)
- npm init
- npm i express

```
// index.js

const express = require("express");

const app = express();

app.get("/", (req, res) => {
  res.send({ message: "Hello from Florida JS" });
});

app.listen(5000);
```

---

## Step 2

Install passport and strategies

`npm i passport passport-google-oauth20@2`

Edit index.js

```
// index.js
const express = require('express')
const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth20')

const app = express()

passport.use(new GoogleStrategy())

const PORT = process.env.PORT || 5000
app.listen(PORT)
```

---

## Step 3

Go to console.developers.google.com
Create a new project

- wait a minute or two for it to spin up
- enable oauth (google+) API
- generate credentials
- - configure consent screen
- - - external
- - Credentials
- - - OAuth Client ID
- - - - web application
- - - - authorized js origins
- - - - - http://localhost:5000
- - - - authorized redirect URIs
- - - - - http://localhost:5000/auth/google/callback

- - COPY credentials to ./config/keys.js
- - - should look like this:

```
module.exports = {
  googleClientID: 'YOUR-CLIENT-ID',
  googleClientSecret: 'YOUR-SECRET-ID',
}
```

- - ADD keys.js to .gitignore

---

## Step 4

Add arguments to strategy

1st argument is an object with ID, secret, and callback URL

2nd argument is a function (for now show accessToken)

index.js should now look like this:

```
// index.js
const express = require('express')
const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth20')
const keys = require('./config/keys')

const app = express()

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

const PORT = process.env.PORT || 5000
app.listen(PORT)
```

---

## Step 5

Add passport to a route

```
// index.js
const express = require('express')
const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth20')
const keys = require('./config/keys')

const app = express()

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

const PORT = process.env.PORT || 5000
app.listen(PORT)
```

Should fail but at callback route

This has completed the OAuth steps:

- Client requests access from Authorization Server
- Authorization Server requests permission from Resource Owner (by sending the "choose account" splash)
- Resource Owner approves request from Authorization Server
- Authorization Server sends Client an auth token

---

## Step 6

Add nodemon and scripts into package.json (should do this at the start)

Index.js now looks like this:
```
// index.js
const express = require('express')
const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth20')
const keys = require('./config/keys')

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
```

This prints the data we should send/compare to our database to. So go ahead and hook that up!
 