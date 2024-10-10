const express = require("express")
const path = require("path")
const fs = require("node:fs");

const app = express()

app.use(express.urlencoded({ extended: true }));

app.set("view engine", "ejs")
app.set("views", path.join(__dirname, "views"))

const readFile = (tasks) => {
    return new Promise ((resolve, reject)=> {
        fs.readFile(tasks, "utf8", (err, data) => {
            if (err) {
                console.error(err);
                return;
            }
            const tasks = data.split("\n")
            resolve(tasks)
        });
    })
}

app.get("/", (req, res) => {
    readFile("./tasks")
        .then((tasks) => {
            console.log(tasks)
            res.render("index", {tasks: tasks})
    }) 
});

app.post("/", (req, res) => {
    console.log("Saadetud andmed")
    let task = req.body.task
    readFile("./tasks")
    .then(tasks => {
        tasks.push(task)
        console.log(tasks)
        const data = tasks.join("\n")
        fs.writeFile('./tasks', data, err => {
            if (err) {
              console.error(err);
            } else {
                res.redirect("./")
            }
          });
    }) 
}) 
app.listen(5005, () => {
    console.log("Näidisäpp on käivitatud http://localhost:5005")
})