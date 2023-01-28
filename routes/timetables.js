const express=require('express');
const router=express.Router();
const { Timetable } = require('../models/timetable.model');


router.get('/',async(req,res)=>{
    try{
        let timetables = await Timetable.find({})
        if(timetables!==null){
            console.log("found timetables")
            res.status(201).json({success:true,timetables:timetables})
        }
       
    }catch(error){
        console.log(error);
        res.status(400).json({success:false})
    }
})

router.get('/:id',async(req,res)=>{
    const id = req.params.id;
    try{
        let timetable = await Timetable.findOne({userId:id})
        if(timetable!==null){
            console.log("found timetable")
            res.status(201).json({success:true,timetable:timetable})
        }
       
    }catch(error){
        console.log(error);
        res.status(400).json({success:false})
    }
})

router.post('/:id',async(req,res)=>{
    const id = req.params.id;
    const timetable = req.body.timetable
    try{
        let updatedTimetable= await Timetable.findByIdAndUpdate(timetable._id,timetable)
        if(updatedTimetable!==null){
            console.log("updated timetable")
            console.log(updatedTimetable)
            res.status(201).json({success:true})
        }
       
    }catch(error){
        console.log(error);
        res.status(400).json({success:false})
    }
})

router.delete('/:id',async(req,res)=>{
    const timetable = req.body.timetable
   
    try{
        await Timetable.findByIdAndRemove(timetable._id),
        res.status(201).json({success:true})
        
       
    }catch(error){
        console.log(error);
        res.status(400).json({success:false})
    }
})

module.exports=router;
