# passportPresentation

This will explain the steps necessary for using passport.js for OAuth

---

## Step 1

Create an express app

- git init - if you haven't already
- npm init
- npm i express

```
// index.js

const express = require("express");

const app = express();

app.get("/", (req, res) => {
  res.send({ message: "Hello" });
});

app.listen(5000);
```

---

## Step 2
