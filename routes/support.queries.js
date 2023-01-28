const express=require('express');
const router=express.Router();
const dataConnection = require('../models/connections/data');
const CustomerQuery=dataConnection.models.CustomerQuery;
const { createUserCode} = require('../services/utils');
const { getUser } = require('../services/apiCalls');
const {v1} =require('uuid');
const uuidv1 = v1;


router.get('/',async(req,res)=>{
    try{
        let customerQueries = await CustomerQuery.find({})
        if(customerQueries!==null){
            console.log("found customerQueries")
            res.status(201).json({success:true,customerQueries:customerQueries})
        }
       
    }catch(error){
        console.log(error);
        res.status(400).json({success:false})
    }
})
router.post('/',async(req,res)=>{
    const customerQuery = req.body.customerQuery
    
    
    
    try{
        
       if(!customerQuery.id){
         customerQuery.id=uuidv1()
       }
        
        let newCustomerQuery= new CustomerQuery(customerQuery)
        let savedCustomerQuery = await newCustomerQuery.save(); 
        console.log(savedCustomerQuery,"saved query");
        
        res.status(201).json({success:true,customerQuery:savedCustomerQuery})
    }catch(error){
        console.log(error)
        res.status(400).json({success:false})
    }
    
})

router.get('/:id',async(req,res)=>{
    const id = req.params.id;
    try{
        let customerQuery = await CustomerQuery.findOne({userId:id})
        if(customerQuery!==null){
            console.log("found customerQuery")
            res.status(201).json({success:true,customerQuery:customerQuery})
        }
       
    }catch(error){
        console.log(error);
        res.status(400).json({success:false})
    }
})

router.post('/:id',async(req,res)=>{
    const id = req.params.id;
    const customerQuery = req.body.customerQuery
    try{
        let updatedCustomerQuery= await CustomerQuery.findByIdAndUpdate(customerQuery._id,customerQuery)
        if(updatedCustomerQuery!==null){
            console.log("updated customerQuery")
            console.log(updatedCustomerQuery)
            res.status(201).json({success:true})
        }
       
    }catch(error){
        console.log(error);
        res.status(400).json({success:false})
    }
})

router.delete('/:id',async(req,res)=>{
    const customerQuery = req.body.customerQuery
   
    try{
        await CustomerQuery.findByIdAndRemove(customerQuery._id),
        res.status(201).json({success:true})
        
       
    }catch(error){
        console.log(error);
        res.status(400).json({success:false})
    }
})

module.exports=router;