const mongoose = require('mongoose');


const Schema = mongoose.Schema;


const SolvedQuestionSchema = new Schema({
            questionId:{type:String,required:true},
            learnerId:{type:String,required:true},
            solverId:{type:String,required:true},
            rating:{type:String,required:true
        },
    },
    
    { timestamps: true }
)


// exports.Job = mongoose.models.Job || mongoose.model('Job',JobSchema);
module.exports= SolvedQuestionSchema