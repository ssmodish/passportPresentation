const server = require('express')()
const path = require('path')

server.get('/', (req, res) => {
  res.status(200).sendFile(path.join(__dirname, '/views/index.html'))
})

server.get('/protected', (req, res) => {
  res.status(200).sendFile(path.join(__dirname, '/views/protect-me.html'))
})

server.listen(8000, console.log('Server is listening at http://localhost:8000'))
