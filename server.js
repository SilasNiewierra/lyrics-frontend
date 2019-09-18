// server.js
var express = require('express')
var app = express()

var path = require('path')
var serveStatic = require('serve-static')
app = express()
app.use(serveStatic(__dirname + "/dist"))

// Start server
app.listen(process.env.PORT || 3000, () => {
  console.log('Server running on port 3000')
})
