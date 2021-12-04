const express = require("express");
const app = express();
const dotenv = require("dotenv");
const mongoose = require("mongoose");
var session = require('express-session');
var passport = require('passport');

dotenv.config();

const TodoTask = require("./models/TodoTask");

app.use('/static', express.static("public"));

app.use(express.urlencoded({ extended: true }));



mongoose.connect(process.env.DB_CONNECT, { useNewUrlParser: true }, () => {
    console.log("Connected to db!");
    
    app.listen(3000, () => console.log("Server Up and running"));
});

app.set("view engine", "ejs");
app.use(session({ secret: 'ilovescotchscotchyscotchscotch' })); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions

app.get("/", (req, res) => {
    TodoTask.find({}, (err, tasks) => {
        res.render("todo.ejs", { todoTasks: tasks });
    });
});

app.get('/login', (req,res) => {
    res.render('login');
 });

 app.get('/reports', (req,res) => {
    res.render('reports');
 });

 app.get('/timer', (req,res) => {
    res.render('timer');
 });
app.post('/', async (req, res) => { 
    const todoTask = new TodoTask({
        content: req.body.content
    });
        try {
            await todoTask.save();
            res.redirect("/");
        } catch (err) {
            res.redirect("/");
        }}
    );



app.route("/edit/:id").get((req, res) => {
    const id = req.params.id;
    TodoTask.find({}, 
        (err, tasks) => {
            res.render("todoEdit.ejs", { 
                todoTasks: tasks, idTask: id 
            });
        });
    }).post((req, res) => {
        const id = req.params.id;
        TodoTask.findByIdAndUpdate(id, { content: req.body.content }, err => {
            if (err) return res.send(500, err);res.redirect("/");
        });
    });

//DELETE
app.route("/remove/:id").get((req, res) => {
    const id = req.params.id;
    TodoTask.findByIdAndRemove(id, err => {
        if (err) return res.send(500, err);
        res.redirect("/");
    });
});

app.route("/done/:_id").get((req, res) => {
    const id = req.params.id; 
    TodoTask.updateOne({id,  taskComplete:true})
    .then(()=>{
        console.log("task completed")
        res.redirect('/')
    })
    .catch((err)=>console.log(err));
});
