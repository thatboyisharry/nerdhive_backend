const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const CoachSchema = new Schema({
    userId:{type:String,required:true},
    name:{type:String,required:true},
    surname:{type:String,required:true},
    phone:{type:String,required:true},
    coachCode:{type:String,required:true},
    email:{type:String},
    sessions:{type:[String]},
    learners:{type:[String]},
    parents:{type:[String]},
    tutors:{type:[String]},
})


// let Coach = mongoose.model('Coach',CoachSchema);
// exports.Coach = Coach
module.exports= CoachSchema