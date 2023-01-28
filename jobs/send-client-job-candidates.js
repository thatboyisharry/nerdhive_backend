const { getActiveJobs, isSentJob } = require("./utils");
const {  getTemplate, getJobs, getTutors, updateUser, getTutor, getLearner } = require("../services/apiCalls");
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
    let allJobs = await getJobs();
    let activeJobs = getActiveJobs(allJobs)

    for(let i = 0 ; i <activeJobs.length; i++){
        let job = activeJobs[i];
        try {
            await sendClientCandidates(job);
        } catch (error) {
            console.log(error)
        }
        
    }

    
     // signal to parent that the job is done
  if (parentPort) parentPort.postMessage('done');
  else process.exit(0);
}

const sendClientCandidates=async(job)=>{
    //filter out interested and uninterested candidates
    try {
        let candidates = job.interestedCandidates;
        //send to candidate to learner hence getting learner
        let learner = await getLearner(job.lesson.learnerId)
        let candidateTemplate= await getTemplate("job_candidate")
        for(let i = 0 ; i<candidates.length; i++){
            let candidate = candidates[i];
            let tutor = await getTutor(candidate)
            
            let data={
                tutor,
                job
            }
            await sendTemplateMessage(candidateTemplate,data,learner);
    
        }
    } catch (error) {
        console.log(error)
    }
    
}


main().catch(err => console.log(err));