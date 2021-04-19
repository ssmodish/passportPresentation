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
