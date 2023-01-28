const express=require('express');
const router=express.Router();
const dataConnection = require('../models/connections/data');
const Tutor=dataConnection.models.Tutor;
const { createUserCode,createTimetable } = require('../services/utils');
const { addTimetable } = require('../services/apiCalls');
const {v1} =require('uuid');
const uuidv1 = v1;


router.get('/',async(req,res)=>{
    try{
        let tutors = await Tutor.find({})
        if(tutors!==null){
            console.log("found tutors")
            res.status(201).json({success:true,tutors:tutors})
        }
       
    }catch(error){
        console.log(error);
        res.status(400).json({success:false})
    }
})

router.post('/',async(req,res)=>{
  const tutor=req.body.tutor;
    let userId=uuidv1();
    tutor.userId=userId;
    tutor.phone = "27"+tutor.phone;
    tutor.tutorCode=createUserCode(tutor);
    let timetable = createTimetable(userId)
    
    try{
        let newTutor= new Tutor(tutor);
        let savedTutor = await newTutor.save(); 
        console.log(savedTutor);
         await addTimetable(timetable);
        res.status(201).json({success:true,tutor:savedTutor})
    }catch(error){
        console.log(error)
        res.status(201).json({success:true})
    }
    
})

router.get('/:id',async(req,res)=>{
    const id = req.params.id;
    try{
        let tutor = await Tutor.findOne({userId:id})
        if(tutor!==null){
            console.log("found tutor")
            res.status(201).json({success:true,tutor:tutor})
        }
       
    }catch(error){
        console.log(error);
        res.status(400).json({success:false})
    }
})

router.post('/:id',async(req,res)=>{
    const id = req.params.id;
    const tutor = req.body.tutor
    try{
        let updatedTutor= await Tutor.findByIdAndUpdate(tutor._id,tutor)
        if(updatedTutor!==null){
            console.log("updated tutor")
            console.log(updatedTutor)
            res.status(201).json({success:true})
        }
       
    }catch(error){
        console.log(error);
        res.status(400).json({success:false})
    }
})

router.delete('/:id',async(req,res)=>{
    const tutor = req.body.tutor
   
    try{
        await Tutor.findByIdAndRemove(tutor._id),
        res.status(201).json({success:true})
        
       
    }catch(error){
        console.log(error);
        res.status(400).json({success:false})
    }
})

module.exports=router;
