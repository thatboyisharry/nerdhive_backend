const mongoose = require('mongoose');


const Schema = mongoose.Schema;


const TestSchema = new Schema({
        id:{type:String,required:true},
        userId:{type:String,required:true},
        topic:{type:String,required:true},
        subtopics:{type:[String]},
        total_correct:{type:String},
        total_incorrect:{type:String},
        correct_quetsions:[],
        incorrect_questions:[],
        percentage:{type:Number},
        subject:{type:String},
        date:{
            type:String
        },
    
    },

    { timestamps: true }
)


// exports.Job = mongoose.models.Job || mongoose.model('Job',JobSchema);
module.exports= TestSchema