const mongoose = require('mongoose');
const  LessonSchema  = require('./lesson.model');



const Schema = mongoose.Schema;

const objectiveSchema = new Schema({
    objective:{type:String}
})

const JobSchema = new Schema({
    id:{type:String,required:true},
    lesson:{type:LessonSchema},
    interestedCandidates:{type:[String]},
    uninterestedCandidates:{type:[String]},
    status:{type:String,required:true,default:'active'},
    payout:{type:String,required:true}
    
})


// exports.Job = mongoose.models.Job || mongoose.model('Job',JobSchema);
module.exports= JobSchema