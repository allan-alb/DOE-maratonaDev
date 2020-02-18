// Incluindo dotenv para ocultar informações sensíveis (ver .env.example)
require('dotenv/config');

// Configurando o servidor
const express = require("express")
const server = express()

// Configurando o servidor para apresentar arquivos estáticos
server.use(express.static("public"))

// Habilitando body do formulário
server.use(express.urlencoded({ extended:true }))

//Configurando a conexão com o banco de dados
const Pool = require('pg').Pool
const db = new Pool({
    user: process.env.DB_USER,      // Obter a informação do arquivo .env
    password: process.env.DB_PASS,  // Obter a informação do arquivo .env
    host: process.env.DB_HOST,      // Obter a informação do arquivo .env
    port: process.env.DB_PORT,      // Obter a informação do arquivo .env
    database: process.env.DB_NAME   // Obter a informação do arquivo .env
})

// Configurando a template engine
const nunjucks = require("nunjucks")
nunjucks.configure("./", {
    express: server,
    noCache: true
})

// Array de doadores 
/*const donors = [
    {
        name: "Diego Fernandes",
        blood: "AB+"    
    },
    {
        name: "Cleiton Souza",
        blood: "B+"    
    },
    {
        name: "Robson Marques",
        blood: "O+"    
    },
    {
        name: "Mayk Brito",
        blood: "A-"    
    },
]*/

//Configurando a apresentação da página
server.get("/", function(req, res){
    db.query("SELECT * FROM donors", function(err, result){
        if (err) return res.send("Erro no banco de dados.")

        const donors = result.rows
        return res.render("index.html", { donors })
    })

})

server.post("/", function(req, res){
    //pegar dados do formulario
    const name = req.body.name
    const email = req.body.email
    const blood = req.body.blood

    if (name == "" || email == "" || blood == ""){
        return res.send("Todos os campos são obrigatórios.")
    }
    
    // Inserindo valores no BD
    const query = `INSERT INTO donors ("name", "email", "blood") VALUES ($1, $2, $3)`
    db.query(query, [name, email, blood], function(err){
        if (err) return res.send("Erro no banco de dados.")

        return res.redirect("/")
    })
    
    // Inserindo valores em um array
    /*donors.push({
        name: name,
        blood: blood
    })*/
})

// Iniciando servidor na porta 3000
server.listen(3000, function(){
    console.log("Server started, listening on port 3000")
})