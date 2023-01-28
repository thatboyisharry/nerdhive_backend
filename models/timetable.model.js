const mongoose = require('mongoose');

const Schema = mongoose.Schema;


const AppointmentSchema = new Schema({
    id:{type:String},
    time:{type:String},
    day:{type:String},
    lessonId:{type:String,default:null},
})

const TimetableSchema = new Schema({
    userId:{type:String,required:true},
   monday:{type:[AppointmentSchema]},
   tuesday:{type:[AppointmentSchema]},
   wednesday:{type:[AppointmentSchema]},
   thursday:{type:[AppointmentSchema]},
   friday:{type:[AppointmentSchema]},
   saturday:{type:[AppointmentSchema]},
   sunday:{type:[AppointmentSchema]},
})


// let Timetable = mongoose.model('Timetable',TimetableSchema);
// exports.Timetable = Timetable
module.exports= TimetableSchema