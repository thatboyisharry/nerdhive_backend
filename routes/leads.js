const express=require('express');
const router=express.Router();
const dataConnection = require('../models/connections/data');
const Lead=dataConnection.models.Lead;
const { createUserCode,createTimetable } = require('../services/utils');
const { addTimetable } = require('../services/apiCalls');
const {v1} =require('uuid');
const uuidv1 = v1;

router.get('/',async(req,res)=>{
  console.log("insisde get leads...")
    try{
        let leads = await Lead.find({})
        if(leads!==null){
            console.log("found leads")
            res.status(201).json({success:true,leads:leads})
        }
       
    }catch(error){
        console.log(error);
        res.status(400).json({success:false})
    }
})

router.post('/',async(req,res)=>{
    const lead = req.body
    let userId=uuidv1();
    lead.userId=userId;
    lead.phone = "27"+lead.phone;
    lead.leadCode=createUserCode(lead);
    let timetable = createTimetable(userId)
    
    try{
        let newLead= new Lead(lead)
        let savedLead = await newLead.save(); 
        console.log(savedLead);
        await addTimetable(timetable);
        res.status(201).json({success:true,lead:savedLead})
    }catch(error){
        console.log(error)
        res.status(400).json({success:false})
    }
    
})

router.get('/:id',async(req,res)=>{
    const id = req.params.id;
    try{
        let lead = await Lead.findOne({userId:id})
        if(lead!==null){
            console.log("found lead")
            res.status(201).json({success:true,lead:lead})
        }
       
    }catch(error){
        console.log(error);
        res.status(400).json({success:false})
    }
})

router.post('/:id',async(req,res)=>{
    const id = req.params.id;
    const lead = req.body.lead
    try{
        let updatedLead= await Lead.findByIdAndUpdate(lead._id,lead)
        if(updatedLead!==null){
            console.log("updated Lead")
            console.log(updatedLead)
            res.status(201).json({success:true})
        }
       
    }catch(error){
        console.log(error);
        res.status(400).json({success:false})
    }
})

router.delete('/:id',async(req,res)=>{
    const lead = req.body.lead
   
    try{
        await Lead.findByIdAndRemove(lead._id),
        res.status(201).json({success:true})
        
       
    }catch(error){
        console.log(error);
        res.status(400).json({success:false})
    }
})

module.exports=router;