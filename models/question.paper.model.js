const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const QuestionPaperSchema = new Schema({
    id:{type:String,required:true},
    year:{type:String},
    term:{type:String},
    grade:{type:Number},
    paper:{type:Number},
    questionPaper:{id:{type:String}},
    memo:{id:{type:String}},
    lastUpdated:{type:Date}
})


// let QuestionPaper = mongoose.model('QuestionPaper',QuestionPaperSchema);
// exports.QuestionPaper = QuestionPaper
module.exports= QuestionPaperSchema