const express = require("express")
const path = require("path")

const app = express()

app.set("view engine", "ejs")
app.set("views", path.join(__dirname, "views"))

app.get("/", (req, res) => {
    res.render("index")
})

app.listen(5005, () => {
    console.log("Näidisäpp on käivitatud http://localhost:5005")
})