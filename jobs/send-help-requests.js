const { getUnsolvedQuestions, getNextTutor } = require("./utils");
const {  getTemplate, getLearnerQuestions,updateLearnerQuestion, getTutors, updateUser, getUser } = require("../services/apiCalls");
const { sendTemplateMessage } = require("../services/sendTemplateMessages");
const mongoose = require('mongoose');
let dbRoute=process.env.MONGO_URL;
const fs = require('fs');
const path = require('path');
const { parentPort } = require('worker_threads');

const Cabin = require('cabin');

const { Signale } = require('signale');

const delay = require('delay')
const ms=require('ms');




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
    let learnerQuestions = await getLearnerQuestions();
    if(!learnerQuestions||learnerQuestions.length===0){
      return null
    }
    // questions can be unsolved, solved , solving
    let unsolvedQuestions = getUnsolvedQuestions(learnerQuestions);
    console.log("unsolvedQuestions")
     console.log(unsolvedQuestions)
    for(let i = 0 ; i <unsolvedQuestions.length; i++){
        let question = unsolvedQuestions[i];
        try {
            await sendHelpRequest(question);
        } catch (error) {
            console.log(error)
        }
        
    }

    
     // signal to parent that the job is done
  if (parentPort) parentPort.postMessage('done');
  else process.exit(0);
}

const sendHelpRequest=async(question)=>{
    
    //filter out interested and uninterested candidates
    try {
        let tutors = await getTutors();
        //write algorithm to get the next tutor to receive the request
        //filter out those that not available and those that have already got the question
        //filter out those already helping someone
        //filter out those with an active help request
        // let availableTutor = await getAvailableTutors(tutors);
        let tutor = await getNextTutor(tutors,question);
        if(tutor==null){
          return null
        }
        console.log("fetching template")
      
        await delay(ms('5s'));
        let helpRequestTemplate= await getTemplate("help_request_invite")
         console.log(helpRequestTemplate)
        let data={
                question
              }
        await delay(ms('5s'));
        await sendTemplateMessage(helpRequestTemplate,data,tutor);


        //add tutor to list of tutors that received the question
        question.sentTo.push(tutor.userId);
        let tutorUser = await getUser(tutor.phone)
        tutorUser.session.helpRequest.invite=true;
        tutorUser.session.helpRequest.requestId=question.id;
        tutorUser.session.helpRequest.learnerId=question.userId;
        let date = new Date()
        tutorUser.session.flow='help_request';
        tutorUser.session.node='invite'
        tutorUser.session.lastUpdated=date;

        await updateLearnerQuestion(question)
        await updateUser(tutorUser);
        
    } catch (error) {
        console.log(error)
    }
    
}


main().catch(err => console.log(err));