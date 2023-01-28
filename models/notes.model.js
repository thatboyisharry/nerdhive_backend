const mongoose = require('mongoose');


const Schema = mongoose.Schema;


const NotesSchema = new Schema({
        id:{type:String,required:true},
        subject:{type:String},
        topic:{type:String,required:true},
        subtopic:{type:String},
        notes:{type:String},
       
    
    },

    { timestamps: true }
)


// exports.Job = mongoose.models.Job || mongoose.model('Job',JobSchema);
module.exports= NotesSchema