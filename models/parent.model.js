const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const ParentSchema = new Schema({
    userId:{type:String,required:true},
    phone:{type:String,required:true},
    parentCode:{type:String,required:true},
    email:{type:String},
    name:{type:String,required:true},
    surname:{type:String,required:true},
    learners:{type:[String]},
    coach:{type:String}
})


// let Parent = mongoose.model('Parent',ParentSchema);
// exports.Parent = Parent

module.exports= ParentSchema