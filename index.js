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
            const tasks = JSON.parse(data)
            resolve(tasks)
        });
    })
}

app.get("/", (req, res) => {
    readFile("./tasks.json")
        .then((tasks) => {
            console.log(tasks)
            res.render("index", {tasks: tasks})
    }) 
});

app.post("/", (req, res) => {
    console.log("Saadetud andmed")
    let task = req.body.task
    readFile("./tasks.json")
    .then(tasks => {
        // add new task
        //create ID automatically
        let index
        if (tasks.length === 0)
        {
            index = 0
        } else {
            index = tasks[tasks.length-1].id +1;
        }
        // create task object
        const newTask = {
            "id" : index,
            "task" : req.body.task
        }
        console.log (newTask)
        // add form sent task to tasks array
        tasks.push(newTask)
        console.log(tasks)
        data = JSON.stringify(tasks, null, 2)
        console.log(data)

        fs.writeFile('./tasks.json', data, err => {
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