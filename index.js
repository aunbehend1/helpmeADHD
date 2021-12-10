const express = require('express');
const app = express();
const mongoose=require('mongoose');
const dotenv = require('dotenv')
const passport = require('passport')
const session = require('express-session')
const MongoStore = require("connect-mongo");
const TodoTask = require("./models/TodoTask");


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
  TodoTask.find({}, (err, tasks) => {
      res.render("todo.ejs", { todoTasks: tasks });
  });
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
          if (err) return res.send(500, err);
          res.redirect("/tasks");
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

app.listen(PORT,console.log(`listening at ${PORT}`))
