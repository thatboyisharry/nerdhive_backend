const mongoose = require('mongoose');


const Schema = mongoose.Schema;


const QuerySchema = new Schema({
        id:{type:String,required:true},
        userId:{type:String,required:true},
        prompt:{type:String,required:true},
        response:{type:String,required:true},
        type:{type:String},
        subject:{type:String},
        date:{
            type:String
        },
    
    },

    { timestamps: true }
)


// exports.Job = mongoose.models.Job || mongoose.model('Job',JobSchema);
module.exports= QuerySchema