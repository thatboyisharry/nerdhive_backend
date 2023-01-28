const mongoose = require("mongoose");


const Schema = mongoose.Schema;

const TemplateSchema = new Schema({
    id:{
        type:String
    },
    name:{type:String,required:true},
    value:{type:{}},
   
})

const ProjectSchema = new Schema(
    {
        id:{type:String},
        name:{
            type:String,
            required:true,
        },
        flows:{
            type:[]
        },
        businessID:{
            type:String
        },
         templates:{
            type:[TemplateSchema]
        },
    }
)

// module.exports = mongoose.model("Project", ProjectSchema);
module.exports= ProjectSchema