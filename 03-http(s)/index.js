const http = require('http')

http.createServer( (req, res) => {

  res.writeHead(200, {
    "content-type": "text/plain"
  })

  res.write('hello nodejs')

  res.end()

}).listen(8080, 'localhost', () => {
  console.log('服务已启动:locahost:8080')
})
