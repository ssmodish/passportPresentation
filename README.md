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
