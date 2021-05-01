First let's build a simple Express app.

Run `npm init -y` and then `npm i express`

Then:

```javascript
// server.js
const server = require('express')()

server.get('/', (req, res) => {
  res.send('Hello Florida JS!')
})

const PORT = process.env.port || 8000
server.listen(PORT, console.log(`Server is listening on port ${PORT}`))
```
