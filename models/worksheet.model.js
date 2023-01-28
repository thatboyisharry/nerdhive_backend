const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const WorksheetSchema = new Schema({
    id:{type:String,required:true},
    topic:{type:String},
    subtopic:{type:String},
    subject:{type:String},
    grade:{type:Number},
    questions:[]
})


// let Worksheet = mongoose.model('Worksheet',WorksheetSchema);
// exports.Worksheet = Worksheet
module.exports= WorksheetSchema