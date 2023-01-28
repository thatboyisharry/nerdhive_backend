const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const noteSchema = new Schema({
    id:{type:String,required:true},
    date:{type:Date,required:true},
    title:{type:String,required:true},
    body:{type:String,required:true},
})

const profileSchema = new Schema({
    description:{type:String},
    subjects:{type:[String]},
    grades:{type:[String]},
    strengths:{type:String},
    strategies:{type:String},
    notes:{type:[noteSchema]}
})

const TutorSchema = new Schema({
    userId:{type:String,required:true},
    name:{type:String,required:true},
    surname:{type:String,required:true},
    phone:{type:String,required:true},
    tutorCode:{type:String,required:true},
    email:{type:String},
    lessons:{type:[String]},
    isHelping:{type:Boolean,default:false},
    isCoach:{type:Boolean,default:false},
    sentJobs:{type:[String]},
    learners:{type:[String]},
    profile:{type:profileSchema},
    coachId:{type:String},
})


// let Tutor = mongoose.model('Tutor',TutorSchema);
// exports.Tutor = Tutor
module.exports= TutorSchema