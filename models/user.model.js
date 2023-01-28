const mongoose = require("mongoose");


const Schema = mongoose.Schema;

const UserSchema = new Schema(
  {
    id:{
      type:String,
      required:true,
    },
    
    grade:{
      type:String,
    },
    name: {
      type: String,
      default:null,
      min: 3,
      max: 20,
      unique: true,
    },
    username: {
      type: String,
      default:null,
      min: 3,
      max: 20,
      unique: true,
    },
    userCode:{
      type: String,
      min: 3,
      max: 20,
      unique: true,
    },
    email: {
      type: String,
      max: 50,
      unique: true,
    },
    password: {
      type: String,
      min: 6,
    },
    phone: {
        type: String,
        required: true,
        min: 10,
        max:11
      },
    type: {
      type: String,
      default: "",
    },

    isParent: {
        type: Boolean,
        default: false,
      },
    isLead: {
        type: Boolean,
        default: false,
      },
    isLearner: {
        type: Boolean,
        default: false,
    },
    
    isTutor: {
      type: Boolean,
      default: false,
    },
    
    isCoach: {
      type: Boolean,
      default: false,
    },

    isAdmin: {
      type: Boolean,
      default: false,
    },
    isOnboarded: {
      type: Boolean,
      default: false,
    },
    isOnboarding: {
      type: Boolean,
      default: false,
    },
    session:{
      flow:{type:String},
      node:{type:String},
      num:{type:Number},
      lastUpdated:{type:Date},
      prevFlow:{type:String},
      prevNode:{type:String},
      isActive:{type:Boolean,default:false},
      queries:[],
      customerSupport:{
        invite:{type:Boolean,default:false},
        queryId:{type:String},
        leadId:{type:String},
        assisting:{type:Boolean,default:false},
        participant:{type:String}
      },
      helpRequest:{
        invite:{type:Boolean,default:false},
        requestId:{type:String},
        learnerId:{type:String},
        solving:{type:Boolean,default:false},
        participant:{type:String}
      },
      chat:{
        invite:{type:Boolean,default:false},
        cancelled:{type:Boolean,default:false},
        active:{type:Boolean,default:false},
        participant:{type:String},
      },
      data:{}
    }  
  },
  { timestamps: true }
);

// module.exports = mongoose.model("User", UserSchema);
module.exports= UserSchema
