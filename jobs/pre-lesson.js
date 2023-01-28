const { getAppointments } = require("./utils");
const { getLesson, getLearner, getTutor, getTemplate } = require("../services/apiCalls");
const { sendTemplateMessage } = require("../services/sendTemplateMessages");
const mongoose = require('mongoose');
let dbRoute=process.env.MONGO_URL;
const fs = require('fs');
const path = require('path');
const { parentPort } = require('worker_threads');

const Cabin = require('cabin');

const { Signale } = require('signale');





// initialize cabin
const cabin = new Cabin({
  axe: {
    logger: new Signale()
  }
});

// store boolean if the job is cancelled
let isCancelled = false;

// handle cancellation (this is a very simple example)
if (parentPort)
  parentPort.once('message', message => {
    if (message === 'cancel') isCancelled = true;
  });

async function main(){
    await mongoose.connect(dbRoute);
    let db=mongoose.connection;
    let hour = new Date().getHours

    let allAppointments=await getAppointments();
    let appointments=[]
    // we need to set an appointments filter to filter out appointments that are more than an hour away
    for(let i = 0; i<allAppointments.length; i++){
        if(allAppointments[i].time-1===hour){
            appointments.push(allAppointments[i])
        }
    }
    if(appointments.length>0){
        
        for (let j = 0 ; j < appointments.length; j++){
            let appointment=appointments[j]
            let lessonId = appointment.lessonId;
            let lesson = await getLesson(lessonId);
            await sendPreLessonRemainder(lesson,appointment)

        }
    }
     // signal to parent that the job is done
  if (parentPort) parentPort.postMessage('done');
  else process.exit(0);
}



const sendPreLessonRemainder=async(lesson,appointment)=>{
    const {learnerId, tutorId}= lesson;
    let learner = await getLearner(learnerId)
    let tutor = await getTutor(tutorId)
    let learnerMsgTemplate = await getTemplate("learnerPreLessonRemainder");
    let tutorMsgTemplate = await getTemplate("tutorPreLessonRemainder");

    // generate zoom link and send inside data
    let link
    let data={
        lesson,
        tutor,
        appointment,
        learner,
        link
    
    }
    await sendTemplateMessage(learnerMsgTemplate,data,learner);
    await sendTemplateMessage(tutorMsgTemplate,data,tutor);
    
}

main().catch(err => console.log(err));