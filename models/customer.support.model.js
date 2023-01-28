const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const CustomerSupportSchema = new Schema({
    userId:{type:String,required:true},
    name:{type:String,required:true},
    surname:{type:String,required:true},
    phone:{type:String,required:true},
    customerSupportCode:{type:String,required:true},
    isHelping:{type:Boolean,default:false},
    email:{type:String},
    queries:{type:[String]},
    assignedLeads:{type:[String]},
   
})


// let CustomerSupport = mongoose.model('CustomerSupport',CustomerSupportSchema);
// exports.CustomerSupport = CustomerSupport
module.exports= CustomerSupportSchema