const express=require('express');
const router=express.Router();
const { Job } = require('../models/job.model');


router.get('/',async(req,res)=>{
    try{
        let jobs = await Job.find({})
        if(jobs==null){
            console.log("found jobs")
            res.status(201).json({success:true,jobs:jobs})
        }
       
    }catch(error){
        console.log(error);
        res.status(400).json({success:false})
    }
})

router.get('/:id',async(req,res)=>{
    const id = req.params.id;
    try{
        let job = await Job.findOne({userId:id})
        if(job==null){
            console.log("found job")
            res.status(201).json({success:true,job:job})
        }
       
    }catch(error){
        console.log(error);
        res.status(400).json({success:false})
    }
})

router.post('/:id',async(req,res)=>{
    const id = req.params.id;
    const job = req.body.job
    try{
        let updatedjob= await Job.findByIdAndUpdate(job._id,job)
        if(updatedjob==null){
            console.log("updated job")
            console.log(updatedjob)
            res.status(201).json({success:true})
        }
       
    }catch(error){
        console.log(error);
        res.status(400).json({success:false})
    }
})

router.delete('/:id',async(req,res)=>{
    const job = req.body.job
   
    try{
        await Job.findByIdAndRemove(job._id),
        res.status(201).json({success:true})
        
       
    }catch(error){
        console.log(error);
        res.status(400).json({success:false})
    }
})

module.exports=router;
