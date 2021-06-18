const express = require('express')
const app = express()

app.use(express.static(__dirname + '/Static'))
app.use(express.static(__dirname + '/CSS'))
app.use(express.static(__dirname + '/scripts'))

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/Static/index.html')
})

app.listen(process.env.PORT)