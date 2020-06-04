const express = require('express')

//criar e iniciar o servidor
const server = express()

//configurar pasta public
  //use = configurações
server.use(express.static('public'))

//utilizando template engine
const nunjucks = require('nunjucks')
nunjucks.configure('src/views', {
  express: server,
  noCache: true,
})

//configurar caminhos da aplicação:
//home
  //req = requisição/pedido; res = resposta
server.get('/', (req, res) => {
  return res.render("index.html")
})

server.get('/create-point', (req, res) => {
  return res.render("create-point.html")
})

server.get('/search', (req, res) => {
  return res.render("search-results.html")
})

//ligar o servidor
server.listen(3000) //o número é a porta para ligar o servidor