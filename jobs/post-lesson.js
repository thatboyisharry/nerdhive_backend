const { getAppointments } = require("./utils");
const { getLesson, getLearner, getTutor, getTemplate, getUser, updateUser } = require("../services/apiCalls");
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
    let appointments=await getAppointments();

     // we need to set an appointments filter to filter out appointments that didn't take place
    if(appointments.length>0){
       
        for (let j = 0 ; j < appointments.length; j++){
            let appointment=appointments[j]
            let lessonId = appointment.lessonId;
            let lesson = await getLesson(lessonId);
            await sendPostLessonSurvey(lesson,appointment)

        }
    }
  if (parentPort) parentPort.postMessage('done');
  else process.exit(0);
}





const sendPostLessonSurvey=async(lesson,appointment)=>{
    const {learnerId, tutorId}= lesson;
    let learner = await getLearner(learnerId)
    let tutor = await getTutor(tutorId)
    let learnerMsgTemplate = await getTemplate("learnerPostLessonSurvey");
    let tutorMsgTemplate = await getTemplate("tutorPostLessonSurvey");

   

    let data={
        lesson,
        tutor,
        appointment,
        learner
    }
    await sendTemplateMessage(learnerMsgTemplate,data,learner);
    await sendTemplateMessage(tutorMsgTemplate,data,tutor);

     //updated user object (session.data.lesson)so that we know the lesson that is being referenced
     let learnerUser = await getUser(learner.userId)
     let date = new Date()
     learnerUser.session={
       flow:'post_lesson',
       node:'start',
       data:{lesson:lesson},
       lastUpdated:date,
       isActive:true
     }
     await updateUser(learnerUser)
     let tutorUser = await getUser(tutor.userId)
     tutorUser.session={
       flow:'post_lesson',
       node:'start',
       data:{lesson:lesson},
       lastUpdated:date,
       isActive:true
     }
     await updateUser(tutorUser)
    
}

main().catch(err => console.log(err));