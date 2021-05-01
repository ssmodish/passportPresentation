// server.js
const server = require('express')()

server.get('/', (req, res) => {
  res.send('<h1>Hello Florida JS!</h1>')
})

const PORT = process.env.port || 8000
server.listen(PORT, console.log(`Server is listening on port ${PORT}`))
