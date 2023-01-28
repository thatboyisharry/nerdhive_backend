const express=require('express');
const router=express.Router();
const { cloudinary }=require('../config/cloudinary')


router.post('/studytools', async (req, res) => {
  try {
     const fileStr= req.body.image;
     const data = "data:image/jpeg;base64,"+fileStr;
     const uploadResponse = await cloudinary.uploader.
     upload(data,{
       upload_preset:'nerdhive_whatsapp_studytools',
       resource_type:'image',
  
     })
     res.status(201).json(uploadResponse)
    // console.log(uploadResponse)
    console.log("success")
  }
  catch(error){
     console.log(error)
    }
})

module.exports=router;
