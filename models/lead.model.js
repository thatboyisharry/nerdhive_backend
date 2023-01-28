const mongoose = require("mongoose");


const Schema = mongoose.Schema;


const LeadSchema = new Schema({
    userId:{type:String},
    leadCode:{type:String},
    isParent:{type:Boolean,default:false},
    isBoy:{type:Boolean,default:false},
    isGirl:{type:Boolean,default:false},
    isLearner:{type:Boolean,default:false},
    schoolingLevel:{type:String,default:null},
    name:{type:String,default:null},
    learnerName:{type:String,default:null},
    parentName:{type:String,default:null},
    surname:{type:String,default:null},
    school:{type:String,default:null},
    grade:{type:String,default:null},
    studentProgram:{type:String,default:null},
    phone:{type:String,default:null,required:true},
    email:{type:String,default:null},
    location:{type:String,default:null},
    budget:{type:String,default:null},
    questionnaire_responses:{},
    data:{},
    
   
},
{ timestamps: true }
);



// exports.LeadSchema=LeadSchema;
// exports.Lead = mongoose.models.Lead || mongoose.model('Lead',LeadSchema);

module.exports= LeadSchema