const express=require('express');
const router=express.Router();
const { LearnerQuestion } = require('../models/learner.question.model');


router.get('/',async(req,res)=>{
    try{
        let questions = await LearnerQuestion.find({})
        if(questions!==null){
            console.log("found questions")
            res.status(201).json({success:true,questions:questions})
        }
       
    }catch(error){
        console.log(error);
        res.status(400).json({success:false})
    }
})

router.get('/:id',async(req,res)=>{
    const id = req.params.id;
    try{
        let question = await LearnerQuestion.findOne({userId:id})
        if(question!==null){
            console.log("found question")
            res.status(201).json({success:true,question:question})
        }
       
    }catch(error){
        console.log(error);
        res.status(400).json({success:false})
    }
})

router.post('/:id',async(req,res)=>{
    const id = req.params.id;
    const question = req.body.question
    try{
        let updatedQuestion= await LearnerQuestion.findByIdAndUpdate(question._id,question)
        if(updatedQuestion!==null){
            console.log("updated question")
            console.log(updatedQuestion)
            res.status(201).json({success:true})
        }
       
    }catch(error){
        console.log(error);
        res.status(400).json({success:false})
    }
})

router.delete('/:id',async(req,res)=>{
    const question = req.body.question
   
    try{
        await LearnerQuestion.findByIdAndRemove(question._id),
        res.status(201).json({success:true})
        
       
    }catch(error){
        console.log(error);
        res.status(400).json({success:false})
    }
})

module.exports=router;
