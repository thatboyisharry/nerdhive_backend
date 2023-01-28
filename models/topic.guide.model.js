const mongoose = require('mongoose');


const Schema = mongoose.Schema;


const TopicGuideSchema = new Schema({
        id:{type:String,required:true},
        subject:{type:String},
        grade:{type:Number},
        topic:{type:String,required:true},
        subtopic:{type:String},
        guide:{type:String},
       
    },

    { timestamps: true }
)


// exports.Job = mongoose.models.Job || mongoose.model('Job',JobSchema);
module.exports= TopicGuideSchema