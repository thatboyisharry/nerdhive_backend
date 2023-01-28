const express=require('express');
const router=express.Router();
const dataConnection = require('../models/connections/data');
const CustomerSupport=dataConnection.models.CustomerSupport;
const { createUserCode} = require('../services/utils');
const { getUser } = require('../services/apiCalls');
const {v1} =require('uuid');
const uuidv1 = v1;


router.get('/',async(req,res)=>{
    try{
        let customerSupport = await CustomerSupport.find({})
        if(customerSupport!==null){
            console.log("found customerSupport")
            res.status(201).json({success:true,customerSupport:customerSupport})
        }
       
    }catch(error){
        console.log(error);
        res.status(400).json({success:false})
    }
})
router.post('/',async(req,res)=>{
    const customerSupport = req.body
    console.log(req.body)
    
    
    
    try{
        let user = await getUser("27"+customerSupport.phone)
        if(user!==null){
          customerSupport.userId=user.id
          customerSupport.customerSupportCode=user.userCode
        }else{
          customerSupport.userId=uuidv1()
          customerSupport.customerSupportCode=createUserCode(customerSupport);
        }
        
        let newCustomerSupport= new CustomerSupport(customerSupport)
        let savedCustomerSupport = await newCustomerSupport.save(); 
        console.log(savedCustomerSupport,"saved employee");
        
        res.status(201).json({success:true,customerSupport:savedCustomerSupport})
    }catch(error){
        console.log(error)
        res.status(400).json({success:false})
    }
    
})

router.get('/:id',async(req,res)=>{
    const id = req.params.id;
    try{
        let customerSupport = await CustomerSupport.findOne({userId:id})
        if(customerSupport!==null){
            console.log("found customerSupport")
            res.status(201).json({success:true,customerSupport:customerSupport})
        }
       
    }catch(error){
        console.log(error);
        res.status(400).json({success:false})
    }
})

router.post('/:id',async(req,res)=>{
    const id = req.params.id;
    const customerSupport = req.body.customerSupport
    try{
        let updatedCustomerSupport= await CustomerSupport.findByIdAndUpdate(customerSupport._id,customerSupport)
        if(updatedCustomerSupport!==null){
            console.log("updated customerSupport")
            console.log(updatedCustomerSupport)
            res.status(201).json({success:true})
        }
       
    }catch(error){
        console.log(error);
        res.status(400).json({success:false})
    }
})

router.delete('/:id',async(req,res)=>{
    const customerSupport = req.body.customerSupport
   
    try{
        await CustomerSupport.findByIdAndRemove(customerSupport._id),
        res.status(201).json({success:true})
        
       
    }catch(error){
        console.log(error);
        res.status(400).json({success:false})
    }
})

module.exports=router;