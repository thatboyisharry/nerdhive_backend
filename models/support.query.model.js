const mongoose = require('mongoose');


const Schema = mongoose.Schema;


const CustomerQuerySchema = new Schema({
        id:{type:String,required:true},
        userId:{type:String,required:true},
        type:{type:String,required:true},
        leadId:{type:String},
        user:{},
        lead:{},
        queryInfo:{
          imageLink:{type:String},
        },
        sentTo:{type:[String]},
        messages:{type:[String]},
        status:{type:String,required:true,default:'unresolved'},
        solver:{
            userId:{type:String},
            rating:{type:String}
        },
  
        notes:{
            type:String
        },
        date:{
            type:String
        },
    
    },

    { timestamps: true }
)


// exports.Job = mongoose.models.Job || mongoose.model('Job',JobSchema);
module.exports= CustomerQuerySchema