const mongoose = require('mongoose');


const Schema = mongoose.Schema;


const StudyNotesSchema = new Schema({
        id:{type:String,required:true},
        userId:{type:String,required:true},
        subject:{type:String,required:true},
        topic:{type:String,required:true},
        subtopics:{type:[String]},
        notesText:{type:String},
        notesLink:{type:String},
        reportId:{type:String},
        worksheetId:{type:String},
        date:{
            type:String
        },
    
    },

    { timestamps: true }
)


// exports.Job = mongoose.models.Job || mongoose.model('Job',JobSchema);
module.exports= StudyNotesSchema