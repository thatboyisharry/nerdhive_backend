const express=require('express');
const router=express.Router();
const dataConnection = require('../models/connections/data');
const User=dataConnection.models.User;


const {v1} =require('uuid');
const uuidv1 = v1;

router.get('/',async(req,res)=>{
  console.log("insisde get users...")
    try{
        let users = await User.find({})
        if(users!==null){
            console.log("found users")
            res.status(201).json({success:true,users:users})
        }
       
    }catch(error){
        console.log(error);
        res.status(400).json({success:false})
    }
})

router.post('/',async(req,res)=>{
    
})

router.get('/:id',async(req,res)=>{
  console.log("insisde get user...")
    const id = req.params.id;
    try{
        let user = await User.findOne({phone:id})
        if(user==null){
          let id = id
          user = await User.findOne({id:id});
          
        }
         console.log(user)
        res.status(201).json({success:true,user:user})
    }catch(error){
        console.log(error);
    }
})

router.post('/:id',async(req,res)=>{
    const id = req.params.id;
    const user = req.body.user
    console.log("insisde update user...")
    try{
         
      let updatedUser= await User.findByIdAndUpdate(user._id,user);
      
      console.log("updated user")
      console.log(updatedUser)
      res.status(201).json({success:true,user:updatedUser})
       
    }catch(error){
        console.log(error);
        res.status(400).json({success:false})
    }
})

router.delete('/:id',async(req,res)=>{
    const user = req.body.user
   
    try{
        await User.findByIdAndRemove(user._id),
        res.status(201).json({success:true})
        
       
    }catch(error){
        console.log(error);
        res.status(400).json({success:false})
    }
})

module.exports=router;