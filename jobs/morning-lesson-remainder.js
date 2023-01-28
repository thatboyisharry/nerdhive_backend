const { getLesson, getLearner, getTutor, getTemplate } = require("../services/apiCalls");
const { sendTemplateMessage } = require("../services/sendTemplateMessages");
const { getAppointments, getAppointmentMembers } = require("./utils");
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
    if(appointments.length>0){
        let members = await getAppointmentMembers(appointments)
        let learners = members.learners;
        let tutors = members.tutors;
         // send morning texts to learners
         for(let i = 0 ; i<learners.length; i++){
            let learnerId = learners[i];
            let learner = await getLearner(learnerId);
            await sendLearnerGoodMorningText(learner)
            //create sendLearnerGoodMorningText
        }

         // send morning texts to tutors
         for(let i = 0 ; i<tutors.length; i++){
            let tutorId = tutors[i];
            let tutor = await getTutor(tutorId);
            await sendTutorGoodMorningText(tutor)
            //create sendTutorGoodMorningText
        }

        for (let j = 0 ; j < appointments.length; j++){
            let appointment=appointments[j]
            let lessonId = appointment.lessonId;
            let lesson = await getLesson(lessonId);
            await sendMorningLessonRemainder(lesson,appointment)

        }



        //update session
    }
    if (parentPort) parentPort.postMessage('done');
  else process.exit(0);
}

main().catch(err => console.log(err));













const sendMorningLessonRemainder=async(lesson,appointment)=>{
    const {learnerId, tutorId}= lesson;
    let learner = await getLearner(learnerId)
    let tutor = await getTutor(tutorId)
    let learnerMsgTemplate = await getTemplate("learnerMorniningLessonRemainder");
    let tutorMsgTemplate = await getTemplate("tutorMorniningLessonRemainder");
    let data={
        lesson,
        tutor,
        appointment,
        learner,
    
    }
    await sendTemplateMessage(learnerMsgTemplate,data,learner);
    await sendTemplateMessage(tutorMsgTemplate,data,tutor);
    
}

const sendLearnerGoodMorningText=async(learner)=>{

    let  msgTemplate = await getTemplate("learnerGoodMorningText");
    let  data ={
        learner
    }
    await sendTemplateMessage(msgTemplate,data,learner)

}

const sendTutorGoodMorningText=async(tutor)=>{
    let  msgTemplate = await getTemplate("tutorGoodMorningText");
    let  data ={
        tutor
    }
    await sendTemplateMessage(msgTemplate,data,tutor)
}
