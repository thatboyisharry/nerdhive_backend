const express=require('express');
const router=express.Router();
const dataConnection = require('../models/connections/data');
const Coach=dataConnection.models.Coach;
const { createUserCode,createTimetable } = require('../services/utils');
const { addTimetable } = require('../services/apiCalls');
const {v1} =require('uuid');
const uuidv1 = v1;


router.get('/',async(req,res)=>{
    try{
        let coaches = await Coach.find({})
        if(coaches!==null){
            console.log("found coaches")
            res.status(201).json({success:true,coaches:coaches})
        }
       
    }catch(error){
        console.log(error);
        res.status(400).json({success:false})
    }
})
router.post('/',async(req,res)=>{
    const coach = req.body.coach
    let timetable=null;
    if(!coach.userId){
      let userId=uuidv1();
      coach.userId=userId;
      coach.phone = "27"+coach.phone;
      coach.coachCode=createUserCode(coach);
      timetable = createTimetable(userId)
    }else{
      //promoting tutor to coach
      coach.coachCode=coach.tutorCode
    }
    
    
    try{
        let newCoach= new Coach(coach)
        let savedCoach = await newCoach.save(); 
        console.log(savedCoach);
        if(timetable!==null){
          await addTimetable(timetable);
        }
        
        res.status(201).json({success:true,coach:savedCoach})
    }catch(error){
        console.log(error)
        res.status(400).json({success:false})
    }
    
})

router.get('/:id',async(req,res)=>{
    const id = req.params.id;
    try{
        let coach = await Coach.findOne({userId:id})
        if(coach!==null){
            console.log("found coach")
            res.status(201).json({success:true,coach:coach})
        }
       
    }catch(error){
        console.log(error);
        res.status(400).json({success:false})
    }
})

router.post('/:id',async(req,res)=>{
    const id = req.params.id;
    const coach = req.body.coach
    try{
        let updatedCoach= await Coach.findByIdAndUpdate(coach._id,coach)
        if(updatedCoach!==null){
            console.log("updated coach")
            console.log(updatedCoach)
            res.status(201).json({success:true})
        }
       
    }catch(error){
        console.log(error);
        res.status(400).json({success:false})
    }
})

router.delete('/:id',async(req,res)=>{
    const coach = req.body.coach
   
    try{
        await Coach.findByIdAndRemove(coach._id),
        res.status(201).json({success:true})
        
       
    }catch(error){
        console.log(error);
        res.status(400).json({success:false})
    }
})

module.exports=router;