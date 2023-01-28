const passport =require('passport');
const bcrypt = require('bcrypt');
const { request } = require('express');
const cors=require('cors');


module.exports= function(app,User){

    //middleware
    const ensureAuthenticated=(req,res,next)=>{
        if(req.isAuthenticated()){
          console.log("logged in")
          return next();
        }
      
        console.log("not logged in")
      }
    //authentication routes
    app.post('/register',(req,res)=>{
        User.findOne({username:req.body.username},async(err,user)=>{
          if(err) console.log(err);
          if(user) res.send("User already exists");
          if(req.body.password1!==req.body.password2) res.send("Passwords do not match")
          if(!user){
            const hashedPassword=bcrypt.hashSync(req.body.password1,12);
            const newUser= new User({
              username:req.body.username,
              password:hashedPassword
            });
      
            await newUser.save((err,user)=>{
              if(err) console.log(err);
              res.json({success:true,user:req.user});
              console.log("User created");
            })
          }
        })
      })
    app.post('/login',passport.authenticate('local',{failuireRedirect:'/auth/failure',successRedirect:'/auth/success'}));
    app.get('/auth/google',passport.authenticate('google',{scope: ['email','profile']}));
    app.get('/google/callback',passport.authenticate('google',{faluireRedirect:'/auth/failure',successredirect:'/auth/success'}));

    app.get('/auth/failure',(req,res)=>{
      res.json({success:false})
      console.log("something went wrong")
    });
    app.get('/auth/success',(req,res)=>{
      res.json({success:true,sessionID:req.sessionID});
      console.log("authenticated")
      console.log(req.sessionID)
    });
    //API ROUTES
    // app.use(ensureAuthenticated);
//     app.get("/api/",(req,res)=>{
//         res.sendFile(path.join(__dirname,'/views/index.html'));
//       })
  
    app.use('/api/learners',require('./learners')) 
    app.use('/api/leads',require('./leads')) 
    app.use('/api/support',require('./customer.support'))
    app.use('/api/support/queries',require('./support.queries')) 
    app.use('/api/tutors',require('./tutors')) 
    app.use('/api/coaches',require('./coaches')) 
    app.use('/api/lessons',require('./lessons'))
    app.use('/api/timetables',require('./timetables')) 
    app.use('/api/parents',require('./parents'))
    // app.use('/api/accounts',require('./accounts'))
    app.use('/api/jobs',require('./jobs'))
    app.use('/api/users',require('./users'))
    app.use('/api/questions',require('./questions'))
    app.use('/webhook',require('./webhook'));
    app.use('/uploads',require('./uploads'));
   
}