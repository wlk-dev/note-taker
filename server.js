const express = require("express");
const path = require("path")
const fs = require("fs");

var data = require("./db/db.json");

const app = express();
const PORT = 3001;

app.use(express.urlencoded({extended : true}))
app.use(express.json())

app.use(express.static("public"))

app.get("/notes", (req, res) => res.sendFile(path.join(__dirname, "./public/notes.html")))

app.get("/api/notes", (req, res) => res.json(data))

app.post("/api/notes", (req, res) => {
    const {title, text, id} = req.body

    if (title && text && id) {
        data.push( {title : title, text : text, id : id} )
        fs.writeFileSync(path.join(__dirname, "./db/db.json"), JSON.stringify(data))
        res.status(200).json({"msg" : "success"})
    } else {
        req.status(400).json({msg : `missing some parameters, 2 needed, got : ${[title, text]}`})
    }

})

app.delete("/api/notes/:id", (req, res) => {
    const id = req.params.id
    if (id) {
        data = data.filter((note) => note.id !== id)
        fs.writeFileSync(path.join(__dirname, "./db/db.json"), JSON.stringify(data))
        res.status(200).json({msg:"success"})
    } else{
        res.status(400).json({msg:"no id was provided"})
    }
    
})


app.listen(PORT, () => console.log(`App started @ http://localhost:${PORT}`))