const express=require('express');
const router=express.Router();
const dataConnection = require('../models/connections/data');
const Learner=dataConnection.models.Learner;
const { createUserCode,createTimetable } = require('../services/utils');
const { addTimetable } = require('../services/apiCalls');
const {v1} =require('uuid');
const uuidv1 = v1;

router.get('/',async(req,res)=>{
  console.log("insisde get learners...")
    try{
        let learners = await Learner.find({})
        if(learners!==null){
            console.log("found learners")
            res.status(201).json({success:true,learners:learners})
        }
       
    }catch(error){
        console.log(error);
        res.status(400).json({success:false})
    }
})

router.post('/',async(req,res)=>{
    const learner = req.body
    let userId=uuidv1();
    learner.userId=userId;
    learner.phone = "27"+learner.phone;
    learner.learnerCode=createUserCode(learner);
    let timetable = createTimetable(userId)
    
    try{
        let newLearner= new Learner(learner)
        let savedLearner = await newLearner.save(); 
        console.log(savedLearner);
        await addTimetable(timetable);
        res.status(201).json({success:true,learner:savedLearner})
    }catch(error){
        console.log(error)
        res.status(400).json({success:false})
    }
    
})

router.get('/:id',async(req,res)=>{
    const id = req.params.id;
    try{
        let learner = await Learner.findOne({userId:id})
        if(learner!==null){
            console.log("found learner")
            res.status(201).json({success:true,learner:learner})
        }
       
    }catch(error){
        console.log(error);
        res.status(400).json({success:false})
    }
})

router.post('/:id',async(req,res)=>{
    const id = req.params.id;
    const learner = req.body.learner
    try{
        let updatedLearner= await Learner.findByIdAndUpdate(learner._id,learner)
        if(updatedLearner!==null){
            console.log("updated Learner")
            console.log(updatedLearner)
            res.status(201).json({success:true})
        }
       
    }catch(error){
        console.log(error);
        res.status(400).json({success:false})
    }
})

router.delete('/:id',async(req,res)=>{
    const learner = req.body.learner
   
    try{
        await Learner.findByIdAndRemove(learner._id),
        res.status(201).json({success:true})
        
       
    }catch(error){
        console.log(error);
        res.status(400).json({success:false})
    }
})

module.exports=router;