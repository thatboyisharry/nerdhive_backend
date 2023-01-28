const mongoose = require("mongoose");


const Schema = mongoose.Schema;

const noteSchema = new Schema({
    id:{type:String,required:true},
    date:{type:Date,required:true},
    title:{type:String,required:true},
    body:{type:String,required:true},
})

const profileSchema = new Schema({
    description:{type:String},
    goals:{type:String},
    strengths:{type:String},
    strategies:{type:String},
    notes:{type:[noteSchema]}
})



const LearnerSchema = new Schema({
    userId:{type:String,required:true},
    learnerCode:{type:String},
    parentId:{type:String},
    name:{type:String,required:true},
    surname:{type:String,required:true},
    school:{type:String,required:true},
    grade:{type:String,required:true},
    phone:{type:String,required:true},
    email:{type:String},
    location:{type:String},
    profile:{type:profileSchema},
    coachId:{type:String}
   
    

});






// exports.LearnerSchema=LearnerSchema;
// exports.Learner = mongoose.models.Learner || mongoose.model('Learner',LearnerSchema);

module.exports= LearnerSchema