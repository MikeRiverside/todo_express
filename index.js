const express = require('express')
const path = require('path')
const fs = require('node:fs');

const app = express()

app.use(express.urlencoded({ extended: true }))

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

const readFile = (filename) => {
    return new Promise((resolve, reject) => {
        fs.readFile(filename, 'utf8', (err, data) => {
            if (err) {
              console.error(err);
              return;
            }
            const tasks = JSON.parse(data) 
            resolve(tasks)
        });
    })
} 

app.get('/', (req, res) => {
    readFile('./tasks.json')
        .then((tasks) => { 
            res.render('index', {tasks: tasks})
    })   
})

app.post('/', (req, res) => {
    console.log('form sent data')
    let task = req.body.task
    readFile('./tasks.json')
        .then((tasks) => {
            let index
            if(tasks.length === 0){
                index = 0
            } else {
                index = tasks[tasks.length - 1].id + 1 
            } 

            const newTask = {
                id: index,
                task: task
            } 

            tasks.push(newTask)
            console.log(tasks)
            
            const data = JSON.stringify(tasks, null, 2)

            fs.writeFile('./tasks.json', data, err => {
                if (err) {
                  console.error(err);
                } else {
                    res.redirect('/')
                }
            });
    })
})

app.get('/delete-task/:taskId', (req, res) => {
    let deletedTaskId = parseInt(req.params.taskId)
    readFile('./tasks.json')
        .then(tasks => {
            tasks.forEach((task, index) => {
                if(task.id === deletedTaskId){
                    tasks.splice(index, 1)
                } 
            });
            
            const data = JSON.stringify(tasks, null, 2)
            fs.writeFile('./tasks.json', data, err => {
                if (err) {
                  console.error(err);
                } else {
                    res.redirect('/')
                }
            });
        })
})


app.listen(5005, () => {
    console.log("Näidisäpp on käivitatud http://localhost:5005")
})