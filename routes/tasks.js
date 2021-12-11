const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const {ensureAuthenticated} = require('../helpers/auth');
const helpMeTask = require('../models/helpMeTask');
const Tasks = require("../models/helpMeTask")


app.get("/tasks/incomplete", (req, ensureAuthenticated, res) => {
        Tasks.find({user: req.user.id}).then(tasks => {
          res.render('tasksEdit.ejs', {
            tasks:tasks
          })
        }) // find something in DB
      });


  app.post('/', async (req, res) => { 
    const helpMeTask = new helpMeTask({
        content: req.body.content
    });
        try {
            await helpMeTask.save();
            res.redirect("/tasks");
        } catch (err) {
            res.redirect("/tasks");
        }}
    );
  
  
  
  app.route("/edit/:id").get((req, res) => {
    const id = req.params.id;
    helpMeTask.find({}, 
        (err, tasks) => {
            res.render("taskEdit.ejs", { 
                helpmeTasks: tasks, idTask: id 
            });
        });
    }).post((req, res) => {
        const id = req.params.id;
        helpMeTask.findByIdAndUpdate(id, { content: req.body.content }, err => {
            if (err) return res.send(500, err);res.redirect("/tasks");
        });
    });
  
  //DELETE
  app.route("/remove/:id").get((req, res) => {
    const id = req.params.id;
    helpMeTask.findByIdAndRemove(id, err => {
        if (err) return res.send(500, err);
        res.redirect("/tasks");
    });
  });