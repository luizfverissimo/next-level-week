const express = require("express");

//criar e iniciar o servidor
const server = express();

//pegar o banco de dados
const db = require("./database/db");

//configurar pasta public
//use = configurações
server.use(express.static("public"));

//habilitar o uso do req.body
server.use(express.urlencoded({ extended: true }));

//utilizando template engine
const nunjucks = require("nunjucks");
nunjucks.configure("src/views", {
  express: server,
  noCache: true,
});

//configurar caminhos da aplicação:
//home
//req = requisição/pedido; res = resposta
server.get("/", (req, res) => {
  return res.render("index.html");
});

server.get("/create-point", (req, res) => {
  //query - recebe a query strings da nossa url
  //console.log(req.query)

  return res.render("create-point.html");
});

//rota para receber o formulário de maneira "oculta"
server.post("/savepoint", (req, res) => {
  //req.body = corpo do formulário - precisa ser habilidado no express
  //console.log(req.body)

  //inserir dados na db
  db.serialize(() => {
    //criar uma tabela com comandos SQL
    db.run(`
      CREATE TABLE IF NOT EXISTS places (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        image TEXT,
        name TEXT,
        address TEXT,
        address2 TEXT,
        state TEXT,
        city TEXT,
        items TEXT
      );
    `);

    //inserir dados na tabela
    const query = `
    INSERT INTO places (
      image, 
      name, 
      address, 
      address2, 
      state, 
      city,
      items
    ) VALUES (?,?,?,?,?,?,?);
  `;
    const values = [
      req.body.image,
      req.body.name,
      req.body.address,
      req.body.address2,
      req.body.state,
      req.body.city,
      req.body.items,
    ];
    function afterInsertData(err) {
      if (err) {
        console.log(err);
        return res.send('Erro no cadastro.')
      }
      console.log("Cadatrado com sucesso.");
      return res.render("create-point.html", { saved: true});
    }

    db.run(query, values, afterInsertData);
  });  
});

server.get("/search", (req, res) => {
  const search = req.query.search

  if (search == ""){
    //pesquisa vazia
    return res.render("search-results.html", { total: 0 });
  }

  //pegar os dados do db
  db.all(`SELECT * FROM places WHERE city LIKE '%${search}%'`, function (err, rows) {
    if (err) {
      return console.log(err);
    }
    const total = rows.length;

    //mostrar a página html com os dados do db
    return res.render("search-results.html", { places: rows, total });
  });
});

//ligar o servidor
server.listen(3000); //o número é a porta para ligar o servidor
