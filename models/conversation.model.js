const mongoose = require('mongoose');


const Schema = mongoose.Schema;


const ConversationSchema = new Schema({
        id:{type:String,required:true},
        userId:{type:String,required:true},
        messages:[],
        topic:{type:String},
        subtopic:{type:String},
        tokens:{type:Number},
        total_messages:{type:Number}
    },

    { timestamps: true }
)


// exports.Job = mongoose.models.Job || mongoose.model('Job',JobSchema);
module.exports= ConversationSchema