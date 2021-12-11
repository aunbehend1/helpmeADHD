const router = require('express').Router()
//importing middleware
const { ensureAuth, ensureGuest } = require('../middleware/auth')

router.get('/', ensureGuest ,(req, res) => {
    res.render('login')
  })

  router.get("/log",ensureAuth, async(req,res)=>{
    const user=await helpMeTask.find({email_:req.user.email});
    res.render('index',{task:user,userinfo:req.user})
})
module.exports=router;