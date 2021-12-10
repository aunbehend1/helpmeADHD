const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const {ensureAuthenticated} = require('../helpers/auth');
const Tasks = require("../models/TodoTask")


app.get("/tasks/incomplete", (req, ensureAuthenticated, res) => {
        Todo.find({user: req.user.id}).then(todos => {
          res.render('todoEdit.ejs', {
            todos:todos
          })
        }) // find something in DB
      });


  app.post('/', async (req, res) => { 
    const todoTask = new TodoTask({
        content: req.body.content
    });
        try {
            await todoTask.save();
            res.redirect("/tasks");
        } catch (err) {
            res.redirect("/tasks");
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
            if (err) return res.send(500, err);res.redirect("/tasks");
        });
    });
  
  //DELETE
  app.route("/remove/:id").get((req, res) => {
    const id = req.params.id;
    TodoTask.findByIdAndRemove(id, err => {
        if (err) return res.send(500, err);
        res.redirect("/tasks");
    });
  });