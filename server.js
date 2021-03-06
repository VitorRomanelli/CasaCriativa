const express = require("express")
const server = express()

const db = require("./db")

//const ideias = [
//    {
//        img: "https://image.flaticon.com/icons/svg/2729/2729007.svg",
//        title:"Cursos de Programação",
//        category: "Estudo",
//        description: "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Nihil, est! Atque illum libero, voluptates ut illo praesentium odio voluptas id ullam, dolor sint quae, quis temporibus doloremque! Commodi, blanditiis voluptatem!",
//        url: "https://rocketseat.com.br"
//
//    },
//
//   {
//        img: "https://image.flaticon.com/icons/svg/2729/2729005.svg",
//        title:"Exercicios",
//        category: "Saúde",
//        description: "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Nihil, est! Atque illum libero, voluptates ut illo praesentium odio voluptas id ullam, dolor sint quae, quis temporibus doloremque! Commodi, blanditiis voluptatem!",
//        url: "https://rocketseat.com.br"
//
//    },
//
//    {
//        img: "https://image.flaticon.com/icons/svg/2729/2729027.svg",
//        title:"Meditação",
//        category: "Mentalidade",
//        description: "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Nihil, est! Atque illum libero, voluptates ut illo praesentium odio voluptas id ullam, dolor sint quae, quis temporibus doloremque! Commodi, blanditiis voluptatem!",
//        url: "https://rocketseat.com.br"
//
//    },
//
//    {
//        img: "https://image.flaticon.com/icons/svg/2746/2746368.svg",
//        title:"Karaoke",
//        category: "Diversão",
//        description: "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Nihil, est! Atque illum libero, voluptates ut illo praesentium odio voluptas id ullam, dolor sint quae, quis temporibus doloremque! Commodi, blanditiis voluptatem!",
//        url: "https://rocketseat.com.br"
//
//    }
//]

server.use(express.static("public"))

server.use(express.urlencoded({ extended: true}))

const nunjucks = require("nunjucks")
nunjucks.configure("views", {
    express: server,
    noCache: true,
})

server.get("/", function(req, res) {

    db.all(`SELECT * FROM ideas`, function(err, rows){
        if (err) {
            console.log(err)
            return res.send("Erro no Banco de Dados...")
        }

        const reversedIdeas = [...rows].reverse()
        
        let lastIdeas = []
        for(idea of reversedIdeas){
            if(lastIdeas.length < 3){
                lastIdeas.push(idea)
            }
        }

        return res.render("index.html", { ideias: lastIdeas })
    })
})

server.get("/ideias", function(req, res) {

    db.all(`SELECT * FROM ideas`, function(err, rows) {
        if (err) {
            console.log(err)
            return res.send("Erro no Banco de Dados...")
        }    
        
        return res.render("ideias.html", { ideias: rows })
    })

})

server.post("/", function(req, res) {
    const query = `
    INSERT INTO ideas(
        image,
        title,
        category,
        description,
        link
    ) VALUES (?,?,?,?,?);
    `

    const values = [
        req.body.image,
        req.body.title,
        req.body.category,
        req.body.description,
        req.body.link
    ]
    
    db.run(query, values, function (err) {
        if (err) {
            console.log(err)
            return res.send("Erro no Banco de Dados...")
        }
        
        return res.redirect("/ideias")
    })    
    
})

server.listen(3000)