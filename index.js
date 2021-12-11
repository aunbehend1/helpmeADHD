const express = require('express');
const app = express();
const mongoose=require('mongoose');
const dotenv = require('dotenv')
const passport = require('passport')
const session = require('express-session')
const MongoStore = require("connect-mongo");
const helpMeTask = require("./models/helpMeTask");


app.use('/static', express.static("public"));

app.use(express.urlencoded({ extended: true }));


const PORT = process.env.PORT||8080;
dotenv.config({ path: './config/config.env' })

mongoose.connect(process.env.MONGO_URI,{
    useNewUrlParser:true,
    useUnifiedTopology: true
})

// Passport config
require('./config/passport')(passport)



// Middleware
app.use(express.urlencoded({extended:true}))
app.use(express.static('public'))

app.set('view engine','ejs');

app.use(
    session({
      secret: 'scotchscotchscotchIlovescotch',
      resave: false,
      saveUninitialized: false,
      store: MongoStore.create({mongoUrl:process.env.MONGO_URI}),
    })
  )

  // Passport middleware
app.use(passport.initialize())
app.use(passport.session())


app.use(require("./routes/index"))
app.use('/auth', require('./routes/auth'))

app.get('/reports', (req,res) => {
  res.render('reports');
});

app.get("/tasks", (req, res) => {
  helpMeTask.find({}, (err, tasks) => {
      res.render("tasks.ejs", { helpmeTasks: tasks });
  });
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
          if (err) return res.send(500, err);
          res.redirect("/tasks");
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
          if (err) return res.send(500, err);res.redirect("/");
      });
  });

//DELETE
app.route("/remove/:id").get((req, res) => {
  const id = req.params.id;
  helpMeTask.findByIdAndRemove(id, err => {
      if (err) return res.send(500, err);
      res.redirect("/");
  });
});

app.route("/done/:id").get((req, res, next) => {
  const id = req.params.id; 
  helpMeTask.findOneAndUpdate({id,  taskComplete:true, completedDate: Date.now()})
  .then(()=>{
      console.log("task completed")
      res.redirect('/')
      next()
  })
  .catch((err)=>console.log(err));
});

app.listen(PORT,console.log(`listening at ${PORT}`))
